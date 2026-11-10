import { useState } from 'react';
import { Lock, Unlock, ShieldAlert, BookOpen, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../audio/AudioManager';
import { FINAL_RIDDLE, type FinalRiddleOption } from '../content/riddles';
import { DoorSplitEffect } from '../components/effects/DoorSplitEffect';
import { RecruiterSubtitles } from '../components/effects/RecruiterSubtitles';

const AVAILABLE_RUNES = ['△', '○', '◇', '✦', '□', '✧', '⬡'];

export function FinalGateScreen(): React.ReactNode {
  const fragments = useGameStore((s) => s.fragments);
  const damageIntegrity = useGameStore((s) => s.damageIntegrity);
  const completeFinalGate = useGameStore((s) => s.completeFinalGate);
  const transition = useGameStore((s) => s.transition);

  // Expected fragments (with safe fallback)
  const expectedA = (fragments.A ?? '7319').trim();
  const expectedB = (fragments.B ?? 'CODE').trim().toUpperCase();
  const expectedC = (fragments.C ?? '△○◇').replace(/\s+/g, '');

  // Lock inputs
  const [lock1, setLock1] = useState(['', '', '', '']);
  const [lock2, setLock2] = useState(['', '', '', '']);
  const [lock3, setLock3] = useState<string[]>([]);

  // State
  const [shaking, setShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [locksUnlocked, setLocksUnlocked] = useState(false);
  const [selectedRiddle, setSelectedRiddle] = useState<FinalRiddleOption | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);

  // Handle lock 1 digit change
  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1).replace(/[^0-9]/g, '');
    const next = [...lock1];
    next[index] = char;
    setLock1(next);
    audioManager.play('keyType');
    if (char && index < 3) {
      const nextInput = document.getElementById(`lock1-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle lock 2 letter change
  const handleLetterChange = (index: number, val: string) => {
    const char = val.slice(-1).toUpperCase().replace(/[^A-Z]/g, '');
    const next = [...lock2];
    next[index] = char;
    setLock2(next);
    audioManager.play('keyType');
    if (char && index < 3) {
      const nextInput = document.getElementById(`lock2-char-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle rune slot selection
  const handleRuneClick = (rune: string) => {
    audioManager.play('keyType');
    if (lock3.length < 3) {
      setLock3([...lock3, rune]);
    }
  };

  const removeRune = (index: number) => {
    audioManager.play('uiBack');
    const next = lock3.filter((_, idx) => idx !== index);
    setLock3(next);
  };

  // Disengage locks validation
  const handleDisengage = () => {
    if (shaking) return;
    const inputA = lock1.join('');
    const inputB = lock2.join('').toUpperCase();
    const inputC = lock3.join('');

    const matchA = inputA === expectedA;
    const matchB = inputB === expectedB;
    const matchC = inputC === expectedC;

    if (matchA && matchB && matchC) {
      audioManager.play('fragmentGain');
      audioManager.play('doorOpen');
      setErrorMessage(null);
      setLocksUnlocked(true);
    } else {
      audioManager.play('doorLocked');
      setShaking(true);
      damageIntegrity(10);
      setWrongAttempts((prev) => prev + 1);

      const failed: string[] = [];
      if (!matchA) failed.push('Lock 1 (Numeric Vault)');
      if (!matchB) failed.push('Lock 2 (Core Word)');
      if (!matchC) failed.push('Lock 3 (Panel Runes)');

      setErrorMessage(`Disengage failed on: ${failed.join(', ')}. Integrity penalized -10.`);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const handleFinishRiddle = () => {
    if (!selectedRiddle) return;
    audioManager.play('doorOpen');
    completeFinalGate(selectedRiddle.id);
  };

  return (
    <main className="final-gate-screen">
      <div className="gate-header">
        <p className="eyebrow">FINAL PROTOCOL // 11:59 PM</p>
        <h1>The Final Gate</h1>
        <p className="subtitle">
          Three lock mechanisms seal the facility egress. Align the gathered fragments to unlock the door.
        </p>
        <button
          type="button"
          className="notebook-toggle-btn"
          onClick={() => {
            audioManager.play('uiClick');
            setShowNotebook(!showNotebook);
          }}
          aria-expanded={showNotebook}
        >
          <BookOpen size={16} /> {showNotebook ? 'Close Code Wallet' : 'Inspect Code Wallet'}
        </button>
      </div>

      {showNotebook && (
        <aside className="gate-notebook-drawer" aria-label="Code Wallet Notebook">
          <h3>Candidate 404 // Code Wallet</h3>
          <div className="notebook-fragments-grid">
            <div className="nb-card">
              <span className="nb-label">Fragment A (Aptitude)</span>
              <strong>{fragments.A ?? '— (Not Found)'}</strong>
            </div>
            <div className="nb-card">
              <span className="nb-label">Fragment B (Coding)</span>
              <strong>{fragments.B ?? '— (Not Found)'}</strong>
            </div>
            <div className="nb-card">
              <span className="nb-label">Fragment C (Interview)</span>
              <strong>{fragments.C ? fragments.C.split('').join(' ') : '— (Not Found)'}</strong>
            </div>
          </div>
          <small className="muted">Enter each fragment exactly as verified across the wings.</small>
        </aside>
      )}

      {/* The Vault Gate Visual */}
      <section className={`vault-gate-assembly ${shaking ? 'shake-animation' : ''} ${locksUnlocked ? 'gate-unlocked' : ''}`}>
        <div className="gate-arch">
          <div className="gate-core-light" />

          {!locksUnlocked ? (
            <div className="locks-panel">
              {/* LOCK 1: 4-digit code */}
              <div className="lock-card lock-1">
                <div className="lock-label">
                  <Lock size={16} className="cyan" />
                  <span>Lock 1 // 4-Digit Combination</span>
                </div>
                <div className="digits-input-group">
                  {lock1.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`lock1-digit-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleDisengage();
                      }}
                      className="digit-box themed-digit"
                      aria-label={`Lock 1 Digit ${idx + 1}`}
                    />
                  ))}
                </div>
                <small className="lock-hint">Fragment A from Wing A</small>
              </div>

              {/* LOCK 2: 4-letter word */}
              <div className="lock-card lock-2">
                <div className="lock-label">
                  <Lock size={16} className="green" />
                  <span>Lock 2 // 4-Letter Keyword</span>
                </div>
                <div className="digits-input-group">
                  {lock2.map((letter, idx) => (
                    <input
                      key={idx}
                      id={`lock2-char-${idx}`}
                      type="text"
                      maxLength={1}
                      value={letter}
                      onChange={(e) => handleLetterChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleDisengage();
                      }}
                      className="char-box themed-digit uppercase-mono"
                      aria-label={`Lock 2 Letter ${idx + 1}`}
                    />
                  ))}
                </div>
                <small className="lock-hint">Fragment B from Wing B</small>
              </div>

              {/* LOCK 3: 3-rune symbol dial */}
              <div className="lock-card lock-3">
                <div className="lock-label">
                  <Lock size={16} className="magenta" />
                  <span>Lock 3 // 3-Rune Triad</span>
                </div>
                <div className="rune-slots-row">
                  {[0, 1, 2].map((slotIdx) => (
                    <button
                      key={slotIdx}
                      type="button"
                      className="rune-slot-btn"
                      onClick={() => removeRune(slotIdx)}
                      aria-label={lock3[slotIdx] ? `Remove Rune ${lock3[slotIdx]}` : `Empty Rune Slot ${slotIdx + 1}`}
                    >
                      {lock3[slotIdx] || '·'}
                    </button>
                  ))}
                </div>
                <div className="available-runes-palette" aria-label="Available Runes">
                  {AVAILABLE_RUNES.map((rune) => (
                    <button
                      key={rune}
                      type="button"
                      className="rune-chip"
                      onClick={() => handleRuneClick(rune)}
                      disabled={lock3.length >= 3}
                    >
                      {rune}
                    </button>
                  ))}
                </div>
                <small className="lock-hint">Fragment C from Wing C</small>
              </div>

              {errorMessage && (
                <div className="gate-error-banner" role="alert">
                  <ShieldAlert size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {wrongAttempts >= 3 && (
                <div className="recruiter-hint-callout">
                  <HelpCircle size={18} className="gold" />
                  <p>
                    <strong>Recruiter Audio Override:</strong> “Inspect your Code Wallet above. The answers are the exact fragments unlocked in the three wings: {expectedA}, {expectedB}, and {expectedC}.”
                  </p>
                </div>
              )}

              <div className="gate-actions-row">
                <button
                  type="button"
                  className="disengage-locks-btn"
                  onClick={handleDisengage}
                  disabled={shaking || lock1.some((d) => !d) || lock2.some((c) => !c) || lock3.length < 3}
                >
                  <Unlock size={18} /> Disengage Gate Mechanisms
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    audioManager.play('uiBack');
                    transition('HUB');
                  }}
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          ) : (
            /* FINAL BOSS MOMENT: Recruiter Final Riddle */
            <DoorSplitEffect isOpen={locksUnlocked}>
              <div className="final-riddle-modal">
                <div className="riddle-badge">
                  <Sparkles size={16} className="gold" />
                  <span>FINAL CONVERGENCE PROTOCOL</span>
                </div>
                <h2>{FINAL_RIDDLE.prompt}</h2>
                <p className="riddle-context">{FINAL_RIDDLE.context}</p>

                <RecruiterSubtitles
                  speaker="Recruiter"
                  text="The gate is unsealed. Before you step out into the daylight, answer one question: what kept you going?"
                />

                <div className="riddle-options-list">
                  {FINAL_RIDDLE.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`riddle-option-card ${selectedRiddle?.id === opt.id ? 'selected' : ''}`}
                      onClick={() => {
                        audioManager.play('uiClick');
                        setSelectedRiddle(opt);
                      }}
                    >
                      <div className="opt-title">
                        <span className="opt-philosophy">{opt.philosophy}</span>
                        <ChevronRight size={18} />
                      </div>
                      <p className="opt-label">{opt.label}</p>
                    </button>
                  ))}
                </div>

                {selectedRiddle && (
                  <div className="recruiter-riddle-reply">
                    <p className="reply-quote">{selectedRiddle.response}</p>
                    <p className="reply-flavor">{selectedRiddle.endingFlavor}</p>
                    <RecruiterSubtitles speaker="Recruiter" text={selectedRiddle.response} />
                  </div>
                )}

                <button
                  type="button"
                  className="breach-exit-btn"
                  disabled={!selectedRiddle}
                  onClick={handleFinishRiddle}
                >
                  Breach the Facility Threshold &amp; Complete Drive
                </button>
              </div>
            </DoorSplitEffect>
          )}
        </div>
      </section>
    </main>
  );
}
