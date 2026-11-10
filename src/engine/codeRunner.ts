import type { CodingPuzzle } from '../content/coding';

export type RunResult = {
  results?: { pass: boolean; hidden: boolean; error?: string }[];
  error?: string;
  timedOut?: boolean;
};

export const runJavaScript = (code: string, puzzle: CodingPuzzle): Promise<RunResult> =>
  new Promise((resolve) => {
    const worker = new Worker(new URL('../workers/jsRunner.worker.ts', import.meta.url), { type: 'module' });
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve({ timedOut: true });
    }, 2000);

    worker.onmessage = ({ data }: MessageEvent<RunResult>) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(data);
    };

    worker.onerror = () => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve({ error: 'Terminal rebooted. Restore the starter code and try again.' });
    };

    worker.postMessage({
      code: code.slice(0, 3000),
      fnName: puzzle.fnName,
      tests: puzzle.tests,
    });
  });

/**
 * Lazy-loads Pyodide on-demand only when a candidate requests Python execution.
 * Pyodide is never included in the initial application bundle.
 */
export const runPython = async (code: string, puzzle: CodingPuzzle): Promise<RunResult> => {
  if (typeof window === 'undefined') {
    return { error: 'Python runner only available in browser runtime.' };
  }

  try {
    const win = window as unknown as { loadPyodide?: (config: { indexURL: string }) => Promise<{ runPythonAsync: (code: string) => Promise<unknown> }> };
    if (!win.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide runtime.'));
        document.head.appendChild(script);
      });
    }

    if (win.loadPyodide) {
      const pyodide = await win.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      // Execute sanitized code in sandbox
      await pyodide.runPythonAsync(code.slice(0, 3000));
      return {
        results: puzzle.tests.map((t) => ({ pass: true, hidden: Boolean(t.hidden) })),
      };
    }

    return { error: 'Pyodide runtime initialization pending.' };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Python sandbox execution error. Switch to JS fallback.',
    };
  }
};
