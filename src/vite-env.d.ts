/// <reference types="vite/client" />

interface Window {
  // Dev-only helper for browser checks, defined in src/hooks/motion/loop.ts
  __seek?: (id: string, progress: number, waitMs?: number) => Promise<void>;
}
