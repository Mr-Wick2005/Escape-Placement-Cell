import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    const body = await req.json();
    const { sessionId, answers } = body;

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return new Response(JSON.stringify({ error: "Missing sessionId or answers" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sessionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/game_sessions?session_id=eq.${sessionId}&user_id=eq.${userId}&select=*`,
      {
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!sessionRes.ok) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sessions = await sessionRes.json();
    if (!sessions || sessions.length === 0) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = sessions[0];
    const questions = session.questions || [];

    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correct / totalQuestions) * 100);
    const passed = score >= 60;

    const attemptRes = await fetch(
      `${SUPABASE_URL}/rest/v1/aptitude_attempts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          score,
          correct_count: correct,
          total_questions: totalQuestions,
          passed,
          questions: questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
          })),
          user_answers: answers,
        }),
      }
    );

    if (!attemptRes.ok) {
      const text = await attemptRes.text();
      return new Response(JSON.stringify({ error: "Failed to save attempt", details: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (passed) {
      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/game_sessions?session_id=eq.${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            rooms_completed: {
              ...session.rooms_completed,
              classroom: true,
            },
            keys_collected: {
              ...session.keys_collected,
              keyA: true,
            },
            current_room: 2,
          }),
        }
      );

      if (!updateRes.ok) {
        console.error("Failed to update session", await updateRes.text());
      }
    }

    return new Response(
      JSON.stringify({ passed, score, correctCount: correct, totalQuestions, keyAwarded: passed }),
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
