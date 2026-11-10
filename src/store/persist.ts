import { z } from 'zod';
import { SAVE_BACKUP_KEY, SAVE_KEY } from '../config/constants';
import type { GameData } from './gameTypes';

const roundSchema = z.object({
  status: z.enum(['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'CLEARED', 'FAILED_RETRYABLE']),
  score: z.number().finite(),
  maxScore: z.number().positive(),
  timeUsed: z.number().nonnegative(),
  hintsUsed: z.number().int().nonnegative(),
  attempts: z.number().int().nonnegative(),
});

export const gameDataSchema = z.object({
  version: z.literal(1),
  screen: z.enum(['TITLE', 'INTRO', 'HUB', 'APTITUDE', 'CODING', 'INTERVIEW', 'FINAL', 'ENDING', 'REPORT']),
  playerAlias: z.string().max(40),
  startedAt: z.number().nullable(),
  fragments: z.object({
    A: z.string().nullable(),
    B: z.string().nullable(),
    C: z.string().nullable(),
  }),
  rounds: z.object({
    aptitude: roundSchema,
    coding: roundSchema,
    interview: roundSchema,
  }),
  integrity: z.number().min(0).max(100),
  totalScore: z.number().min(0).max(1000),
  settings: z.object({
    musicVolume: z.number().min(0).max(1),
    sfxVolume: z.number().min(0).max(1),
    muted: z.boolean(),
    reducedMotion: z.boolean(),
    voiceEnabled: z.boolean(),
    subtitles: z.boolean(),
  }),
  riddleChoice: z.string().nullable().default(null),
  isLockdown: z.boolean().default(false),
  lockdowns: z.number().int().nonnegative().default(0),
});

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const saveGame = (data: GameData): void => {
  try {
    storage()?.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    /* in-memory store remains active */
  }
};

export const loadGame = (): GameData | null => {
  try {
    const raw = storage()?.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      const parsed = gameDataSchema.safeParse(JSON.parse(raw));
      if (parsed.success) return parsed.data;
    } catch {
      /* invalid JSON is backed up below */
    }
    storage()?.setItem(SAVE_BACKUP_KEY, raw);
    storage()?.removeItem(SAVE_KEY);
  } catch {
    /* storage is optional */
  }
  return null;
};

export const clearSavedGame = (): void => {
  try {
    storage()?.removeItem(SAVE_KEY);
  } catch {
    /* storage is optional */
  }
};
