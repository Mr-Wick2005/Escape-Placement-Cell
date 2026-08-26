import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

interface TestCase {
  input: any;
  expected: any;
  description?: string;
}

interface CodingProblem {
  language: string;
  problem: string;
  starterCode: string;
  publicTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  pistonLanguage: string;
  pistonVersion: string;
}

const codingProblems: Record<string, CodingProblem> = {
  python: {
    language: "python",
    problem: "Write a function that returns the factorial of a given number.",
    starterCode: "def factorial(n):\n    # Your code here\n    pass",
    publicTestCases: [
      { input: 5, expected: 120, description: "factorial(5) = 120" },
      { input: 0, expected: 1, description: "factorial(0) = 1" },
      { input: 3, expected: 6, description: "factorial(3) = 6" },
    ],
    hiddenTestCases: [
      { input: 1, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
    pistonLanguage: "python",
    pistonVersion: "3.10.0",
  },
  javascript: {
    language: "javascript",
    problem: "Write a function that checks if a string is a palindrome.",
    starterCode: "function isPalindrome(str) {\n    // Your code here\n}",
    publicTestCases: [
      { input: "racecar", expected: true, description: "isPalindrome('racecar') = true" },
      { input: "hello", expected: false, description: "isPalindrome('hello') = false" },
    ],
    hiddenTestCases: [
      { input: "Racecar", expected: true },
      { input: "", expected: true },
    ],
    pistonLanguage: "javascript",
    pistonVersion: "18.15.0",
  },
  java: {
    language: "java",
    problem: "Write a method that finds the maximum element in an array.",
    starterCode: "public class Main {\n    public static int findMax(int[] arr) {\n        // Your code here\n        return 0;\n    }\n}",
    publicTestCases: [
      { input: [1, 5, 3, 9, 2], expected: 9, description: "findMax([1, 5, 3, 9, 2]) = 9" },
      { input: [-1, -5, -3], expected: -1, description: "findMax([-1, -5, -3]) = -1" },
    ],
    hiddenTestCases: [
      { input: [42], expected: 42 },
      { input: [5, 5, 5], expected: 5 },
    ],
    pistonLanguage: "java",
    pistonVersion: "17.0.0",
  },
  cpp: {
    language: "cpp",
    problem: "Write a function that returns the factorial of a given number.",
    starterCode: "#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    // Your code here\n    return 0;\n}",
    publicTestCases: [
      { input: 5, expected: 120, description: "factorial(5) = 120" },
      { input: 0, expected: 1, description: "factorial(0) = 1" },
    ],
    hiddenTestCases: [
      { input: 1, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
    pistonLanguage: "cpp",
    pistonVersion: "10.2.0",
  },
  c: {
    language: "c",
    problem: "Write a function that returns the factorial of a given number.",
    starterCode: "#include <stdio.h>\n\nint factorial(int n) {\n    // Your code here\n    return 0;\n}",
    publicTestCases: [
      { input: 5, expected: 120, description: "factorial(5) = 120" },
      { input: 0, expected: 1, description: "factorial(0) = 1" },
    ],
    hiddenTestCases: [
      { input: 1, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
    pistonLanguage: "c",
    pistonVersion: "10.2.0",
  },
};

function buildWrapperCode(language: string, userCode: string, testCases: TestCase[]): string {
  switch (language) {
    case "python":
      return `${userCode}\n\nimport json\nresults = []\nfor tc in ${JSON.stringify(testCases)}:\n    try:\n        result = factorial(tc["input"])\n        results.append({"input": tc["input"], "expected": tc["expected"], "actual": result, "passed": result == tc["expected"]})\n    except Exception as e:\n        results.append({"input": tc["input"], "expected": tc["expected"], "actual": str(e), "passed": False})\nprint(json.dumps(results))`;

    case "javascript":
      return `${userCode}\n\nconst tests = ${JSON.stringify(testCases)};\nconst results = [];\nfor (const tc of tests) {\n  try {\n    const result = isPalindrome(tc.input);\n    results.push({input: tc.input, expected: tc.expected, actual: result, passed: result === tc.expected});\n  } catch (e) {\n    results.push({input: tc.input, expected: tc.expected, actual: e.message, passed: false});\n  }\n}\nconsole.log(JSON.stringify(results));`;

    case "java": {
      const inputs = testCases.map(tc => JSON.stringify(tc.input)).join(", ");
      const expected = testCases.map(tc => JSON.stringify(tc.expected)).join(", ");
      return `${userCode}\n\npublic class TestRunner {\n    public static void main(String[] args) {\n        int[][] inputs = new int[][] {${inputs}};\n        int[] expected = new int[] {${expected}};\n        for (int i = 0; i < inputs.length; i++) {\n            int result = Main.findMax(inputs[i]);\n            System.out.println(result == expected[i] ? "PASS" : "FAIL");\n        }\n    }\n}`;
    }

    case "cpp": {
      const inputs = testCases.map(tc => JSON.stringify(tc.input)).join(", ");
      const expected = testCases.map(tc => JSON.stringify(tc.expected)).join(", ");
      return `${userCode}\n\nint main() {\n    int inputs[][10] = {${inputs}};\n    int expected[] = {${expected}};\n    for (int i = 0; i < ${testCases.length}; i++) {\n        cout << (factorial(inputs[i][0]) == expected[i] ? "PASS" : "FAIL") << endl;\n    }\n    return 0;\n}`;
    }

    case "c": {
      const inputs = testCases.map(tc => JSON.stringify(tc.input)).join(", ");
      const expected = testCases.map(tc => JSON.stringify(tc.expected)).join(", ");
      return `${userCode}\n\nint main() {\n    int inputs[][10] = {${inputs}};\n    int expected[] = {${expected}};\n    for (int i = 0; i < ${testCases.length}; i++) {\n        printf("%s\\n", factorial(inputs[i][0]) == expected[i] ? "PASS" : "FAIL");\n    }\n    return 0;\n}`;
    }

    default:
      return userCode;
  }
}

async function runPiston(language: string, version: string, code: string): Promise<any> {
  const res = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language,
      version,
      files: [{ name: getFileName(language), content: code }],
      stdin: "",
      args: [],
      compile_timeout: 5000,
      run_timeout: 5000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Piston API returned ${res.status}`);
  }

  return res.json();
}

function getFileName(language: string): string {
  switch (language) {
    case "python": return "main.py";
    case "javascript": return "main.js";
    case "java": return "Main.java";
    case "cpp": return "main.cpp";
    case "c": return "main.c";
    default: return "main.txt";
  }
}

function parseTestResults(language: string, output: string, testCases: TestCase[]): any[] {
  const lines = output.trim().split("\n").filter(line => line.trim() !== "");
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    if (i < lines.length) {
      const line = lines[i].trim();
      if (language === "python" || language === "javascript") {
        try {
          const parsed = JSON.parse(line);
          if (Array.isArray(parsed) && parsed[i]) {
            results.push({
              testCase: i + 1,
              passed: parsed[i].passed,
              input: tc.input,
              expected: tc.expected,
              actual: parsed[i].actual,
              description: tc.description || `Test ${i + 1}`,
              executionTime: "N/A",
            });
            continue;
          }
        } catch (e) {
          // fall through
        }
      }
      const passed = line === "PASS";
      results.push({
        testCase: i + 1,
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: passed ? tc.expected : "Failed",
        description: tc.description || `Test ${i + 1}`,
        executionTime: "N/A",
      });
    } else {
      results.push({
        testCase: i + 1,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: "No output",
        description: tc.description || `Test ${i + 1}`,
        executionTime: "N/A",
      });
    }
  }

  return results;
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

    const body = await req.json();
    const { sessionId, code, language } = body;

    if (!sessionId || !code || !language) {
      return new Response(JSON.stringify({ error: "Missing sessionId, code, or language" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const problem = codingProblems[language];
    if (!problem) {
      return new Response(JSON.stringify({ error: "Unsupported language" }), {
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

    const allTestCases = [...problem.publicTestCases, ...problem.hiddenTestCases];
    const wrappedCode = buildWrapperCode(language, code, allTestCases);

    let pistonOutput;
    try {
      const pistonRes = await runPiston(problem.pistonLanguage, problem.pistonVersion, wrappedCode);
      pistonOutput = pistonRes.run?.output || "";
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "CODE_EXECUTION_UNAVAILABLE", message: error.message }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const allResults = parseTestResults(language, pistonOutput, allTestCases);
    const publicResults = allResults.slice(0, problem.publicTestCases.length);
    const hiddenResults = allResults.slice(problem.publicTestCases.length);

    const passed = allResults.every((r) => r.passed);

    const attemptRes = await fetch(
      `${SUPABASE_URL}/rest/v1/coding_attempts`,
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
          language,
          passed,
          public_test_results: publicResults,
          hidden_test_results: hiddenResults,
          submitted_code: code,
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
              codingLab: true,
            },
            keys_collected: {
              ...session.keys_collected,
              keyB: true,
            },
            current_room: 3,
          }),
        }
      );

      if (!updateRes.ok) {
        console.error("Failed to update session", await updateRes.text());
      }
    }

    return new Response(
      JSON.stringify({
        passed,
        publicTestResults: publicResults,
        hiddenTestResults: hiddenResults,
        language,
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
