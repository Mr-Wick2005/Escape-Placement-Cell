// Test script for generateInterviewAnalysis function
import { generateInterviewAnalysis, interviewQuestions } from "./gameData.js";

// Mock result and answers for testing
const mockResult = {
  score: 75,
  totalQuestions: 8,
  passed: true,
};

const mockAnswers = [
  "I have a background in computer science with experience in web development and machine learning projects.",
  "I am proficient in JavaScript, Python, and Java.",
  "Object-oriented programming focuses on objects and classes, while functional programming emphasizes functions and immutability.",
  "I worked on a complex e-commerce platform where I overcame scalability issues by implementing microservices architecture.",
  "I use debugging tools like breakpoints in VS Code and console logging to isolate and fix issues.",
  "I stay updated through tech blogs, online courses on Udemy, and participating in developer communities.",
  "Time complexity measures how execution time grows with input size, space complexity measures memory usage.",
  "I learned React quickly for a project by following official documentation and building small prototypes.",
];

// Custom questions array for testing
const customQuestions = [
  {
    id: 1,
    question: "Tell me about yourself.",
    type: "behavioral",
    expectedKeywords: ["background", "experience"],
  },
  {
    id: 2,
    question: "What languages do you know?",
    type: "technical",
    expectedKeywords: ["javascript", "python"],
  },
];

// Test cases
const testCases = [
  {
    name: "Default questions (backward compatibility)",
    result: mockResult,
    answers: mockAnswers,
    questions: undefined, // Use default
    expected: {
      hasOverallAssessment: true,
      hasStrengths: true,
      hasWeaknesses: true,
      hasRecommendations: true,
      hasCommunicationSkills: true,
      hasTechnicalDepth: true,
      hasAiInsights: true,
      hasNextSteps: true,
    },
  },
  {
    name: "Custom questions array",
    result: { score: 50, totalQuestions: 2, passed: false },
    answers: ["Short answer", "Another short answer"],
    questions: customQuestions,
    expected: {
      hasOverallAssessment: true,
      hasStrengths: true,
      hasWeaknesses: true,
      hasRecommendations: true,
      hasCommunicationSkills: true,
      hasTechnicalDepth: true,
      hasAiInsights: true,
      hasNextSteps: true,
    },
  },
  {
    name: "Empty questions array",
    result: { score: 0, totalQuestions: 0, passed: false },
    answers: [],
    questions: [],
    expected: {
      hasOverallAssessment: true,
      hasStrengths: true,
      hasWeaknesses: true,
      hasRecommendations: true,
      hasCommunicationSkills: true,
      hasTechnicalDepth: true,
      hasAiInsights: true,
      hasNextSteps: true,
    },
  },
  {
    name: "Undefined questions (should use default)",
    result: mockResult,
    answers: mockAnswers,
    questions: undefined,
    expected: {
      hasOverallAssessment: true,
      hasStrengths: true,
      hasWeaknesses: true,
      hasRecommendations: true,
      hasCommunicationSkills: true,
      hasTechnicalDepth: true,
      hasAiInsights: true,
      hasNextSteps: true,
    },
  },
];

console.log("Testing generateInterviewAnalysis function...\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);

  try {
    const analysis = generateInterviewAnalysis(
      testCase.result,
      testCase.answers,
      testCase.questions
    );

    // Check if analysis object is returned
    if (typeof analysis !== "object" || analysis === null) {
      throw new Error("Function did not return an object");
    }

    // Check required properties
    const requiredProps = [
      "overallAssessment",
      "strengths",
      "weaknesses",
      "recommendations",
      "communicationSkills",
      "technicalDepth",
      "aiInsights",
      "nextSteps",
    ];

    requiredProps.forEach((prop) => {
      if (!(prop in analysis)) {
        throw new Error(`Missing required property: ${prop}`);
      }
    });

    // Check if arrays are arrays
    const arrayProps = [
      "strengths",
      "weaknesses",
      "recommendations",
      "communicationSkills",
      "technicalDepth",
      "nextSteps",
    ];

    arrayProps.forEach((prop) => {
      if (!Array.isArray(analysis[prop])) {
        throw new Error(`${prop} is not an array`);
      }
    });

    // Check if strings are strings
    if (typeof analysis.overallAssessment !== "string") {
      throw new Error("overallAssessment is not a string");
    }
    if (typeof analysis.aiInsights !== "string") {
      throw new Error("aiInsights is not a string");
    }

    // Check for reasonable content
    if (analysis.overallAssessment.trim().length === 0) {
      throw new Error("overallAssessment is empty");
    }
    if (analysis.aiInsights.trim().length === 0) {
      throw new Error("aiInsights is empty");
    }

    console.log(`  ✓ Passed - Analysis generated successfully`);
    console.log(
      `    Overall Assessment: ${analysis.overallAssessment.substring(
        0,
        50
      )}...`
    );
    console.log(`    Strengths: ${analysis.strengths.length} items`);
    console.log(`    Weaknesses: ${analysis.weaknesses.length} items`);
    console.log(
      `    Communication Skills: ${analysis.communicationSkills.length} items`
    );
    console.log(`    Technical Depth: ${analysis.technicalDepth.length} items`);

    passedTests++;
  } catch (error) {
    console.log(`  ✗ Failed - ${error.message}`);
  }

  console.log("");
});

console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed!");
} else {
  console.log("❌ Some tests failed. Please check the implementation.");
}
