// Test script for generateDynamicQuestions function
import { generateDynamicQuestions } from "./gameData.js";

// Test cases for generateDynamicQuestions
const testCases = [
  {
    name: "Frontend Interest",
    interests: {
      frontend: 2,
      backend: 0,
      dataScience: 0,
      machineLearning: 0,
      devops: 0,
      mobile: 0,
      cybersecurity: 0,
      blockchain: 0,
      cloud: 0,
    },
    expectedQuestions: 2, // Should have 2 frontend questions
  },
  {
    name: "Backend Interest",
    interests: {
      frontend: 0,
      backend: 3,
      dataScience: 0,
      machineLearning: 0,
      devops: 0,
      mobile: 0,
      cybersecurity: 0,
      blockchain: 0,
      cloud: 0,
    },
    expectedQuestions: 2, // Should have 2 backend questions
  },
  {
    name: "Data Science Interest",
    interests: {
      frontend: 0,
      backend: 0,
      dataScience: 1,
      machineLearning: 0,
      devops: 0,
      mobile: 0,
      cybersecurity: 0,
      blockchain: 0,
      cloud: 0,
    },
    expectedQuestions: 2, // Should have 2 data science questions
  },
  {
    name: "Multiple Interests",
    interests: {
      frontend: 1,
      backend: 1,
      dataScience: 1,
      machineLearning: 0,
      devops: 0,
      mobile: 0,
      cybersecurity: 0,
      blockchain: 0,
      cloud: 0,
    },
    expectedQuestions: 6, // Should have 2 from each domain
  },
  {
    name: "No Interests",
    interests: {
      frontend: 0,
      backend: 0,
      dataScience: 0,
      machineLearning: 0,
      devops: 0,
      mobile: 0,
      cybersecurity: 0,
      blockchain: 0,
      cloud: 0,
    },
    expectedQuestions: 6, // Should fall back to default questions
  },
];

console.log("Testing generateDynamicQuestions function...\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);

  try {
    const questions = generateDynamicQuestions(testCase.interests);

    // Check if questions array is returned
    if (!Array.isArray(questions)) {
      throw new Error("Function did not return an array");
    }

    // Check if correct number of questions are generated
    if (questions.length !== testCase.expectedQuestions) {
      throw new Error(
        `Expected ${testCase.expectedQuestions} questions, got ${questions.length}`
      );
    }

    // Check if each question has required properties
    questions.forEach((question, qIndex) => {
      if (
        !question.id ||
        !question.question ||
        !question.type ||
        !question.expectedKeywords
      ) {
        throw new Error(
          `Question ${qIndex + 1} is missing required properties`
        );
      }
      if (!Array.isArray(question.expectedKeywords)) {
        throw new Error(
          `Question ${qIndex + 1} expectedKeywords is not an array`
        );
      }
    });

    console.log(`  ✓ Passed - Generated ${questions.length} questions`);
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
