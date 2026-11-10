import { describe, expect, it, vi } from 'vitest';
import { runJavaScript } from '../engine/codeRunner';
import { CODING_PUZZLES } from '../content/coding';

describe('Code Runner - Infinite Loop Protection (Part 16.4)', () => {
  it('kills while(true){} within 2s and returns timedOut: true', async () => {
    vi.useFakeTimers();

    // Mock Worker to simulate an infinite loop that hangs and never returns a message
    let terminated = false;
    class MockHangingWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      postMessage() {
        // Simulates an infinite loop: never responds
      }
      terminate() {
        terminated = true;
      }
    }

    const originalWorker = globalThis.Worker;
    globalThis.Worker = MockHangingWorker as unknown as typeof Worker;

    try {
      const runnerPromise = runJavaScript('while(true) {}', CODING_PUZZLES[0]);

      // Fast-forward 2000ms
      vi.advanceTimersByTime(2000);

      const result = await runnerPromise;

      expect(terminated).toBe(true);
      expect(result).toEqual({ timedOut: true });
    } finally {
      globalThis.Worker = originalWorker;
      vi.useRealTimers();
    }
  });
});
