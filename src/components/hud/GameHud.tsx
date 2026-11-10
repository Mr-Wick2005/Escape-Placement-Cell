import { AudioLines, BatteryCharging, HelpCircle, Settings, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SettingsPanel } from '../ui/SettingsPanel';
import { useGameStore } from '../../store/gameStore';
import type { Screen } from '../../store/gameTypes';
import { audioManager } from '../../audio/AudioManager';

const wing: Partial<Record<Screen, { label: string; className: string }>> = {
  APTITUDE: { label: 'Aptitude Vault', className: 'cyan' },
  CODING: { label: 'Code Core', className: 'green' },
  INTERVIEW: { label: 'Interview Chamber', className: 'magenta' },
  FINAL: { label: 'Final Gate', className: 'gold' },
  ENDING: { label: 'Egress Protocol', className: 'gold' },
  REPORT: { label: 'Assessment Dossier', className: 'violet' },
};

const ROUND_TIME_LIMIT = 600; // 10 minutes (600 seconds)

export function GameHud(): React.ReactNode {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [remainingSec, setRemainingSec] = useState(ROUND_TIME_LIMIT);

  const screen = useGameStore((s) => s.screen);
  const integrity = useGameStore((s) => s.integrity);
  const fragments = useGameStore((s) => s.fragments);
  const startedAt = useGameStore((s) => s.startedAt);

  const [prevScreen, setPrevScreen] = useState(screen);
  if (prevScreen !== screen) {
    setPrevScreen(screen);
    if (screen === 'APTITUDE' || screen === 'CODING' || screen === 'INTERVIEW') {
      setRemainingSec(ROUND_TIME_LIMIT);
    }
  }

  // Countdown timer: stops at 00:00, pauses when tab is hidden
  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        setRemainingSec((prev) => {
          if (prev <= 1) {
            return 0; // Stops at 00:00
          }
          if (prev <= 11 && prev > 1) {
            audioManager.play('timerTickLow');
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const currentWing = wing[screen] ?? { label: 'NEXUS Facility', className: 'violet' };

  // Never shows >99 minutes (clamped between 0 and 99:59)
  const formatTimer = (sec: number) => {
    const clamped = Math.max(0, Math.min(99 * 60 + 59, sec));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCritical = remainingSec <= 10 && remainingSec > 0;

  return (
    <>
      <header className="hud no-print" aria-label="Game status">
        <div className="hud-row">
          <div className={`hud-wing ${currentWing.className}`}>
            <AudioLines aria-hidden="true" size={16} />
            <span>{currentWing.label}</span>
          </div>

          <div className={`hud-timer ${isCritical ? 'timer-critical' : ''}`}>
            <Timer aria-hidden="true" size={16} />
            <span>{startedAt ? formatTimer(remainingSec) : '--:--'}</span>
          </div>

          <div className="hud-energy">
            <BatteryCharging aria-hidden="true" size={16} />
            <span className="sr-only">Escape Energy {integrity} out of 100</span>
            <div className="energy-track" aria-hidden="true">
              <i style={{ width: `${integrity}%` }} />
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                audioManager.play('uiClick');
                setSettingsOpen(true);
              }}
              aria-label="Open settings"
            >
              <Settings size={18} />
            </button>
          </div>

          <div className="wallet" aria-label="Code wallet">
            <span className="wallet-label">Wallet</span>
            {(['A', 'B', 'C'] as const).map((key) => (
              <b key={key} className={fragments[key] ? 'fragment earned' : 'fragment'}>
                {fragments[key] ?? key}
              </b>
            ))}
          </div>

          <button
            type="button"
            className="hint-control"
            aria-label="Hint status"
            disabled
          >
            <HelpCircle aria-hidden="true" size={16} />
            <span>Autonomous</span>
          </button>
        </div>
      </header>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
