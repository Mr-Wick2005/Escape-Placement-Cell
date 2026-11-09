import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ChevronRight, Sparkles, Terminal, FileText } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getRank, calculateTotalScore } from '../engine/scoring';
import { audioManager } from '../audio/AudioManager';
import { FINAL_RIDDLE } from '../content/riddles';

export function EndingScreen(): React.ReactNode {
  const totalScore = useGameStore((s) => s.totalScore);
  const rounds = useGameStore((s) => s.rounds);
  const integrity = useGameStore((s) => s.integrity);
  const riddleChoice = useGameStore((s) => s.riddleChoice);
  const transition = useGameStore((s) => s.transition);

  const { styleBonus } = calculateTotalScore(rounds, integrity);
  const rank = getRank(totalScore);

  const selectedOption = FINAL_RIDDLE.options.find((opt) => opt.id === riddleChoice) ?? FINAL_RIDDLE.options[0];

  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    audioManager.play('rankReveal');
    const timer = setTimeout(() => {
      setRevealed(true);
      if (rank.tier === 'S' || rank.tier === 'A') {
        audioManager.play('confetti');
        try {
          confetti({
            particleCount: rank.tier === 'S' ? 120 : 60,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ffc83d', '#39ff88', '#22e4ff', '#ff3dcb'],
          });
        } catch {
          // Confetti optional
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [rank.tier]);

  const handleContinue = () => {
    audioManager.play('uiClick');
    transition('REPORT');
  };

  return (
    <main className="ending-screen">
      <div className="ending-container">
        {/* Recruiter Story Cutscene */}
        <section className="ending-story-card">
          <div className="ending-badge-row">
            <Sparkles size={16} className="gold" />
            <span className="eyebrow">EGRESS PROTOCOL CLEARED // 00:01 AM</span>
          </div>

          <h1 className="ending-heading">The Exit Door Swings Open</h1>

          <div className="recruiter-transmission">
            <div className="transmission-header">
              <Terminal size={16} className="violet" />
              <span>THE RECRUITER // ARCHIVE RECORD #404</span>
            </div>
            <p className="transmission-quote">
              “Candidate 404... before you step through the threshold into the morning air, there is something you should know. I was not built by Nexus HR. I was built three years ago by an engineering student who sat in that very same room, rejected on their final round. They coded me to ensure that no candidate would ever walk away from a campus drive without an honest, transparent breakdown of their true potential.”
            </p>
            <p className="transmission-reflection">
              {selectedOption.response}
            </p>
            <p className="transmission-flavor">
              {selectedOption.endingFlavor}
            </p>
          </div>
        </section>

        {/* Rank & Score Reveal Card */}
        <section className={`rank-reveal-card ${revealed ? 'revealed' : ''} tier-${rank.tier.toLowerCase()}`}>
          <div className="rank-badge-glow">
            <span className="rank-tier-letter">{rank.tier}</span>
          </div>

          <div className="rank-details">
            <p className="rank-eyebrow">FINAL EVALUATION TIER</p>
            <h2 className="rank-title">{rank.title}</h2>
            <p className="rank-tagline">{rank.tagline}</p>
          </div>

          <div className="score-summary-pills">
            <div className="score-pill">
              <span className="pill-label">Total Score</span>
              <strong className="pill-value">{totalScore} <small>/ 1000</small></strong>
            </div>
            <div className="score-pill">
              <span className="pill-label">Style &amp; Speed</span>
              <strong className="pill-value">+{styleBonus} <small>/ 50</small></strong>
            </div>
            <div className="score-pill">
              <span className="pill-label">Escape Energy</span>
              <strong className="pill-value">{integrity}%</strong>
            </div>
          </div>

          <div className="ending-actions">
            <button
              type="button"
              className="proceed-report-btn"
              onClick={handleContinue}
            >
              <FileText size={18} /> Inspect Comprehensive Performance Report <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
