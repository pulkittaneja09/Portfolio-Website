/**
 * Framer Motion's DOM animation features, in their own chunk: LazyMotion
 * loads them after first paint, so nothing on the critical path waits for
 * them. Motion values (the project stack, the progress line) work before
 * they arrive; only enter/exit animations need them, and those are all
 * user-initiated (overlays, toasts).
 */
import { domAnimation } from 'framer-motion';

export default domAnimation;
