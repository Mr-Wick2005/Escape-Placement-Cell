import { describe, expect, it } from 'vitest';
import { deriveVaultFragment } from '../engine/derivations';

describe('Code Fragment Derivation Determinism (Part 16.1 & 16.4)', () => {
  it('deterministically derives 4-digit vault code from collected digits', () => {
    const digits = [7, 3, 1, 9];
    const fragment1 = deriveVaultFragment(digits);
    const fragment2 = deriveVaultFragment(digits);

    expect(fragment1).toBe('7319');
    expect(fragment2).toBe('7319');
    expect(fragment1).toBe(fragment2);
  });

  it('slices only the first 4 digits when player collects more', () => {
    const digits = [3, 8, 4, 2, 9, 1];
    expect(deriveVaultFragment(digits)).toBe('3842');
  });

  it('returns null when notebook has fewer than 4 digits', () => {
    expect(deriveVaultFragment([1, 2, 3])).toBeNull();
    expect(deriveVaultFragment([])).toBeNull();
  });
});
