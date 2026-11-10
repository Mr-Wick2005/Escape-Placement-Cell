import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

interface Props {
  speaker?: string;
  text: string;
  className?: string;
}

export function RecruiterSubtitles({ speaker = 'Recruiter', text, className = '' }: Props): React.ReactNode {
  const subtitles = useGameStore((s) => s.settings.subtitles);
  const voiceEnabled = useGameStore((s) => s.settings.voiceEnabled);

  useEffect(() => {
    if (!voiceEnabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = 0.85;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch {
      // Speech synthesis fallback
    }

    return () => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // cleanup
      }
    };
  }, [text, voiceEnabled]);

  if (!subtitles || !text) return null;

  return (
    <div className={`recruiter-subtitles-bar ${className}`} role="status" aria-live="polite">
      <span className="speaker-tag">[{speaker}]:</span> {text}
    </div>
  );
}
