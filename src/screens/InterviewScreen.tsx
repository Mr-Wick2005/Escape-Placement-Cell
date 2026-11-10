import { Mic, Send } from 'lucide-react';
import { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../content/interview';
import { scoreInterviewAnswer } from '../engine/interviewScorer';
import { useSpeech } from '../hooks/useSpeech';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../audio/AudioManager';
import { RecruiterSubtitles } from '../components/effects/RecruiterSubtitles';
import { ScrambleText } from '../components/effects/ScrambleText';
import { FragmentFlyer } from '../components/effects/FragmentFlyer';

export function InterviewScreen(): React.ReactNode {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('The panel waits in silence.');
  const [points, setPoints] = useState(0);
  const [runes, setRunes] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [flyFragment, setFlyFragment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const complete = useGameStore((s) => s.completeInterview);
  const transition = useGameStore((s) => s.transition);
  const damageIntegrity = useGameStore((s) => s.damageIntegrity);

  const question = INTERVIEW_QUESTIONS[index];
  const speech = useSpeech((text) => {
    setAnswer((current) => `${current} ${text}`.trim().slice(0, 1200));
  });

  const submit = () => {
    if (isSubmitting || !answer.trim()) return;
    setIsSubmitting(true);

    audioManager.play('uiClick');
    const result = scoreInterviewAnswer(answer, question, answers);
    const total = points + result.score;

    if (result.score >= 35) {
      audioManager.play('answerCorrect');
    } else if (result.score < 20) {
      audioManager.play('answerWrong');
      damageIntegrity(5);
    }

    setFeedback(result.feedback);
    setAnswers((current) => [...current, answer]);
    setRunes((current) => [...current, result.rune]);
    setPoints(total);

    if (index === INTERVIEW_QUESTIONS.length - 1) {
      setFinished(true);
      const earnedFragment = [...runes, result.rune].slice(0, 3).join('');
      complete(Math.min(300, total), earnedFragment);
      audioManager.play('fragmentGain');
      setFlyFragment(true);
      setIsSubmitting(false);
    } else {
      setIndex((value) => value + 1);
      setAnswer('');
      setTimeout(() => setIsSubmitting(false), 200);
    }
  };

  const isQ7 = index === 6;
  const isAfterQ6 = index === 5;

  if (finished) {
    const fragmentCode = [...runes].slice(0, 3).join(' ');
    return (
      <main className="interview-result">
        {flyFragment && <FragmentFlyer letter="C" code={fragmentCode} />}
        <p className="eyebrow">PANEL DECISION</p>
        <h1>Interview Chamber cleared</h1>
        <p>Score: {Math.min(300, points)} / 300</p>
        <p className="runes">
          Fragment C: <ScrambleText text={fragmentCode} durationMs={700} />
        </p>
        <p className="recruiter-warm-line">
          The Recruiter’s voice softens: “I was built by a candidate who never got another chance.”
        </p>
        <RecruiterSubtitles
          speaker="Recruiter"
          text="I was built by a candidate who never got another chance. Take Fragment C and open the gate."
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

  return (
    <main className={`interview-screen panel-${question.panelist} ${isQ7 ? 'panel-solo-recruiter' : ''}`}>
      <section className="panel-stage" aria-label="Interview Panel">
        <div className={`silhouette recruiter ${isQ7 ? 'active-solo' : ''}`}>
          RECRUITER
        </div>
        <div className={`silhouette architect ${isQ7 ? 'dimmed-out' : ''}`}>
          ARCHITECT
        </div>
        <div className={`silhouette skeptic ${isQ7 ? 'dimmed-out' : ''}`}>
          SKEPTIC
        </div>
      </section>

      {/* Story Twist Reveal before Q7 */}
      {isQ7 && (
        <div className="interview-twist-banner" role="status">
          <p className="twist-whisper">
            [Skeptic’s channel cuts off with static]: “Wait... the Recruiter is not a person. It’s an autonomous construct.”
          </p>
          <p className="recruiter-intimate">
            The Recruiter’s tone shifts warmer: “They’re gone. Now it’s just you and me.”
          </p>
        </div>
      )}

      {isAfterQ6 && (
        <p className="skeptic-glitch-note" aria-live="polite">
          [Telemetry alert: Skeptic flagged an anomaly in Recruiter’s neural profile...]
        </p>
      )}

      <section className="interview-card">
        <p className="eyebrow">
          QUESTION {index + 1} / 7 · {isQ7 ? 'RECRUITER (ALONE)' : question.panelist.toUpperCase()}
        </p>
        <h1>{question.prompt}</h1>

        <RecruiterSubtitles
          speaker={question.panelist}
          text={question.prompt}
        />

        <div className="textarea-container">
          <textarea
            aria-label="Your interview answer"
            value={answer}
            maxLength={1200}
            onChange={(event) => setAnswer(event.target.value.slice(0, 1200))}
            placeholder={
              isQ7
                ? 'Speak or type from the heart. What makes you different?'
                : 'Type your answer. A structured, honest response (STAR framework) scores best.'
            }
            rows={7}
          />
          <span className="char-count" aria-live="polite">
            {answer.length} / 1200
          </span>
        </div>

        <div className="interview-actions">
          <button type="button" onClick={submit} disabled={isSubmitting || !answer.trim()}>
            <Send size={16} /> {isSubmitting ? 'Submitting…' : 'Submit answer'}
          </button>
          {speech.supported ? (
            <button
              type="button"
              className="secondary"
              onClick={speech.start}
              disabled={speech.listening}
            >
              <Mic size={16} /> {speech.listening ? 'Listening…' : 'Speak answer'}
            </button>
          ) : (
            <span className="speech-note">Voice input unavailable — typing works everywhere.</span>
          )}
        </div>

        {speech.error && (
          <p className="mic-error-fallback" role="alert">
            {speech.error}
          </p>
        )}

        <p className="interview-feedback" aria-live="polite">
          {feedback}
        </p>
        <p className="runes">Runes collected: {runes.join(' ') || '—'}</p>
      </section>
    </main>
  );
}
