export const deriveVaultFragment = (digits: number[]): string | null => digits.length >= 4 ? digits.slice(0, 4).join('') : null;
