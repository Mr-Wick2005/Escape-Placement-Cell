import { supabase } from "./supabase";

const BASE = process.env.REACT_APP_SUPABASE_URL + "/functions/v1";

async function callFunction(name, body) {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${BASE}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${name} failed: ${res.status} ${text}`);
  }

  return res.json();
}

export const api = {
  aptitudeStart: async () => {
    return callFunction("aptitude-start", {});
  },

  aptitudeSubmit: (payload) => {
    return callFunction("aptitude-submit", payload);
  },

  codingStart: (payload) => {
    return callFunction("coding-start", payload);
  },

  codingSubmit: (payload) => {
    return callFunction("coding-submit", payload);
  },

  interviewQuestion: (payload) => {
    return callFunction("interview-question", payload);
  },

  interviewAnalyze: (payload) => {
    return callFunction("interview-analyze", payload);
  },

  getLeaderboard: async () => {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("avg_overall_score", { ascending: false });

    if (error) throw error;
    return data;
  },
};

export default api;
