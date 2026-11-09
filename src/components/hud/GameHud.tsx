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

export function GameHud(): React.ReactNode {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const screen = useGameStore((s) => s.screen);
  const integrity = useGameStore((s) => s.integrity);
  const fragments = useGameStore((s) => s.fragments);
  const startedAt = useGameStore((s) => s.startedAt);

  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const currentWing = wing[screen] ?? { label: 'NEXUS Facility', className: 'violet' };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="hud no-print" aria-label="Game status">
        <div className={`hud-wing ${currentWing.className}`}>
          <AudioLines aria-hidden="true" size={16} />
          <span>{currentWing.label}</span>
        </div>

        <div className="hud-timer">
          <Timer aria-hidden="true" size={16} />
          <span>{startedAt ? formatTimer(elapsedSec) : '--:--'}</span>
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
          <span>Wallet</span>
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
      </header>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
