import React, { useState } from "react";
import AptitudeTest from "./AptitudeTest";
import CodingChallenge from "./CodingChallenge";
import InterviewPanel from "./InterviewPanel";
import { X } from "lucide-react";

const GameUI = ({
  currentRoom,
  keysCollected,
  showUI,
  onCloseUI,
  onRoomComplete,
  onTestComplete,
  gameCompleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestComplete = async (testType, result, questions, answers) => {
    setIsLoading(true);

    // Store the score
    onTestComplete(testType, result, questions, answers);

    // Simulate processing time with animation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (result.passed) {
      let roomType;
      switch (testType) {
        case "aptitude":
          roomType = "classroom";
          break;
        case "coding":
          roomType = "codingLab";
          break;
        case "interview":
          roomType = "interviewRoom";
          break;
        default:
          return;
      }

      onRoomComplete(roomType);
    }

    setIsLoading(false);
    onCloseUI();
  };

  if (!showUI) return null;

  return (
    <div className="absolute inset-0 z-40">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCloseUI}
      />

      {/* Main UI Panel */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-white flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {showUI === "aptitude" && "Aptitude Test"}
              {showUI === "coding" && "Coding Challenge"}
              {showUI === "interview" && "HR Interview"}
            </h2>
            <button
              onClick={onCloseUI}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <LoadingScreen testType={showUI} />
            ) : (
              <>
                {showUI === "aptitude" && (
                  <AptitudeTest
                    onComplete={(result) =>
                      handleTestComplete("aptitude", result)
                    }
                  />
                )}
                {showUI === "coding" && (
                  <CodingChallenge
                    onComplete={(result) =>
                      handleTestComplete("coding", result)
                    }
                  />
                )}
                {showUI === "interview" && (
                  <InterviewPanel
                    onComplete={(result) =>
                      handleTestComplete("interview", result)
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = ({ testType }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative mb-8">
      {/* Rotating Key Animation */}
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin">
        <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-yellow-800">🔑</span>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
    </div>

    <h3 className="text-2xl font-bold text-slate-800 mb-4">
      Analyzing Your Performance...
    </h3>

    <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
        style={{ width: "75%" }}
      />
    </div>

    <p className="text-slate-600 text-center">
      {testType === "aptitude" && "Evaluating your aptitude test answers..."}
      {testType === "coding" && "Running your code against test cases..."}
      {testType === "interview" && "Analyzing your interview responses..."}
    </p>
  </div>
);

export default GameUI;
