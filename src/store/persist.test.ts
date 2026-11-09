import { beforeEach, describe, expect, it } from 'vitest';
import { SAVE_BACKUP_KEY, SAVE_KEY } from '../config/constants';
import { createNewGame } from './gameStore';
import { loadGame, saveGame } from './persist';
describe('save persistence', () => { beforeEach(() => localStorage.clear()); it('round-trips a valid game', () => { const game = createNewGame(); saveGame(game); expect(loadGame()).toEqual(game); }); it('backs up corrupt data and starts cleanly', () => { localStorage.setItem(SAVE_KEY, '{bad'); expect(loadGame()).toBeNull(); expect(localStorage.getItem(SAVE_BACKUP_KEY)).toBe('{bad'); }); it('rejects version mismatch', () => { const game = { ...createNewGame(), version: 2 }; localStorage.setItem(SAVE_KEY, JSON.stringify(game)); expect(loadGame()).toBeNull(); }); });
