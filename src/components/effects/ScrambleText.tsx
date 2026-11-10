import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface Props {
  text: string;
  durationMs?: number;
  className?: string;
}

const GLYPHS = '01#@%&X$*+=~<>[]{}';

export function ScrambleText({ text, durationMs = 600, className = '' }: Props): React.ReactNode {
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion);
  const [displayText, setDisplayText] = useState(() => (reducedMotion ? text : ''));

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const steps = 12;
    const intervalTime = Math.max(25, Math.floor(durationMs / steps));
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const revealedCount = Math.floor(text.length * progress);

      const scrambled = text
        .split('')
        .map((char, i) => {
          if (i < revealedCount || char === ' ') return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text, durationMs, reducedMotion]);

  return <span className={`scramble-text ${className}`}>{reducedMotion ? text : displayText}</span>;
}
