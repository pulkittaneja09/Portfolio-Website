import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The hero's neural mesh: a node graph that drifts, pulses and leans toward the
 * cursor. Nodding at agent graphs and vector retrieval without being literal.
 *
 * Everything in this file lands in a lazy chunk (see HeroVisual), so three.js
 * never touches the initial page load.
 */

const NODE_COUNT = 110;
const LINK_DISTANCE = 1.08;
const RADIUS = 2.45;

interface Graph {
  positions: Float32Array;
  linkPositions: Float32Array;
  /** Phase offset per node so pulses do not fire in unison. */
  phases: Float32Array;
}

function buildGraph(): Graph {
  // Fibonacci sphere, jittered inward, gives even coverage without clustering
  // at the poles — and the jitter keeps it from reading as a wireframe ball.
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < NODE_COUNT; i += 1) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const jitter = 0.72 + Math.random() * 0.28;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * ring * RADIUS * jitter,
        y * RADIUS * jitter,
        Math.sin(theta) * ring * RADIUS * jitter,
      ),
    );
  }

  const positions = new Float32Array(NODE_COUNT * 3);
  const phases = new Float32Array(NODE_COUNT);
  points.forEach((p, i) => {
    positions.set([p.x, p.y, p.z], i * 3);
    phases[i] = Math.random() * Math.PI * 2;
  });

  const links: number[] = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      if (points[i].distanceTo(points[j]) < LINK_DISTANCE) {
        links.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
      }
    }
  }

  return { positions, linkPositions: new Float32Array(links), phases };
}

/** Soft round sprite for the nodes — square points look like a bug. */
function useDotTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.45, 'rgba(255,255,255,0.85)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function Mesh({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Points>(null);
  const graph = useMemo(buildGraph, []);
  const dot = useDotTexture();
  const { pointer } = useThree();

  const nodeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(graph.positions.slice(), 3));
    return geometry;
  }, [graph]);

  const linkGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(graph.linkPositions, 3));
    return geometry;
  }, [graph]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      // Constant slow drift, plus a lean toward the cursor that eases back
      // to centre when the pointer leaves.
      group.current.rotation.y += delta * 0.085;
      const targetX = pointer.y * 0.32;
      const targetZ = -pointer.x * 0.16;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.045;
      group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.045;
      group.current.position.x += (pointer.x * 0.22 - group.current.position.x) * 0.04;
      group.current.position.y += (pointer.y * 0.16 - group.current.position.y) * 0.04;
    }

    // Breathe each node along its own radius so the graph feels alive rather
    // than rigid. Writing straight into the buffer avoids per-frame allocation.
    if (nodes.current) {
      const attribute = nodes.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = attribute.array as Float32Array;
      for (let i = 0; i < NODE_COUNT; i += 1) {
        const scale = 1 + Math.sin(t * 0.9 + graph.phases[i]) * 0.022;
        array[i * 3] = graph.positions[i * 3] * scale;
        array[i * 3 + 1] = graph.positions[i * 3 + 1] * scale;
        array[i * 3 + 2] = graph.positions[i * 3 + 2] * scale;
      }
      attribute.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial color={accent} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>

      <points ref={nodes} geometry={nodeGeometry}>
        <pointsMaterial
          color={accent}
          map={dot}
          size={0.115}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* A dim inner shell gives the cloud depth without reading as a sphere. */}
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export default function NeuralMesh({ accent }: { accent: string }) {
  return (
    <Canvas
      // Cap DPR: the mesh is decorative and not worth 3x pixels on a retina panel.
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <Mesh accent={accent} />
    </Canvas>
  );
}
