import { describe, expect, it } from 'vitest';
import { generateMaze, hasPath, shiftWallSafely } from './maze';
describe('Vault maze', () => { it('keeps a path for 1,000 seeds', () => { for (let seed = 0; seed < 1000; seed += 1) expect(hasPath(generateMaze(seed))).toBe(true); }); it('rejects a wall shift that traps the player', () => { const maze = generateMaze(3); const shifted = shiftWallSafely(maze, { row: 6, col: 0 }); expect(hasPath(shifted)).toBe(true); }); });
