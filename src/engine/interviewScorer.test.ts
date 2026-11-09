import { describe, expect, it } from 'vitest';
import { INTERVIEW_QUESTIONS } from '../content/interview';
import { scoreInterviewAnswer } from './interviewScorer';
const question = INTERVIEW_QUESTIONS[3];
describe('interview scorer', () => { it('rewards a STAR answer deterministically', () => { const answer = 'During a team project my role was to resolve conflict. I decided to listen and organize a plan. As a result we delivered an improved release.'; expect(scoreInterviewAnswer(answer, question, []).score).toBeGreaterThan(25); }); it('detects hedges and duplicates without crashing', () => { const answer = 'I think maybe we can talk.'; expect(scoreInterviewAnswer(answer, question, [answer]).hedges).toContain('maybe'); expect(scoreInterviewAnswer('', question, []).score).toBe(0); }); it('handles non-English text', () => { expect(scoreInterviewAnswer('मैंने टीम के साथ काम किया', question, []).score).toBeGreaterThanOrEqual(0); }); });
