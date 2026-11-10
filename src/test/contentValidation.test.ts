import { describe, expect, it } from 'vitest';
import { APTITUDE_QUESTIONS } from '../content/aptitude';
import { BONUS_RIDDLES, FINAL_RIDDLE } from '../content/riddles';
import { CODING_PUZZLE_BANK } from '../content/coding';
import { INTERVIEW_QUESTION_BANK } from '../content/interview';

describe('Content Bank Validation (Part 20 Specification)', () => {
  describe('Aptitude Content (20 questions, 6 formats, 4 categories)', () => {
    it('has exactly 20 questions with unique IDs', () => {
      expect(APTITUDE_QUESTIONS.length).toBe(20);
      const ids = new Set(APTITUDE_QUESTIONS.map((q) => q.id));
      expect(ids.size).toBe(20);
    });

    it('covers all 4 categories and all 6 question formats', () => {
      const categories = new Set(APTITUDE_QUESTIONS.map((q) => q.category));
      expect(categories).toContain('quant');
      expect(categories).toContain('logic');
      expect(categories).toContain('verbal');
      expect(categories).toContain('data');

      const formats = new Set(APTITUDE_QUESTIONS.map((q) => q.format));
      expect(formats).toContain('mcq');
      expect(formats).toContain('number');
      expect(formats).toContain('pattern');
      expect(formats).toContain('sequence');
      expect(formats).toContain('oddone');
      expect(formats).toContain('cipher');
    });

    it('every question has valid answers, explanations, valid digits, and 2 non-empty hints', () => {
      for (const q of APTITUDE_QUESTIONS) {
        expect(q.prompt.trim().length).toBeGreaterThan(5);
        expect(q.answer.trim().length).toBeGreaterThan(0);
        expect(q.explanation.trim().length).toBeGreaterThan(5);
        expect(q.hints.length).toBe(2);
        expect(q.hints[0].trim().length).toBeGreaterThan(3);
        expect(q.hints[1].trim().length).toBeGreaterThan(3);
        expect(q.digit).toBeGreaterThanOrEqual(0);
        expect(q.digit).toBeLessThanOrEqual(9);

        if (q.options) {
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(q.options).toContain(q.answer);
        }
      }
    });
  });

  describe('Riddles Content (5 bonus riddles + final riddle)', () => {
    it('has 5 bonus riddles with unique IDs and 2 hints or clear explanations', () => {
      expect(BONUS_RIDDLES.length).toBe(5);
      const ids = new Set(BONUS_RIDDLES.map((r) => r.id));
      expect(ids.size).toBe(5);

      for (const r of BONUS_RIDDLES) {
        expect(r.question.trim().length).toBeGreaterThan(10);
        expect(r.answer.trim().length).toBeGreaterThan(0);
        expect(r.acceptedVariants.length).toBeGreaterThan(0);
        expect(r.explanation.trim().length).toBeGreaterThan(5);
        expect(r.hint.trim().length).toBeGreaterThan(3);
      }
    });

    it('final riddle has 3 reflective philosophy options', () => {
      expect(FINAL_RIDDLE.options.length).toBe(3);
      for (const opt of FINAL_RIDDLE.options) {
        expect(opt.id).toBeTruthy();
        expect(opt.philosophy.length).toBeGreaterThan(3);
        expect(opt.response.length).toBeGreaterThan(10);
        expect(opt.endingFlavor.length).toBeGreaterThan(10);
      }
    });
  });

  describe('Coding Content (3 variants per terminal, JS and Python starters, hidden test)', () => {
    it('has 9 total puzzles (3 variants across 3 terminals)', () => {
      expect(CODING_PUZZLE_BANK.length).toBe(9);
      const ids = new Set(CODING_PUZZLE_BANK.map((p) => p.id));
      expect(ids.size).toBe(9);

      const terminal1 = CODING_PUZZLE_BANK.filter((p) => p.terminal === 1);
      const terminal2 = CODING_PUZZLE_BANK.filter((p) => p.terminal === 2);
      const terminal3 = CODING_PUZZLE_BANK.filter((p) => p.terminal === 3);

      expect(terminal1.length).toBe(3);
      expect(terminal2.length).toBe(3);
      expect(terminal3.length).toBe(3);
    });

    it('each puzzle has JS and Python starters, at least 1 hidden test, and 2 hints', () => {
      for (const p of CODING_PUZZLE_BANK) {
        expect(p.starterCode.length).toBeGreaterThan(10);
        expect(p.starterCodes.js.length).toBeGreaterThan(10);
        expect(p.starterCodes.py.length).toBeGreaterThan(10);
        expect(p.hints.length).toBe(2);
        expect(p.hints[0].length).toBeGreaterThan(3);
        expect(p.hints[1].length).toBeGreaterThan(3);

        const hasHidden = p.tests.some((t) => t.hidden === true);
        expect(hasHidden).toBe(true);
      }
    });
  });

  describe('Interview Content (21 questions, 3 per slot, keyword groups, STAR flags)', () => {
    it('has 21 questions total with 3 per slot (1 through 7)', () => {
      expect(INTERVIEW_QUESTION_BANK.length).toBe(21);
      const ids = new Set(INTERVIEW_QUESTION_BANK.map((q) => q.id));
      expect(ids.size).toBe(21);

      for (let slot = 1; slot <= 7; slot++) {
        const inSlot = INTERVIEW_QUESTION_BANK.filter((q) => q.slot === slot);
        expect(inSlot.length).toBe(3);
      }
    });

    it('each question has keyword groups, STAR flags, and valid word ranges', () => {
      for (const q of INTERVIEW_QUESTION_BANK) {
        expect(q.prompt.length).toBeGreaterThan(10);
        expect(q.keywordGroups.length).toBeGreaterThanOrEqual(1);
        expect(typeof q.starExpected).toBe('boolean');
        expect(q.idealWords[0]).toBeGreaterThanOrEqual(20);
        expect(q.idealWords[1]).toBeGreaterThan(q.idealWords[0]);
        expect(q.rune).toBeTruthy();
        expect(q.tip.length).toBeGreaterThan(10);
      }
    });
  });
});
