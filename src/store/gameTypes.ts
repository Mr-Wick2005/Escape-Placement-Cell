export type Screen = 'TITLE' | 'INTRO' | 'HUB' | 'APTITUDE' | 'CODING' | 'INTERVIEW' | 'FINAL' | 'ENDING' | 'REPORT';
export type RoundStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'CLEARED' | 'FAILED_RETRYABLE';
export type RoundName = 'aptitude' | 'coding' | 'interview';

export interface RoundProgress {
  status: RoundStatus;
  score: number;
  maxScore: number;
  timeUsed: number;
  hintsUsed: number;
  attempts: number;
}

export interface GameData {
  version: number;
  screen: Screen;
  playerAlias: string;
  startedAt: number | null;
  fragments: { A: string | null; B: string | null; C: string | null };
  rounds: Record<RoundName, RoundProgress>;
  integrity: number;
  totalScore: number;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    muted: boolean;
    reducedMotion: boolean;
    voiceEnabled: boolean;
    subtitles: boolean;
  };
  riddleChoice: string | null;
}
