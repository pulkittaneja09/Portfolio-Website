import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A grayscale point cloud shaped as a sphere: thousands of tiny white points
 * at varying opacity, rotating slowly, bending away from the cursor.
 *
 * No colour, no glow, no emissive material. The depth comes from per-point
 * opacity and size varying with distance, which is also what keeps it from
 * reading as a wireframe ball.
 *
 * Everything here lands in a lazy chunk (see HeroVisual), so three.js never
 * touches the initial page load.
 */

const COUNT = 4200;
const RADIUS = 2.15;
/** How far from the cursor a point still feels the push, in world units. */
const PUSH_RADIUS = 1.15;
const PUSH_STRENGTH = 0.46;

interface Cloud {
  /** Resting position, never mutated. */
  base: Float32Array;
  /** Live position written each frame. */
  live: Float32Array;
  /** Per-point brightness, 0..1. */
  alpha: Float32Array;
  /** Per-point size multiplier. */
  scale: Float32Array;
}

function buildCloud(): Cloud {
  const base = new Float32Array(COUNT * 3);
  const alpha = new Float32Array(COUNT);
  const scale = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i += 1) {
    // Even distribution over the sphere: inverting the cosine avoids the
    // polar clustering you get from naive spherical sampling.
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);

    // Most points sit on the shell, a minority drift inward, so the cloud
    // reads as volume rather than a hollow shell.
    const depth = Math.random() < 0.82 ? 1 : 0.45 + Math.random() * 0.5;
    const r = RADIUS * depth;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    base.set([x, y, z], i * 3);
    alpha[i] = 0.18 + Math.random() * 0.82;
    scale[i] = 0.55 + Math.random() * 0.75;
  }

  return { base, live: base.slice(), alpha, scale };
}

/** Round sprite. Square points look like a rendering bug. */
function useDotTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/**
 * Per-point opacity and size need a custom shader: PointsMaterial applies one
 * opacity and one size to the whole cloud.
 */
const VERTEX = /* glsl */ `
  attribute float aAlpha;
  attribute float aScale;
  uniform float uSize;
  uniform float uDpr;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // gl_PointSize is in device pixels, so multiplying by the device pixel
    // ratio keeps the apparent CSS size constant across displays. Dividing by
    // view-space depth gives the perspective falloff: near points read larger.
    gl_PointSize = uSize * aScale * uDpr / -mvPosition.z;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    if (tex.a < 0.02) discard;
    gl_FragColor = vec4(uColor, tex.a * vAlpha * uOpacity);
  }
`;

function Cloud({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const cloud = useMemo(buildCloud, []);
  const dot = useDotTexture();
  const { viewport, gl } = useThree();

  // The canvas is pointer-events: none (it sits under the hero copy), so R3F's
  // own pointer never updates. Track the cursor on the window instead, mapped
  // into the canvas' normalised device coordinates. Off-canvas values simply
  // land outside the sphere and push nothing.
  const pointer = useRef({ x: 9, y: 9 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => {
      pointer.current.x = 9;
      pointer.current.y = 9;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [gl]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(cloud.live, 3));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(cloud.alpha, 1));
    g.setAttribute('aScale', new THREE.BufferAttribute(cloud.scale, 1));
    return g;
  }, [cloud]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: dot },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      // Tuned so a point lands around 2px at the resting camera distance.
      // Anything larger and 4,200 sprites merge into a solid disc.
      uSize: { value: 13 },
      uDpr: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [dot, color, gl],
  );

  // Reused across frames so the loop allocates nothing.
  const cursor = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Fade the whole cloud in once, rather than popping on first paint.
    uniforms.uOpacity.value = Math.min(1, uniforms.uOpacity.value + delta * 0.9);

    if (group.current) {
      group.current.rotation.y += delta * 0.055;
      group.current.rotation.x = Math.sin(t * 0.12) * 0.09;
    }

    // Cursor in world space on the sphere's plane. The push is applied in
    // local space, so it stays put on the surface as the cloud rotates.
    const half = {
      x: (pointer.current.x * viewport.width) / 2,
      y: (pointer.current.y * viewport.height) / 2,
    };
    cursor.current.set(half.x, half.y, RADIUS * 0.6);
    if (group.current) group.current.worldToLocal(cursor.current);

    const live = cloud.live;
    const base = cloud.base;
    const cx = cursor.current.x;
    const cy = cursor.current.y;
    const cz = cursor.current.z;

    for (let i = 0; i < COUNT; i += 1) {
      const i3 = i * 3;
      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];

      const dx = bx - cx;
      const dy = by - cy;
      const dz = bz - cz;
      const distSq = dx * dx + dy * dy + dz * dz;

      let tx = bx;
      let ty = by;
      let tz = bz;

      if (distSq < PUSH_RADIUS * PUSH_RADIUS) {
        const dist = Math.sqrt(distSq) || 0.0001;
        // Smooth falloff — a linear one makes a visible hard rim.
        const falloff = 1 - dist / PUSH_RADIUS;
        const push = (falloff * falloff * PUSH_STRENGTH) / dist;
        tx = bx + dx * push;
        ty = by + dy * push;
        tz = bz + dz * push;
      }

      // Ease toward the target so the bend lags the cursor slightly.
      live[i3] += (tx - live[i3]) * 0.1;
      live[i3 + 1] += (ty - live[i3 + 1]) * 0.1;
      live[i3 + 2] += (tz - live[i3 + 2]) * 0.1;
    }

    if (points.current) {
      (points.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

interface Props {
  color: string;
  /** False while the hero is off screen: the render loop stops entirely. */
  active: boolean;
  onReady?: () => void;
}

export default function PointSphere({ color, active, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      onCreated={() => onReady?.()}
      // Decorative: not worth 3x pixels on a retina panel.
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <Cloud color={color} />
    </Canvas>
  );
}
