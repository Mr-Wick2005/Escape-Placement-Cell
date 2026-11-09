import { LockKeyhole, Radio, UnlockKeyhole, Terminal } from 'lucide-react';
import { useState } from 'react';
import { STORY } from '../content/story';
import { useGameStore } from '../store/gameStore';
import type { RoundName } from '../store/gameTypes';
import { audioManager } from '../audio/AudioManager';

type WingKey = RoundName | 'final';

const layout: { key: WingKey; cell: string; glyph: string }[] = [
  { key: 'aptitude', cell: 'a', glyph: 'WING A' },
  { key: 'coding', cell: 'b', glyph: 'WING B' },
  { key: 'interview', cell: 'c', glyph: 'WING C' },
  { key: 'final', cell: 'final', glyph: 'GATE' },
];

export function HubScreen(): React.ReactNode {
  const [selected, setSelected] = useState<WingKey>('aptitude');
  const [terminalMessage, setTerminalMessage] = useState<string | null>(null);

  const rounds = useGameStore((s) => s.rounds);
  const startRound = useGameStore((s) => s.startRound);
  const transition = useGameStore((s) => s.transition);
  const fragments = useGameStore((s) => s.fragments);

  const allFragments = Boolean(fragments.A && fragments.B && fragments.C);
  const item = STORY.wings[selected];

  const available = selected === 'final' ? allFragments : rounds[selected].status === 'AVAILABLE';
  const status = selected === 'final'
    ? (allFragments ? 'AVAILABLE' : 'LOCKED')
    : rounds[selected].status;

  const selectWing = (key: WingKey) => {
    audioManager.play('uiClick');
    setSelected(key);
  };

  const enter = () => {
    if (selected === 'final') {
      if (allFragments) {
        audioManager.play('doorOpen');
        transition('FINAL');
      } else {
        audioManager.play('doorLocked');
      }
    } else if (available) {
      audioManager.play('doorOpen');
      startRound(selected);
    } else {
      audioManager.play('doorLocked');
    }
  };

  const triggerTerminal = () => {
    audioManager.play('terminalRun');
    let message: string = STORY.latestRecruiterLine;
    if (allFragments) {
      message = '“The three fragments resonate. The Final Gate locks are active. Step forward, Candidate 404.”';
    } else if (rounds.interview.status === 'AVAILABLE') {
      message = '“Candidate 403 did not make it past Wing C. The panel has been anticipating your arrival.”';
    } else if (rounds.coding.status === 'AVAILABLE') {
      message = '“The Code Core is trembling with memory leaks. Let’s see if your algorithmic foundation holds up.”';
    }
    setTerminalMessage(message);
  };

  return (
    <main className="hub-screen">
      <section className="hub-heading">
        <p className="eyebrow">NEXUS CAMPUS FACILITY // LEVEL 0 BLUEPRINT</p>
        <h1>Select a Sealed Wing</h1>
        <p>Three trials stand between Candidate 404 and the exit. Collect all three code fragments to breach the Final Gate.</p>
      </section>

      <section className="blueprint" aria-label="Nexus building map">
        <div className="map-grid">
          {Array.from({ length: 9 }, (_, index) => (
            <span className="map-block" key={index} />
          ))}

          {layout.map(({ key, cell, glyph }) => {
            const isFinal = key === 'final';
            const wingStatus = isFinal
              ? (allFragments ? 'AVAILABLE' : 'LOCKED')
              : rounds[key].status;
            const isSelected = selected === key;

            return (
              <button
                key={key}
                type="button"
                className={`map-wing ${cell} ${wingStatus.toLowerCase()} ${isSelected ? 'selected' : ''}`}
                onClick={() => selectWing(key)}
                aria-pressed={isSelected}
                aria-label={`${glyph}: ${STORY.wings[key].title} (${wingStatus})`}
              >
                <span>{wingStatus === 'LOCKED' ? <LockKeyhole size={18} /> : <UnlockKeyhole size={18} />}</span>
                <strong>{key === 'aptitude' ? 'A' : key === 'coding' ? 'B' : key === 'interview' ? 'C' : 'GATE'}</strong>
                <small className="wing-tag">{glyph}</small>
              </button>
            );
          })}
        </div>

        <aside className="wing-card" aria-live="polite">
          <p className="eyebrow">{status === 'CLEARED' ? 'TRIAL COMPLETED' : status}</p>
          <h2>{item.title}</h2>
          <p>{item.detail}</p>
          <small>{item.difficulty}</small>

          <button
            type="button"
            className={available ? 'open-wing-btn' : 'secondary'}
            disabled={!available && status !== 'CLEARED'}
            onClick={enter}
          >
            {selected === 'final'
              ? (allFragments ? 'Breach Final Gate' : 'Locked (Requires 3 Fragments)')
              : status === 'CLEARED'
              ? 'Review Wing Trial'
              : available
              ? 'Enter Wing'
              : 'Wing Locked'}
          </button>
        </aside>
      </section>

      <div className="hub-footer-actions">
        <button type="button" className="recruiter-terminal" onClick={triggerTerminal}>
          <Radio size={16} /> Intercept Recruiter Terminal
        </button>

        {terminalMessage && (
          <div className="terminal-transmission-bubble" role="status">
            <Terminal size={14} className="terminal-icon" />
            <p>{terminalMessage}</p>
            <button
              type="button"
              className="icon-button close-transmission"
              onClick={() => setTerminalMessage(null)}
              aria-label="Dismiss terminal transmission"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
