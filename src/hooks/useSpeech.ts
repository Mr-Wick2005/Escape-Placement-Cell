import { useState } from 'react';

interface RecognitionErrorEvent extends Event {
  error: string;
}

interface RecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type RecognitionCtor = new () => Recognition;

export const useSpeech = (onText: (text: string) => void) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supported =
    typeof window !== 'undefined' &&
    Boolean(
      (window as unknown as { SpeechRecognition?: RecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition
    );

  const start = () => {
    setError(null);
    const browser = window as unknown as {
      SpeechRecognition?: RecognitionCtor;
      webkitSpeechRecognition?: RecognitionCtor;
    };
    const Ctor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;

    if (!Ctor) {
      setError('Voice input is not supported in this browser. Please type your answer.');
      return;
    }

    try {
      const recognition = new Ctor();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? '';
        onText(transcript);
      };

      recognition.onerror = (e) => {
        setListening(false);
        if (e.error === 'not-allowed') {
          setError('Microphone access denied. You can continue typing your answer.');
        } else if (e.error === 'no-speech') {
          setError('No speech detected. Please speak clearly or type your answer.');
        } else {
          setError(`Voice input error (${e.error}). You can continue typing.`);
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      setListening(true);
      recognition.start();
    } catch {
      setListening(false);
      setError('Microphone initialization failed. Please type your answer.');
    }
  };

  return { supported, listening, error, start };
};
