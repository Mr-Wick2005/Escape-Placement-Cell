import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../audio/AudioManager';

export function LockdownOverlay(): React.ReactNode {
  const isLockdown = useGameStore((s) => s.isLockdown);
  const clearLockdown = useGameStore((s) => s.clearLockdown);
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion);
  const subtitles = useGameStore((s) => s.settings.subtitles);
  const voiceEnabled = useGameStore((s) => s.settings.voiceEnabled);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isLockdown) return;
    audioManager.play('alarmLockdown');

    if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('Facility compromised. Diagnostic reboot initiated. Breathe, Candidate 404.');
        u.pitch = 0.8;
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
      } catch {
        // Speech synthesis fallback
      }
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          clearLockdown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLockdown, clearLockdown, voiceEnabled]);

  if (!isLockdown) return null;

  return (
    <div
      className={`lockdown-overlay ${reducedMotion ? '' : 'glitch-burst'}`}
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-labelledby="lockdown-title"
    >
      <div className="lockdown-card">
        <p className="eyebrow alarm-text">CRITICAL BREACH // INTEGRITY DEPLETED</p>
        <h2 id="lockdown-title" className="glitch-title">SECURITY LOCKDOWN</h2>
        <p className="lockdown-recruiter">
          “Facility compromised. Diagnostic cycle initiated. Breathe, Candidate 404.”
        </p>
        {subtitles && (
          <p className="recruiter-subtitles" aria-live="polite">
            [Recruiter]: Facility compromised. Diagnostic cycle initiated. Breathe, Candidate 404.
          </p>
        )}
        <div className="lockdown-reboot">
          <p>Subsystem diagnostic restoring in {countdown}s...</p>
          <button
            type="button"
            className="reboot-btn"
            onClick={() => {
              audioManager.play('powerUp');
              clearLockdown();
            }}
            autoFocus
          >
            Breathe &amp; Restore (Instant Reboot)
          </button>
        </div>
      </div>
    </div>
  );
}
