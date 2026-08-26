import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface InterviewAnalysisRequest {
  answers: string[];
  questions: Array<{ question: string; type: string }>;
}

interface InterviewAnalysisResponse {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  communicationSkills: string[];
  technicalDepth: string[];
  aiInsights: string;
  nextSteps: string[];
}

async function generateFallbackAnalysis(
  answers: string[],
  questions: Array<{ question: string; type: string }>
): Promise<InterviewAnalysisResponse> {
  const totalQuestions = answers.length;
  const answeredQuestions = answers.filter(
    (a) => a && a.trim().length > 0
  ).length;

  const avgAnswerLength =
    answers.reduce((sum, ans) => sum + (ans ? ans.length : 0), 0) /
    answers.length;

  let overallAssessment = "";
  if (answeredQuestions === totalQuestions) {
    if (avgAnswerLength > 80) {
      overallAssessment =
        "Outstanding interview performance! You demonstrated excellent communication and technical skills.";
    } else if (avgAnswerLength > 40) {
      overallAssessment =
        "Good interview performance with strong potential. Focus on consistency across all questions.";
    } else {
      overallAssessment =
        "Average interview performance. Work on providing more detailed and relevant answers.";
    }
  } else {
    overallAssessment = `Completed ${answeredQuestions} out of ${totalQuestions} questions. Focus on completing all interview questions.`;
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (avgAnswerLength > 80) {
    strengths.push("Good communication skills with detailed responses");
  }
  if (answeredQuestions === totalQuestions) {
    strengths.push("Completed all interview questions");
  }

  if (avgAnswerLength < 40) {
    weaknesses.push("Responses are too brief - expand on your answers");
  }
  if (answeredQuestions < totalQuestions) {
    weaknesses.push("Did not answer all questions completely");
  }

  const technicalAnswers = answers.filter(
    (ans, i) =>
      i < questions.length &&
      questions[i].type === "technical" &&
      ans &&
      ans.trim().length > 0
  );

  const communicationSkills: string[] = [];
  const technicalDepth: string[] = [];

  if (avgAnswerLength > 100) {
    communicationSkills.push("Excellent verbal communication skills");
  } else if (avgAnswerLength > 50) {
    communicationSkills.push("Good communication skills");
  } else {
    communicationSkills.push("Communication skills need improvement");
  }

  if (technicalAnswers.length > 0) {
    technicalDepth.push("Demonstrated basic technical knowledge");
  } else {
    technicalDepth.push("Limited technical depth shown");
  }

  const recommendations = [
    "Practice answering common interview questions out loud",
    "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
    "Research company-specific technologies and prepare relevant examples",
    "Record yourself answering questions to improve delivery and confidence",
  ];

  const aiInsights =
    "This analysis is based on basic heuristics. Consider practicing with more detailed responses and technical examples.";

  const nextSteps = [
    "Review technical concepts mentioned in the questions",
    "Practice mock interviews with friends or mentors",
    "Prepare specific examples from your experience",
    "Work on speaking clearly and confidently",
  ];

  return {
    overallAssessment,
    strengths,
    weaknesses,
    recommendations,
    communicationSkills,
    technicalDepth,
    aiInsights,
    nextSteps,
  };
}

async function generateAIAnalysis(
  answers: string[],
  questions: Array<{ question: string; type: string }>
): Promise<InterviewAnalysisResponse> {
  if (!GEMINI_API_KEY) {
    return generateFallbackAnalysis(answers, questions);
  }

  const conversationText = answers
    .map((answer, i) => {
      const q = questions[i] || { question: "" };
      return `Q${i + 1}: ${q.question}\nA${i + 1}: ${answer}\n\n`;
    })
    .join("");

  const prompt = `Analyze software engineering interview responses.

Return JSON:
{
  "overallAssessment": "brief summary",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["advice1", "advice2"],
  "communicationSkills": ["skill1", "skill2"],
  "technicalDepth": ["depth1", "depth2"],
  "aiInsights": "potential score out of 100",
  "nextSteps": ["step1", "step2"]
}

Conversation:
${conversationText}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const candidates = data.candidates || [];
    if (candidates.length === 0) {
      return generateFallbackAnalysis(answers, questions);
    }

    const candidate = candidates[0];
    if (candidate.finishReason === "SAFETY") {
      return generateFallbackAnalysis(answers, questions);
    }

    let analysisText =
      candidate.content?.parts?.[0]?.text?.trim() || "";

    if (analysisText.startsWith("```json")) {
      analysisText = analysisText.slice(7);
    }
    if (analysisText.startsWith("```")) {
      analysisText = analysisText.slice(3);
    }
    if (analysisText.endsWith("```")) {
      analysisText = analysisText.slice(0, -3);
    }
    analysisText = analysisText.trim();

    const parsed = JSON.parse(analysisText);
    return parsed as InterviewAnalysisResponse;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return generateFallbackAnalysis(answers, questions);
  }
}

serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await userRes.json();
    const userId = user.id;

    const body = (await req.json()) as InterviewAnalysisRequest;
    const { answers, questions } = body;

    if (!answers || !questions) {
      return new Response(
        JSON.stringify({ error: "Missing answers or questions" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const analysis = await generateAIAnalysis(answers, questions);

    const sessionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/game_sessions?user_id=eq.${userId}&select=*&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    let sessionId: string | undefined;
    if (sessionRes.ok) {
      const sessions = await sessionRes.json();
      if (sessions && sessions.length > 0) {
        sessionId = sessions[0].session_id;
      }
    }

    const totalQuestions = answers.length;
    const score = Math.min(
      totalQuestions,
      answers.filter((a) => a && a.trim().length > 20).length
    );
    const passed = score >= 4;

    if (sessionId) {
      const attemptRes = await fetch(
        `${SUPABASE_URL}/rest/v1/interview_attempts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            user_id: userId,
            score,
            total_questions: totalQuestions,
            passed,
            questions,
            answers,
            ai_analysis: analysis,
          }),
        }
      );

      if (attemptRes.ok) {
        const sessionsRes2 = await fetch(
          `${SUPABASE_URL}/rest/v1/game_sessions?session_id=eq.${sessionId}`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          }
        );
        if (sessionsRes2.ok) {
          const currentSessions = await sessionsRes2.json();
          if (currentSessions && currentSessions.length > 0) {
            const current = currentSessions[0];
            const updateRes = await fetch(
              `${SUPABASE_URL}/rest/v1/game_sessions?session_id=eq.${sessionId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  apikey: SUPABASE_SERVICE_ROLE_KEY,
                  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify({
                  rooms_completed: {
                    ...current.rooms_completed,
                    interviewRoom: true,
                  },
                  keys_collected: {
                    ...current.keys_collected,
                    keyC: true,
                  },
                  status: passed ? "completed" : "abandoned",
                  completed_at: new Date().toISOString(),
                }),
              }
            );
            if (!updateRes.ok) {
              console.error(
                "Failed to update session",
                await updateRes.text()
              );
            }
          }
        }
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
