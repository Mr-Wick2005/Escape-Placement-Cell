import { supabase, isSupabaseConfigured } from "./supabase";
import {
  aptitudeQuestions,
  codingChallenges,
  interviewQuestions,
  firstInterviewQuestion,
  getRandomAptitudeQuestions,
  evaluateAptitudeTest,
  evaluateCodingChallenge,
  detectInterests,
  generateDynamicQuestions,
  evaluateInterviewAnswers,
  generateInterviewAnalysis,
} from "../mock/gameData";

const BASE = process.env.REACT_APP_SUPABASE_URL
  ? `${process.env.REACT_APP_SUPABASE_URL}/functions/v1`
  : null;

// Cache of current mock questions for offline test evaluation
let cachedMockAptitudeQuestions = null;

async function callFunction(name, body) {
  if (!isSupabaseConfigured || !BASE) {
    throw new Error("Supabase is not configured; using offline fallback.");
  }

  let token = "";
  try {
    const { data } = await supabase.auth.getSession();
    token = data?.session?.access_token || "";
  } catch (authErr) {
    console.warn("Could not retrieve session for API call:", authErr.message);
  }

  const res = await fetch(`${BASE}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${name} failed with status ${res.status}: ${text}`);
  }

  return res.json();
}

export const api = {
  aptitudeStart: async () => {
    try {
      const data = await callFunction("aptitude-start", {});
      return data;
    } catch (err) {
      console.warn("aptitudeStart fallback to mock data:", err.message);
      const questions = getRandomAptitudeQuestions(10);
      cachedMockAptitudeQuestions = questions;
      return {
        sessionId: `mock-aptitude-${Date.now()}`,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
        })),
      };
    }
  },

  aptitudeSubmit: async (payload) => {
    try {
      const data = await callFunction("aptitude-submit", payload);
      return data;
    } catch (err) {
      console.warn("aptitudeSubmit fallback to mock evaluation:", err.message);
      const answers = payload?.answers || [];
      const questionsToEvaluate =
        cachedMockAptitudeQuestions ||
        aptitudeQuestions.slice(0, answers.length || 10);
      const result = evaluateAptitudeTest(answers, questionsToEvaluate);
      return {
        passed: result.passed,
        score: result.score,
        correctCount: result.correct,
        totalQuestions: result.totalQuestions,
        keyAwarded: result.passed,
      };
    }
  },

  codingStart: async (payload) => {
    try {
      const data = await callFunction("coding-start", payload || {});
      return data;
    } catch (err) {
      console.warn("codingStart fallback to mock challenge:", err.message);
      const language = payload?.language || "python";
      const challenge = codingChallenges[language] || codingChallenges.python;
      return {
        sessionId: `mock-coding-${Date.now()}`,
        problem: challenge.problem,
        starterCode: challenge.starterCode,
        publicTestCases: challenge.testCases || [],
        language,
      };
    }
  },

  codingSubmit: async (payload) => {
    try {
      const data = await callFunction("coding-submit", payload);
      return data;
    } catch (err) {
      console.warn("codingSubmit fallback to mock evaluation:", err.message);
      const { code = "", language = "python" } = payload || {};
      const evalResult = evaluateCodingChallenge(code, language);
      const challenge = codingChallenges[language] || codingChallenges.python;
      const testCases = challenge?.testCases || [];

      const publicTestResults = testCases.map((tc, idx) => ({
        testCase: idx + 1,
        passed: evalResult.passed,
        input: tc.input,
        expected: tc.expected,
        actual: evalResult.passed
          ? tc.expected
          : evalResult.feedback || "Execution mismatch",
        description: tc.description || `Test ${idx + 1}`,
        executionTime: "12ms",
      }));

      return {
        passed: evalResult.passed,
        publicTestResults,
        hiddenTestResults: [],
        language,
        feedback: evalResult.feedback,
      };
    }
  },

  interviewQuestion: async (payload) => {
    try {
      const data = await callFunction("interview-question", payload || {});
      return data;
    } catch (err) {
      console.warn("interviewQuestion fallback to mock question:", err.message);
      const {
        conversation_history = [],
        question_number = 1,
        interests,
      } = payload || {};

      if (question_number === 1) {
        return {
          id: firstInterviewQuestion.id || 1,
          question: firstInterviewQuestion.question,
          question_type: firstInterviewQuestion.type || "behavioral",
          sessionId: `mock-interview-${Date.now()}`,
        };
      }

      const answersList = conversation_history.map((c) => c.answer || "");
      const detectedInterests =
        interests || (answersList.length > 0 ? detectInterests(answersList) : {});
      const dynamicQs = generateDynamicQuestions(detectedInterests);
      const index = (question_number - 2) % (dynamicQs.length || 1);
      const selected =
        dynamicQs[index] ||
        interviewQuestions[(question_number - 1) % interviewQuestions.length] ||
        firstInterviewQuestion;

      return {
        id: selected.id || question_number,
        question: selected.question,
        question_type: selected.type || "technical",
        sessionId: `mock-interview-${Date.now()}`,
      };
    }
  },

  interviewAnalyze: async (payload) => {
    try {
      const data = await callFunction("interview-analyze", payload || {});
      return data;
    } catch (err) {
      console.warn("interviewAnalyze fallback to mock analysis:", err.message);
      const { answers = [], questions = [] } = payload || {};
      const evalResults = evaluateInterviewAnswers(answers);
      const analysis = generateInterviewAnalysis(
        evalResults,
        answers,
        questions.length > 0 ? questions : interviewQuestions
      );
      return analysis;
    }
  },

  getLeaderboard: async () => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured");
      }

      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("avg_overall_score", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("getLeaderboard fallback to mock leaderboard:", err.message);
      return [
        {
          id: "1",
          user_name: "CodeMaster",
          avg_overall_score: 98,
          total_games: 12,
          rank: 1,
        },
        {
          id: "2",
          user_name: "AlgorithmAce",
          avg_overall_score: 95,
          total_games: 8,
          rank: 2,
        },
        {
          id: "3",
          user_name: "ByteWizard",
          avg_overall_score: 92,
          total_games: 15,
          rank: 3,
        },
        {
          id: "4",
          user_name: "DevPro",
          avg_overall_score: 89,
          total_games: 6,
          rank: 4,
        },
        {
          id: "5",
          user_name: "PlacementHero",
          avg_overall_score: 85,
          total_games: 10,
          rank: 5,
        },
      ];
    }
  },
};

export default api;
