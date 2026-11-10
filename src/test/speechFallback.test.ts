import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useSpeech } from '../hooks/useSpeech';

describe('Speech Recognition - Fallbacks & Error Resilience (Part 16.4)', () => {
  it('reports supported: false and sets fallback error when SpeechRecognition is missing', async () => {
    const originalSR = (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    const originalWSR = (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    type SpeechHook = { supported: boolean; listening: boolean; error: string | null; start: () => void };
    let capturedState: SpeechHook | null = null;

    function TestComponent() {
      const speech = useSpeech(vi.fn());
      capturedState = speech;
      return null;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await React.act(async () => {
      root.render(React.createElement(TestComponent));
    });

    expect(capturedState).not.toBeNull();
    expect(capturedState!.supported).toBe(false);

    await React.act(async () => {
      capturedState!.start();
    });

    expect(capturedState!.error).toContain('Voice input is not supported');
    expect(capturedState!.listening).toBe(false);

    root.unmount();
    container.remove();

    // restore
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = originalSR;
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = originalWSR;
  });

  it('handles microphone permission denied (not-allowed) gracefully', async () => {
    let errorHandler: ((e: { error: string }) => void) | null = null;

    class MockDeniedRecognition {
      lang = '';
      interimResults = false;
      onresult = null;
      onerror: ((e: { error: string }) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        errorHandler = this.onerror;
      }
      stop() {}
    }

    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = MockDeniedRecognition;

    type SpeechHook = { supported: boolean; listening: boolean; error: string | null; start: () => void };
    let capturedState: SpeechHook | null = null;

    function TestComponent() {
      const speech = useSpeech(vi.fn());
      capturedState = speech;
      return null;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await React.act(async () => {
      root.render(React.createElement(TestComponent));
    });

    expect(capturedState).not.toBeNull();
    expect(capturedState!.supported).toBe(true);

    await React.act(async () => {
      capturedState!.start();
    });

    expect(capturedState!.listening).toBe(true);

    // Simulate browser denying mic access
    await React.act(async () => {
      errorHandler?.({ error: 'not-allowed' });
    });

    expect(capturedState!.listening).toBe(false);
    expect(capturedState!.error).toContain('Microphone access denied');

    root.unmount();
    container.remove();
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
  });
});
