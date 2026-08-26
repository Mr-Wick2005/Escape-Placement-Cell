import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface CodingProblem {
  language: string;
  problem: string;
  starterCode: string;
  publicTestCases: Array<{ input: any; expected: any; description: string }>;
  hiddenTestCases: Array<{ input: any; expected: any }>;
}

const codingProblems: Record<string, CodingProblem> = {
  python: {
    language: "python",
    problem: `Write a function that returns the factorial of a given number.

Example:
factorial(5) should return 120
factorial(0) should return 1

Requirements:
- Handle edge case for 0
- Use recursive or iterative approach
- Return the factorial as a number`,
    starterCode: `def factorial(n):
    # Your code here
    pass

# Test cases
print(factorial(5))  # Should output: 120
print(factorial(0))  # Should output: 1
print(factorial(3))  # Should output: 6`,
    publicTestCases: [
      { input: 5, expected: 120, description: "factorial(5) = 120" },
      { input: 0, expected: 1, description: "factorial(0) = 1" },
      { input: 3, expected: 6, description: "factorial(3) = 6" },
    ],
    hiddenTestCases: [
      { input: 1, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
  },
  javascript: {
    language: "javascript",
    problem: `Write a function that checks if a string is a palindrome.

Example:
isPalindrome("racecar") should return true
isPalindrome("hello") should return false

Requirements:
- Ignore case sensitivity
- Ignore spaces and punctuation
- Return boolean value`,
    starterCode: `function isPalindrome(str) {
    // Your code here
}

// Test cases
console.log(isPalindrome("racecar"));  // Should output: true
console.log(isPalindrome("hello"));    // Should output: false
console.log(isPalindrome("A man a plan a canal Panama"));  // Should output: true`,
    publicTestCases: [
      {
        input: "racecar",
        expected: true,
        description: "isPalindrome('racecar') = true",
      },
      {
        input: "hello",
        expected: false,
        description: "isPalindrome('hello') = false",
      },
      {
        input: "A man a plan a canal Panama",
        expected: true,
        description: "isPalindrome('A man a plan a canal Panama') = true",
      },
    ],
    hiddenTestCases: [
      { input: "Racecar", expected: true },
      { input: "", expected: true },
    ],
  },
  java: {
    language: "java",
    problem: `Write a method that finds the maximum element in an array.

Example:
findMax([1, 5, 3, 9, 2]) should return 9
findMax([-1, -5, -3]) should return -1

Requirements:
- Handle empty array (return appropriate value)
- Use iterative approach
- Return the maximum integer`,
    starterCode: `public class Main {
    public static int findMax(int[] arr) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        // Test cases
        System.out.println(findMax(new int[]{1, 5, 3, 9, 2}));  // Should output: 9
        System.out.println(findMax(new int[]{-1, -5, -3}));      // Should output: -1
    }
}`,
    publicTestCases: [
      {
        input: [1, 5, 3, 9, 2],
        expected: 9,
        description: "findMax([1, 5, 3, 9, 2]) = 9",
      },
      {
        input: [-1, -5, -3],
        expected: -1,
        description: "findMax([-1, -5, -3]) = -1",
      },
      {
        input: [42],
        expected: 42,
        description: "findMax([42]) = 42",
      },
    ],
    hiddenTestCases: [
      { input: [5, 5, 5], expected: 5 },
      { input: [-10, -20, -5], expected: -5 },
    ],
  },
  cpp: {
    language: "cpp",
    problem: `Write a function that returns the factorial of a given number.

Example:
factorial(5) should return 120
factorial(0) should return 1

Requirements:
- Handle edge case for 0
- Use recursive or iterative approach
- Return the factorial as a number`,
    starterCode: `#include <iostream>
using namespace std;

int factorial(int n) {
    // Your code here
    return 0;
}

int main() {
    // Test cases
    cout << factorial(5) << endl;  // Should output: 120
    cout << factorial(0) << endl;  // Should output: 1
    cout << factorial(3) << endl;  // Should output: 6
    return 0;
}`,
    publicTestCases: [
      { input: 5, expected: 120, description: "factorial(5) = 120" },
      { input: 0, expected: 1, description: "factorial(0) = 1" },
      { input: 3, expected: 6, description: "factorial(3) = 6" },
    ],
    hiddenTestCases: [
      { input: 1, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
  },
  c: {
    language: "c",
    problem: `Write a function that returns the factorial of a given number.

Example:
factorial(5) should return 120
factorial(0) should return 1

Requirements:
- Handle edge case for 0
- Use recursive or iterative approach
- Return the factorial as a number`,
    starterCode: `#include <stdio.h>

int factorial(int n) {
    // Your code here
    return 0;
}

int main() {
    printf("%d\\n", factorial(5));  // Should output: 120
    printf("%d\\n", factorial(0));  // Should output: 1
    printf("%d\\n", factorial(3));  // Should output: 6
    return 0;
}`,
    publicTestCases: [
      { input: 5, expected: 120, description: "factorial(5) = 120" },
      { input: 0, expected: 1, description: "factorial(0) = 1" },
      { input: 3, expected: 6, description: "factorial(3) = 6" },
    ],
    hiddenTestCases: [
      { input: 1, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
  },
};

function getOrCreateSession(userId: string): Promise<any> {
  return fetch(
    `${SUPABASE_URL}/rest/v1/game_sessions?user_id=eq.${userId}&select=*&order=created_at.desc&limit=1`,
    {
      headers: {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  ).then((res) => res.json()).then((sessions) => {
    if (sessions && sessions.length > 0) {
      return sessions[0];
    }
    return fetch(
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
        }),
      }
    ).then((res) => res.json()).then((data) => data[0]);
  });
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
    const { language } = body;

    const lang = language || "python";
    const problem = codingProblems[lang];

    if (!problem) {
      return new Response(JSON.stringify({ error: "Unsupported language" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await getOrCreateSession(userId);

    return new Response(
      JSON.stringify({
        sessionId: session.session_id,
        problem: problem.problem,
        starterCode: problem.starterCode,
        publicTestCases: problem.publicTestCases,
        language: problem.language,
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
