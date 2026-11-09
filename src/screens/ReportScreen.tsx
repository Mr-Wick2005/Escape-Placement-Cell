import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Download,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import {
  calculateRadarSkills,
  calculateTotalScore,
  formatDuration,
  generateAnalysis,
  getRank,
  type RadarSkills,
} from '../engine/scoring';
import { audioManager } from '../audio/AudioManager';

export function ReportScreen(): React.ReactNode {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [completionTime] = useState(() => Date.now());

  const rounds = useGameStore((s) => s.rounds);
  const integrity = useGameStore((s) => s.integrity);
  const playerAlias = useGameStore((s) => s.playerAlias);
  const startedAt = useGameStore((s) => s.startedAt);
  const totalScore = useGameStore((s) => s.totalScore);
  const reset = useGameStore((s) => s.reset);
  const transition = useGameStore((s) => s.transition);

  const { styleBonus } = calculateTotalScore(rounds, integrity);
  const rank = getRank(totalScore);
  const skills = calculateRadarSkills(rounds, integrity);
  const analysis = generateAnalysis(rounds, skills);

  const durationMs = startedAt ? Math.max(1000, completionTime - startedAt) : 18 * 60 * 1000;
  const timeFormatted = formatDuration(durationMs);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    audioManager.play('uiClick');
    setDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#05060a',
        pixelRatio: 2,
      });
      const a = document.createElement('a');
      a.download = `Candidate-404-Placement-Report.png`;
      a.href = dataUrl;
      a.click();
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    audioManager.play('uiClick');
    const shareText = `Candidate 404 evaluation: Scored ${totalScore}/1000 (Rank ${rank.tier}: ${rank.title}) on Escape: Placement Cell campus drive simulation!`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Escape: Placement Cell Dossier',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setShareToast('Performance dossier copied to clipboard!');
      setTimeout(() => setShareToast(null), 3500);
    }
  };

  const handlePlayAgain = () => {
    audioManager.play('uiClick');
    if (window.confirm('Restart campus placement drive? Current report data will reset.')) {
      reset();
      transition('TITLE');
    }
  };

  return (
    <main className="report-screen">
      <div className="report-toolbar no-print">
        <button type="button" className="action-pill" onClick={handleDownload} disabled={downloading}>
          <Download size={16} /> {downloading ? 'Generating PNG…' : 'Download PNG'}
        </button>
        <button type="button" className="action-pill secondary" onClick={() => window.print()}>
          <Printer size={16} /> Print / Save PDF
        </button>
        <button type="button" className="action-pill secondary" onClick={handleShare}>
          <Share2 size={16} /> Share Result
        </button>
        <button type="button" className="action-pill secondary" onClick={handlePlayAgain}>
          <RotateCcw size={16} /> Play Again
        </button>
      </div>

      {shareToast && (
        <div className="share-toast" role="status">
          <CheckCircle size={16} className="green" /> {shareToast}
        </div>
      )}

      {/* The Printable / Capturable Report Card */}
      <div className="printable-report-card" ref={reportRef}>
        <header className="report-header">
          <div className="report-id-group">
            <span className="eyebrow">NEXUS CAMPUS DRIVE // ASSESSMENT DOSSIER</span>
            <h1>Performance Assessment Report</h1>
            <p className="candidate-meta">
              Subject: <strong>{playerAlias}</strong> · Clearance Date: <strong>{new Date(completionTime).toLocaleDateString()}</strong> · Duration: <strong>{timeFormatted}</strong>
            </p>
          </div>

          <div className={`report-rank-badge rank-tier-${rank.tier.toLowerCase()}`}>
            <span className="badge-letter">{rank.tier}</span>
            <div className="badge-meta">
              <strong>{rank.title}</strong>
              <small>{totalScore} / 1000 PTS</small>
            </div>
          </div>
        </header>

        {/* Score Breakdown Metrics */}
        <section className="report-section scores-grid">
          <div className="score-card">
            <div className="card-top">
              <span className="round-name cyan">Wing A // Aptitude Vault</span>
              <strong className="round-pts">{rounds.aptitude.score} <small>/ 300</small></strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill cyan-fill" style={{ width: `${(rounds.aptitude.score / 300) * 100}%` }} />
            </div>
            <p className="round-stat">Logic, Quant, Verbal &amp; Pattern Doors</p>
          </div>

          <div className="score-card">
            <div className="card-top">
              <span className="round-name green">Wing B // Code Core</span>
              <strong className="round-pts">{rounds.coding.score} <small>/ 350</small></strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green-fill" style={{ width: `${(rounds.coding.score / 350) * 100}%` }} />
            </div>
            <p className="round-stat">Debugging, Algorithmic Logic &amp; Scope Tracing</p>
          </div>

          <div className="score-card">
            <div className="card-top">
              <span className="round-name magenta">Wing C // Interview Chamber</span>
              <strong className="round-pts">{rounds.interview.score} <small>/ 300</small></strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill magenta-fill" style={{ width: `${(rounds.interview.score / 300) * 100}%` }} />
            </div>
            <p className="round-stat">STAR Formulation, Technical Depth &amp; Composure</p>
          </div>

          <div className="score-card">
            <div className="card-top">
              <span className="round-name gold">Bonus // Speed &amp; Integrity</span>
              <strong className="round-pts">+{styleBonus} <small>/ 50</small></strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill gold-fill" style={{ width: `${(styleBonus / 50) * 100}%` }} />
            </div>
            <p className="round-stat">{integrity}% Escape Energy Retained</p>
          </div>
        </section>

        {/* Skills Radar & Competency Matrix */}
        <section className="report-section radar-and-matrix">
          <div className="radar-col">
            <h3>Competency Radar Profile</h3>
            <RadarChart skills={skills} />
          </div>

          <div className="matrix-col">
            <h3>Core Metric Breakdown</h3>
            <div className="skills-bars-list">
              {([
                { key: 'quant', label: 'Quantitative Math', val: skills.quant, color: 'var(--cyan)' },
                { key: 'logic', label: 'Logical Deduction', val: skills.logic, color: 'var(--cyan)' },
                { key: 'debugging', label: 'Code Error Spotting', val: skills.debugging, color: 'var(--green)' },
                { key: 'coding', label: 'Algorithmic Synthesis', val: skills.coding, color: 'var(--green)' },
                { key: 'communication', label: 'STAR Articulation', val: skills.communication, color: 'var(--magenta)' },
                { key: 'verbal', label: 'Verbal Precision', val: skills.verbal, color: 'var(--violet)' },
                { key: 'confidence', label: 'Pressure Composure', val: skills.confidence, color: 'var(--gold)' },
              ] as const).map((item) => (
                <div key={item.key} className="skill-row">
                  <div className="skill-label-group">
                    <span>{item.label}</span>
                    <strong>{item.val}%</strong>
                  </div>
                  <div className="skill-track">
                    <div className="skill-fill" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strengths & Improvements */}
        <section className="report-section analysis-grid">
          <div className="analysis-card strengths-card">
            <div className="analysis-header green">
              <CheckCircle size={18} />
              <h3>Demonstrated Strengths</h3>
            </div>
            <ul>
              {analysis.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-card improvements-card">
            <div className="analysis-header cyan">
              <AlertTriangle size={18} />
              <h3>High-Priority Growth Areas</h3>
            </div>
            <ul>
              {analysis.improvements.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Curated Action Plan */}
        <section className="report-section action-plan-card">
          <div className="action-plan-header">
            <Lightbulb size={20} className="gold" />
            <div>
              <h3>Personalized Placement Action Plan</h3>
              <p className="muted">Actionable preparation roadmap prior to upcoming corporate campus drives.</p>
            </div>
          </div>
          <ol className="action-list">
            {analysis.actionPlan.map((action, idx) => (
              <li key={idx}>
                <span className="step-num">{idx + 1}</span>
                <p>{action}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Legal / Ethics Disclaimer Footer */}
        <footer className="report-footer">
          <ShieldCheck size={16} className="muted" />
          <p>
            Automated practice evaluation: This dossier reflects a deterministic simulation benchmark engineered for campus interview practice, not an official legal hiring decision or corporate contract.
          </p>
        </footer>
      </div>
    </main>
  );
}

// 7-axis dynamic SVG Radar Chart Component
function RadarChart({ skills }: { skills: RadarSkills }): React.ReactNode {
  const axes = [
    { key: 'quant', label: 'Quant', val: skills.quant },
    { key: 'logic', label: 'Logic', val: skills.logic },
    { key: 'coding', label: 'Coding', val: skills.coding },
    { key: 'debugging', label: 'Debug', val: skills.debugging },
    { key: 'communication', label: 'Comm', val: skills.communication },
    { key: 'verbal', label: 'Verbal', val: skills.verbal },
    { key: 'confidence', label: 'Composure', val: skills.confidence },
  ] as const;

  const total = axes.length;
  const cx = 150;
  const cy = 150;
  const radius = 95;

  // Calculate polygon points
  const points = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
    const r = radius * (Math.max(10, axis.val) / 100);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Concentric background grid webs (25%, 50%, 75%, 100%)
  const webs = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    return axes.map((_, i) => {
      const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
      const r = radius * scale;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <div className="radar-svg-container">
      <svg viewBox="0 0 300 300" className="radar-svg" aria-label="Radar chart of skills">
        {/* Background Web Polygons */}
        {webs.map((webPoints, idx) => (
          <polygon
            key={idx}
            points={webPoints}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray={idx < 3 ? '2 2' : 'none'}
          />
        ))}

        {/* Spoke Lines */}
        {axes.map((_, i) => {
          const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--line)"
              strokeWidth="1"
            />
          );
        })}

        {/* Player Data Polygon */}
        <polygon
          points={points}
          fill="rgba(34, 228, 255, 0.25)"
          stroke="var(--cyan)"
          strokeWidth="2.5"
        />

        {/* Data Vertices */}
        {axes.map((axis, i) => {
          const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
          const r = radius * (Math.max(10, axis.val) / 100);
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4.5"
              fill="var(--gold)"
              stroke="var(--bg-0)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
          const labelDist = radius + 22;
          const x = cx + labelDist * Math.cos(angle);
          const y = cy + labelDist * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y + 4}
              textAnchor="middle"
              fill="var(--text)"
              fontSize="10"
              fontFamily="Orbitron, sans-serif"
              fontWeight="600"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
