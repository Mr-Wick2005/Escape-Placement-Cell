import { create } from 'zustand';
import { BALANCE } from '../config/balance';
import { calculateTotalScore } from '../engine/scoring';
import { loadGame, saveGame } from './persist';
import type { GameData, RoundName, Screen } from './gameTypes';

const blankRound = (status: GameData['rounds']['aptitude']['status'], maxScore: number) => ({
  status,
  score: 0,
  maxScore,
  timeUsed: 0,
  hintsUsed: 0,
  attempts: 0,
});

export const createNewGame = (): GameData => ({
  version: 1,
  screen: 'TITLE',
  playerAlias: 'Candidate 404',
  startedAt: null,
  fragments: { A: null, B: null, C: null },
  rounds: {
    aptitude: blankRound('AVAILABLE', BALANCE.scoring.aptitudeMax),
    coding: blankRound('LOCKED', BALANCE.scoring.codingMax),
    interview: blankRound('LOCKED', BALANCE.scoring.interviewMax),
  },
  integrity: BALANCE.integrity.initial,
  totalScore: 0,
  settings: {
    musicVolume: 0.65,
    sfxVolume: 0.7,
    muted: false,
    reducedMotion: false,
    voiceEnabled: false,
    subtitles: true,
  },
  riddleChoice: null,
  isLockdown: false,
  lockdowns: 0,
});

const transitions: Record<Screen, readonly Screen[]> = {
  TITLE: ['INTRO'],
  INTRO: ['HUB'],
  HUB: ['APTITUDE', 'CODING', 'INTERVIEW', 'FINAL'],
  APTITUDE: ['HUB'],
  CODING: ['HUB'],
  INTERVIEW: ['HUB'],
  FINAL: ['ENDING', 'HUB'],
  ENDING: ['REPORT'],
  REPORT: ['TITLE', 'HUB'],
};

const canTransition = (from: Screen, to: Screen): boolean => from === to || transitions[from].includes(to);

type Store = GameData & {
  beginGame: () => void;
  transition: (to: Screen) => void;
  updateSettings: (patch: Partial<GameData['settings']>) => void;
  startRound: (round: RoundName) => void;
  completeAptitude: (score: number, fragment: string | null) => void;
  completeCoding: (score: number, fragment: string) => void;
  completeInterview: (score: number, fragment: string) => void;
  completeFinalGate: (choice: string) => void;
  damageIntegrity: (amount: number) => void;
  clearLockdown: () => void;
  reset: () => void;
};

const initial = loadGame() ?? createNewGame();

export const useGameStore = create<Store>((set, get) => ({
  ...initial,
  beginGame: () => {
    set({ startedAt: get().startedAt ?? Date.now() });
    get().transition('INTRO');
  },
  transition: (screen) => {
    if (!canTransition(get().screen, screen)) return;
    set({ screen });
    saveGame(get());
  },
  updateSettings: (patch) => {
    set((state) => ({ settings: { ...state.settings, ...patch } }));
    saveGame(get());
  },
  startRound: (round) => {
    const screen = round === 'aptitude' ? 'APTITUDE' : round === 'coding' ? 'CODING' : 'INTERVIEW';
    if (get().rounds[round].status !== 'AVAILABLE') return;
    set((state) => ({
      screen,
      rounds: {
        ...state.rounds,
        [round]: {
          ...state.rounds[round],
          status: 'IN_PROGRESS',
          attempts: state.rounds[round].attempts + 1,
        },
      },
    }));
    saveGame(get());
  },
  completeAptitude: (score, fragment) => {
    const cleared = score >= BALANCE.scoring.aptitudeMax * BALANCE.scoring.clearPercent;
    set((state) => {
      const updatedRounds = {
        ...state.rounds,
        aptitude: { ...state.rounds.aptitude, score, status: cleared ? ('CLEARED' as const) : ('FAILED_RETRYABLE' as const) },
        coding: {
          ...state.rounds.coding,
          status: cleared ? ('AVAILABLE' as const) : state.rounds.coding.status,
        },
      };
      const { total } = calculateTotalScore(updatedRounds, state.integrity, state.lockdowns || 0);
      return {
        fragments: { ...state.fragments, A: cleared ? fragment : null },
        totalScore: total,
        rounds: updatedRounds,
      };
    });
    saveGame(get());
  },
  completeCoding: (score, fragment) => {
    set((state) => {
      const updatedRounds = {
        ...state.rounds,
        coding: { ...state.rounds.coding, score, status: 'CLEARED' as const },
        interview: { ...state.rounds.interview, status: 'AVAILABLE' as const },
      };
      const { total } = calculateTotalScore(updatedRounds, state.integrity, state.lockdowns || 0);
      return {
        fragments: { ...state.fragments, B: fragment },
        totalScore: total,
        rounds: updatedRounds,
      };
    });
    saveGame(get());
  },
  completeInterview: (score, fragment) => {
    const cleared = score >= BALANCE.scoring.interviewMax * BALANCE.scoring.clearPercent;
    set((state) => {
      const updatedRounds = {
        ...state.rounds,
        interview: {
          ...state.rounds.interview,
          score,
          status: cleared ? ('CLEARED' as const) : ('FAILED_RETRYABLE' as const),
        },
      };
      const { total } = calculateTotalScore(updatedRounds, state.integrity, state.lockdowns || 0);
      return {
        fragments: { ...state.fragments, C: cleared ? fragment : null },
        totalScore: total,
        rounds: updatedRounds,
      };
    });
    saveGame(get());
  },
  completeFinalGate: (choice: string) => {
    set((state) => {
      const { total } = calculateTotalScore(state.rounds, state.integrity, state.lockdowns || 0);
      return {
        riddleChoice: choice,
        totalScore: total,
        screen: 'ENDING',
      };
    });
    saveGame(get());
  },
  damageIntegrity: (amount: number) => {
    set((state) => {
      const nextIntegrity = Math.max(0, Math.min(100, state.integrity - amount));
      const isLockdown = nextIntegrity === 0;
      const lockdowns = isLockdown ? (state.lockdowns || 0) + 1 : (state.lockdowns || 0);
      return {
        integrity: nextIntegrity,
        isLockdown: isLockdown ? true : state.isLockdown,
        lockdowns,
      };
    });
    saveGame(get());
  },
  clearLockdown: () => {
    set(() => ({
      integrity: BALANCE.integrity.lockdownReset,
      isLockdown: false,
    }));
    saveGame(get());
  },
  reset: () => {
    const fresh = createNewGame();
    set(fresh);
    saveGame(fresh);
  },
}));
