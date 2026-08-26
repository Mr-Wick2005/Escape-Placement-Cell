import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface InterviewQuestionRequest {
  conversation_history: Array<{ question: string; answer: string }>;
  question_number: number;
  interests?: Record<string, number>;
}

interface InterviewQuestionResponse {
  question: string;
  question_type: string;
  id: string;
}

const fallbackQuestions = [
  {
    question: "Tell me about yourself and your background in computer science.",
    type: "personal",
  },
  {
    question: "What programming languages are you proficient in?",
    type: "technical",
  },
  {
    question: "Explain the difference between object-oriented and functional programming.",
    type: "technical",
  },
  {
    question: "Describe a challenging project you worked on and how you overcame difficulties.",
    type: "personal",
  },
  {
    question: "What is your approach to debugging code?",
    type: "technical",
  },
  {
    question: "How do you stay updated with technology trends?",
    type: "personal",
  },
  {
    question: "Explain the concept of time complexity and space complexity.",
    type: "technical",
  },
];

function getFallbackQuestion(questionNumber: number, interests?: Record<string, number>): InterviewQuestionResponse {
  if (interests) {
    const domainQuestions: Array<{ question: string; type: string }> = [];

    if (interests.frontend > 0) {
      domainQuestions.push(
        { question: "How would you optimize a slow-loading web page?", type: "technical" },
        { question: "Explain the difference between React state and props.", type: "technical" }
      );
    }
    if (interests.backend > 0) {
      domainQuestions.push(
        { question: "How do you handle database connections in a high-traffic application?", type: "technical" },
        { question: "Explain RESTful API design principles.", type: "technical" }
      );
    }
    if (interests.dataScience > 0) {
      domainQuestions.push(
        { question: "Explain the difference between supervised and unsupervised learning.", type: "technical" },
        { question: "How do you handle missing data in a dataset?", type: "technical" }
      );
    }
    if (interests.machineLearning > 0) {
      domainQuestions.push(
        { question: "What are the differences between overfitting and underfitting?", type: "technical" },
        { question: "Explain the concept of gradient descent.", type: "technical" }
      );
    }
    if (interests.devops > 0) {
      domainQuestions.push(
        { question: "How do you implement CI/CD pipelines?", type: "technical" },
        { question: "Explain container orchestration and its benefits.", type: "technical" }
      );
    }
    if (interests.mobile > 0) {
      domainQuestions.push(
        { question: "What are the key considerations for mobile app performance?", type: "technical" },
        { question: "How do you handle different screen sizes and orientations in mobile apps?", type: "technical" }
      );
    }
    if (interests.cybersecurity > 0) {
      domainQuestions.push(
        { question: "What are common web application security vulnerabilities?", type: "technical" },
        { question: "How do you implement secure authentication?", type: "technical" }
      );
    }
    if (interests.blockchain > 0) {
      domainQuestions.push(
        { question: "Explain the difference between public and private blockchains.", type: "technical" },
        { question: "What are smart contracts and how do they work?", type: "technical" }
      );
    }
    if (interests.cloud > 0) {
      domainQuestions.push(
        { question: "How do you choose between different cloud service models?", type: "technical" },
        { question: "Explain cloud security best practices.", type: "technical" }
      );
    }

    if (domainQuestions.length > 0) {
      const used = new Set<string>();
      const unique = domainQuestions.filter(q => {
        if (used.has(q.question)) return false;
        used.add(q.question);
        return true;
      });
      const index = (questionNumber - 1) % unique.length;
      const q = unique[index];
      return { question: q.question, question_type: q.type, id: crypto.randomUUID() };
    }
  }

  const index = (questionNumber - 1) % fallbackQuestions.length;
  const q = fallbackQuestions[index];
  return { question: q.question, question_type: q.type, id: crypto.randomUUID() };
}

async function generateAIQuestion(
  conversationHistory: Array<{ question: string; answer: string }>,
  questionNumber: number
): Promise<InterviewQuestionResponse> {
  if (!GEMINI_API_KEY) {
    return getFallbackQuestion(questionNumber);
  }

  const conversationText = conversationHistory
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const isPersonal = questionNumber % 3 === 1;
  const questionType = isPersonal ? "personal" : "technical";

  const prompt = `Generate a ${questionType} interview question for software engineering candidates.

Guidelines:
- Professional and workplace-appropriate
- Technical: programming, algorithms, system design
- Personal: career goals, learning experiences
- Build on conversation history when possible
- Clear and specific

History:
${conversationText}

Return only the question text.`;

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
            maxOutputTokens: 150,
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
      return getFallbackQuestion(questionNumber);
    }

    const candidate = candidates[0];
    if (candidate.finishReason === "SAFETY") {
      return getFallbackQuestion(questionNumber);
    }

    let questionText = candidate.content?.parts?.[0]?.text?.trim() || "";
    if (questionText.startsWith('"') && questionText.endsWith('"')) {
      questionText = questionText.slice(1, -1);
    }
    if (questionText.startsWith("'") && questionText.endsWith("'")) {
      questionText = questionText.slice(1, -1);
    }

    return { question: questionText, question_type: questionType, id: crypto.randomUUID() };
  } catch (error) {
    console.error("Gemini error:", error);
    return getFallbackQuestion(questionNumber);
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
    const userRes = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        headers: { "Authorization": `Bearer ${token}` },
      }
    );

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await userRes.json();
    const userId = user.id;

    const body = await req.json() as InterviewQuestionRequest;
    const { conversation_history, question_number, interests } = body;

    const question = await generateAIQuestion(conversation_history || [], question_number);

    const sessionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/game_sessions?user_id=eq.${userId}&select=*&order=created_at.desc&limit=1`,
      {
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
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

    if (!sessionId) {
      const createRes = await fetch(
        `${SUPABASE_URL}/rest/v1/game_sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            current_room: 3,
            status: "in_progress",
          }),
        }
      );
      if (createRes.ok) {
        const data = await createRes.json();
        sessionId = data[0]?.session_id;
      }
    }

    return new Response(
      JSON.stringify({ ...question, sessionId }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
