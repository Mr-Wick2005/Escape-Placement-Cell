import { Lightbulb, NotebookPen, SkipForward, Timer as TimerIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { APTITUDE_QUESTIONS } from '../content/aptitude';
import { deriveVaultFragment } from '../engine/derivations';
import { generateMaze } from '../engine/maze';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../audio/AudioManager';
import { ScrambleText } from '../components/effects/ScrambleText';
import { FragmentFlyer } from '../components/effects/FragmentFlyer';

const questions = APTITUDE_QUESTIONS.slice(0, 8);

export function AptitudeScreen(): React.ReactNode {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(0);
  const [hints, setHints] = useState(0);
  const [digits, setDigits] = useState<number[]>([]);
  const [note, setNote] = useState(false);
  const [message, setMessage] = useState('A logic door blocks the path.');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [flyFragment, setFlyFragment] = useState(false);
  const [doorSeconds, setDoorSeconds] = useState(45);

  const complete = useGameStore((s) => s.completeAptitude);
  const transition = useGameStore((s) => s.transition);
  const damageIntegrity = useGameStore((s) => s.damageIntegrity);

  const maze = useMemo(() => generateMaze(404), []);
  const question = questions[index];

  // Soft door timer (45 seconds)
  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        setDoorSeconds((prev) => {
          if (prev <= 1) {
            audioManager.play('alarmLockdown');
            damageIntegrity(5);
            return 45; // Resets soft-timer cycle
          }
          if (prev <= 10) {
            audioManager.play('timerTickLow');
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [finished, damageIntegrity]);

  const next = (earned: number, digit?: number) => {
    setDoorSeconds(45);
    const updated = score + earned;
    setScore(updated);
    if (digit !== undefined) setDigits((current) => [...current, digit]);

    if (index === questions.length - 1) {
      setFinished(true);
      const allDigits = [...digits, ...(digit === undefined ? [] : [digit])];
      const fragment = deriveVaultFragment(allDigits);
      complete(updated, fragment);
      audioManager.play('fragmentGain');
      setFlyFragment(true);
    } else {
      audioManager.play('wallShift');
      setIndex((value) => value + 1);
      setAnswer('');
      setWrong(0);
      setHints(0);
      setMessage('Door shifted. Another lock is waiting.');
    }
  };

  const submit = () => {
    if (!answer.trim()) {
      setMessage('Enter an answer before opening the lock.');
      return;
    }

    if (answer.trim().toLowerCase() === question.answer.toLowerCase()) {
      audioManager.play('answerCorrect');
      next(wrong ? 15 : 30, question.digit);
    } else {
      audioManager.play('answerWrong');
      damageIntegrity(8);
      setWrong((value) => value + 1);
      setMessage('Incorrect. The Vault reroutes your path. Integrity -8. Try again.');
    }
  };

  const handleUseHint = () => {
    if (hints >= 2) return;
    audioManager.play('hintUse');
    damageIntegrity(5);
    setMessage(question.hints[hints]);
    setHints((value) => value + 1);
  };

  if (finished) {
    const fragmentA = deriveVaultFragment(digits) ?? 'NOTEBOOK INCOMPLETE';
    return (
      <main className="vault-result">
        {flyFragment && <FragmentFlyer letter="A" code={fragmentA} />}
        <p className="eyebrow">VAULT RESOLVED</p>
        <h1>Combination secured</h1>
        <p>Score: {score} / 300</p>
        <p className="fragment-display">
          Fragment A: <ScrambleText text={fragmentA} durationMs={650} />
        </p>
        <button
          type="button"
          onClick={() => {
            audioManager.play('uiClick');
            transition('HUB');
          }}
        >
          Return to lobby
        </button>
      </main>
    );
  }

  const isLowTime = doorSeconds <= 10;

  return (
    <main className="vault-screen">
      <section className="vault-top">
        <div>
          <p className="eyebrow">WING A // APTITUDE VAULT</p>
          <h1>Logic Door {index + 1} / 8</h1>
        </div>
        <div className="vault-status-bar">
          <div className={`door-timer-badge ${isLowTime ? 'timer-critical' : ''}`}>
            <TimerIcon size={14} />
            <span>00:{doorSeconds.toString().padStart(2, '0')}</span>
          </div>
          <button type="button" className="notebook" onClick={() => setNote(!note)}>
            <NotebookPen size={14} /> Notebook {digits.length ? digits.join(' · ') : '—'}
          </button>
        </div>
      </section>

      <div className="vault-layout">
        <section className="maze-board" aria-label="Vault maze">
          {maze.walls.flatMap((row, rowIndex) =>
            row.map((wall, colIndex) => (
              <i
                key={`${rowIndex}-${colIndex}`}
                className={`maze-cell ${wall ? 'wall' : ''} ${
                  rowIndex === maze.start.row && colIndex === maze.start.col ? 'start' : ''
                } ${rowIndex === maze.goal.row && colIndex === maze.goal.col ? 'goal' : ''}`}
              />
            ))
          )}
        </section>

        <section className="logic-door">
          <p className="door-category">{question.category.toUpperCase()}</p>
          <h2>{question.prompt}</h2>
          {question.options ? (
            <div className="answer-grid">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={answer === option ? 'answer selected-answer' : 'answer'}
                  onClick={() => {
                    audioManager.play('uiHover');
                    setAnswer(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              aria-label="Your answer"
              value={answer}
              className="themed-input uppercase-mono"
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit();
              }}
              placeholder="Enter combination"
            />
          )}

          <p className="vault-message" aria-live="polite">
            {message}
          </p>

          <div className="vault-actions">
            <button type="button" onClick={submit}>
              Unlock door
            </button>
            <button
              type="button"
              className="secondary"
              disabled={hints >= 2}
              onClick={handleUseHint}
            >
              <Lightbulb size={16} /> Hint {2 - hints}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={index !== 0}
              onClick={() => next(0)}
            >
              <SkipForward size={16} /> Skip lock
            </button>
          </div>

          {note && (
            <aside className="vault-notebook">
              <strong>Vault notebook</strong>
              <p>Glyphs found: {digits.length ? digits.join(' · ') : 'None yet'}</p>
            </aside>
          )}
        </section>
      </div>
    </main>
  );
}
