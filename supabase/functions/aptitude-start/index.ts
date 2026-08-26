import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const aptitudeQuestions = [
  {
    id: 1,
    question:
      "If the selling price of 15 articles equals the cost price of 20 articles, find the gain %.",
    options: ["25%", "30%", "33.33%", "35%"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question:
      "A train running at 60 km/hr crosses a pole in 9 seconds. Find its length.",
    options: ["120 m", "150 m", "180 m", "200 m"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question:
      "What is the simple interest on ₹10,000 at 12% per annum for 2 years?",
    options: ["₹2200", "₹2400", "₹2500", "₹2600"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "If A = 2 and B = 3, then (A³ + B³)/(A + B) = ?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question:
      "The sum of two numbers is 45 and their difference is 9. Find the larger number.",
    options: ["18", "24", "27", "30"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: "What is 20% of 25% of 400?",
    options: ["15", "18", "20", "25"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question:
      "A can finish work in 12 days, B in 18 days. Working together they complete it in:",
    options: ["6 days", "7 days", "7.2 days", "8 days"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "HCF of 24, 36, and 60 is:",
    options: ["6", "8", "10", "12"],
    correctAnswer: 3,
  },
  {
    id: 9,
    question:
      "A person covers 60 km at 30 km/hr and returns at 20 km/hr. Find average speed.",
    options: ["22 km/hr", "24 km/hr", "25 km/hr", "26 km/hr"],
    correctAnswer: 1,
  },
  {
    id: 10,
    question:
      "A man's age is 3 times his son's. After 10 years, he'll be twice his son's. Find father's age.",
    options: ["25", "28", "30", "33"],
    correctAnswer: 2,
  },
  {
    id: 11,
    question: "If 4 pencils cost ₹20, cost of 10 pencils is:",
    options: ["₹40", "₹45", "₹50", "₹55"],
    correctAnswer: 2,
  },
  {
    id: 12,
    question: "Find the next term: 3, 9, 27, 81, ?",
    options: ["121", "243", "162", "324"],
    correctAnswer: 1,
  },
  {
    id: 13,
    question: "Probability of picking a blue ball from 4 red, 5 blue, 3 green?",
    options: ["1/3", "5/12", "1/4", "5/10"],
    correctAnswer: 1,
  },
  {
    id: 14,
    question: "Compound interest on ₹5000 at 10% for 2 years = ?",
    options: ["₹1000", "₹1050", "₹1100", "₹1150"],
    correctAnswer: 1,
  },
  {
    id: 15,
    question:
      "The ratio of two numbers is 3:4, their sum is 84. Smaller number = ?",
    options: ["28", "32", "36", "40"],
    correctAnswer: 2,
  },
  {
    id: 16,
    question: "Simplify: 2³ × 2⁴ / 2² = ?",
    options: ["8", "16", "32", "64"],
    correctAnswer: 2,
  },
  {
    id: 17,
    question:
      "8 workers complete a task in 6 days. 12 workers will complete it in:",
    options: ["3 days", "4 days", "5 days", "6 days"],
    correctAnswer: 1,
  },
  {
    id: 18,
    question: "Perimeter of square is 48 cm. Find area.",
    options: ["120 cm²", "132 cm²", "144 cm²", "156 cm²"],
    correctAnswer: 2,
  },
  {
    id: 19,
    question: "Find the next term: 7, 14, 28, 56, ?",
    options: ["84", "98", "112", "120"],
    correctAnswer: 2,
  },
  {
    id: 20,
    question: "If cost price = ₹500 and profit = 25%, selling price = ?",
    options: ["₹600", "₹625", "₹650", "₹700"],
    correctAnswer: 1,
  },
];

function getRandomQuestions(count: number) {
  const shuffled = [...aptitudeQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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

    const questions = getRandomQuestions(10);

    const sessionRes = await fetch(
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
          current_room: 1,
          status: "in_progress",
          questions: questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        }),
      }
    );

    if (!sessionRes.ok) {
      const text = await sessionRes.text();
      return new Response(JSON.stringify({ error: "Failed to create session", details: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await sessionRes.json();
    const sessionId = session[0]?.session_id;

    return new Response(
      JSON.stringify({
        sessionId,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
        })),
      }),
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
