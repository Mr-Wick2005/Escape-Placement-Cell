import { describe, expect, it } from 'vitest';

describe('HUD Timer Formatting & Clamping (Part 4.7 & Part B.1)', () => {
  const formatTimer = (sec: number) => {
    const clamped = Math.max(0, Math.min(99 * 60 + 59, sec));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  it('formats standard 10:00 countdown limit accurately', () => {
    expect(formatTimer(600)).toBe('10:00');
    expect(formatTimer(599)).toBe('09:59');
    expect(formatTimer(10)).toBe('00:10');
    expect(formatTimer(0)).toBe('00:00');
  });

  it('never shows negative seconds, stopping at 00:00', () => {
    expect(formatTimer(-1)).toBe('00:00');
    expect(formatTimer(-100)).toBe('00:00');
  });

  it('never shows >99 minutes even if given massive seconds (e.g. 101:50 bug prevention)', () => {
    // 6110 seconds was the previous 101:50 wall-clock bug
    expect(formatTimer(6110)).toBe('99:59');
    expect(formatTimer(999999)).toBe('99:59');
  });
});
