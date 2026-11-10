import { lazy, Suspense, useState } from 'react';
import { Play, Lightbulb, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { CODING_PUZZLES, OVERLOAD_WORD } from '../content/coding';
import { runJavaScript, type RunResult } from '../engine/codeRunner';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../audio/AudioManager';
import { ScrambleText } from '../components/effects/ScrambleText';
import { FragmentFlyer } from '../components/effects/FragmentFlyer';
import { RecruiterSubtitles } from '../components/effects/RecruiterSubtitles';

const Editor = lazy(() => import('@monaco-editor/react'));

export function CodingScreen(): React.ReactNode {
  const [terminal, setTerminal] = useState(0);
  const [code, setCode] = useState(CODING_PUZZLES[0].starterCode);
  const [output, setOutput] = useState<RunResult | null>(null);
  const [hint, setHint] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [word, setWord] = useState('');
  const [overloadError, setOverloadError] = useState<string | null>(null);
  const [flyFragment, setFlyFragment] = useState(false);
  const [completedCore, setCompletedCore] = useState(false);
  const [viewingOverload, setViewingOverload] = useState(false);

  const complete = useGameStore((s) => s.completeCoding);
  const transition = useGameStore((s) => s.transition);
  const damageIntegrity = useGameStore((s) => s.damageIntegrity);

  const puzzle = CODING_PUZZLES[terminal];

  const execute = async () => {
    if (!code.trim()) {
      setOutput({ error: 'No code detected.' });
      return;
    }

    audioManager.play('terminalRun');
    setRunning(true);
    const result = await runJavaScript(code, puzzle);
    setRunning(false);
    setOutput(result);

    const allPassed = Boolean(result.results && result.results.length > 0 && result.results.every((test) => test.pass));

    if (allPassed) {
      audioManager.play('testPass');
      if (!solved.includes(terminal)) {
        const nextSolved = [...solved, terminal];
        setSolved(nextSolved);
        if (nextSolved.length === 3) {
          setViewingOverload(true);
        }
      }
    } else {
      audioManager.play('testFail');
      damageIntegrity(10);
    }
  };

  const changeTerminal = (index: number) => {
    audioManager.play('uiClick');
    setViewingOverload(false);
    setTerminal(index);
    setCode(CODING_PUZZLES[index].starterCode);
    setOutput(null);
    setHint(0);
  };

  const handleUseHint = () => {
    if (hint >= 2) return;
    audioManager.play('hintUse');
    damageIntegrity(5);
    setOutput({ error: puzzle.hints[hint] });
    setHint((value) => value + 1);
  };

  const handleRestorePower = () => {
    if (word.trim().toUpperCase() === OVERLOAD_WORD) {
      audioManager.play('powerUp');
      audioManager.play('fragmentGain');
      setOverloadError(null);
      complete(300, OVERLOAD_WORD);
      setFlyFragment(true);
      setCompletedCore(true);
    } else {
      audioManager.play('answerWrong');
      damageIntegrity(10);
      setOverloadError('Master keyword invalid. Racks spell: C · O · D · E.');
    }
  };

  if (completedCore) {
    return (
      <main className="coding-screen core-cleared">
        {flyFragment && <FragmentFlyer letter="B" code={OVERLOAD_WORD} />}
        <p className="eyebrow">WING B // CLEARED</p>
        <h1>Code Core Synchronized</h1>
        <p>Score: 300 / 350</p>
        <p className="fragment-display">
          Fragment B: <ScrambleText text={OVERLOAD_WORD} durationMs={650} />
        </p>
        <RecruiterSubtitles
          speaker="Recruiter"
          text="Clean execution, Candidate 404. The Core is back online. Fragment B is yours."
        />
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

  if (viewingOverload && solved.length === 3) {
    return (
      <main className="coding-screen overload-terminal-screen">
        <div className="coding-head">
          <div>
            <p className="eyebrow">WING B // MASTER OVERLOAD</p>
            <h1>Overload Terminal Unlocked</h1>
          </div>
          <div className="rack-status">
            {CODING_PUZZLES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="rack online"
                onClick={() => changeTerminal(index)}
              >
                RACK {index + 1}: {item.letter}
              </button>
            ))}
            <button
              type="button"
              className="rack active"
              onClick={() => setViewingOverload(true)}
            >
              <Cpu size={14} /> OVERLOAD
            </button>
          </div>
        </div>

        <section className="overload-card">
          <p className="overload-instructions">
            All three terminal racks are synchronized. Unscramble the letters collected from Racks 1-3
            (<strong>C · O · D</strong>) plus the system root glyph (<strong>E</strong>) to form the 4-letter master keyword.
          </p>

          <div className="overload-input-group">
            <input
              aria-label="Master code word"
              value={word}
              maxLength={4}
              autoFocus
              className="themed-input uppercase-mono"
              onChange={(event) => {
                setWord(event.target.value.toUpperCase());
                setOverloadError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && word.trim().length === 4) {
                  handleRestorePower();
                }
              }}
              placeholder="CODE"
            />
            <button
              type="button"
              className="restore-btn"
              onClick={handleRestorePower}
              disabled={word.trim().length !== 4}
            >
              Restore power
            </button>
          </div>

          {overloadError && (
            <p className="overload-error-banner" role="alert">
              <AlertTriangle size={16} /> {overloadError}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="coding-screen">
      <div className="coding-head">
        <div>
          <p className="eyebrow">WING B // CODE CORE</p>
          <h1>{puzzle.title}</h1>
          <p className="puzzle-brief">{puzzle.brief}</p>
        </div>
        <div className="rack-status">
          {CODING_PUZZLES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={
                solved.includes(index)
                  ? 'rack online'
                  : index === terminal
                  ? 'rack active'
                  : 'rack'
              }
              onClick={() => changeTerminal(index)}
            >
              RACK {index + 1}
            </button>
          ))}
          {solved.length === 3 && (
            <button
              type="button"
              className="rack active"
              onClick={() => setViewingOverload(true)}
            >
              <Cpu size={14} /> OVERLOAD
            </button>
          )}
        </div>
      </div>

      <section className="terminal">
        <div className="terminal-editor-container">
          <Suspense fallback={<p className="editor-loading">Booting terminal editor…</p>}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value ?? '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                folding: false,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
              }}
            />
          </Suspense>
        </div>

        <div className="terminal-toolbar">
          <button type="button" disabled={running} onClick={execute}>
            <Play size={16} /> {running ? 'Executing…' : 'Execute'}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={hint >= 2}
            onClick={handleUseHint}
          >
            <Lightbulb size={16} /> Hint {2 - hint}
          </button>
        </div>

        <div className="terminal-output" aria-live="polite">
          {output?.timedOut && (
            <p className="fail" role="alert">
              <AlertTriangle size={14} /> TIMEOUT: Process terminated after 2 seconds.
            </p>
          )}
          {output?.error && (
            <p className="fail" role="alert">
              <AlertTriangle size={14} /> {output.error}
            </p>
          )}
          {output?.results?.map((test, index) => (
            <p key={index} className={test.pass ? 'pass' : 'fail'}>
              {test.pass ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {test.hidden ? 'HIDDEN TEST' : `TEST ${index + 1}`}:{' '}
              {test.pass ? 'PASS' : test.error ?? 'FAIL'}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
