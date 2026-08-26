import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  Code,
  MessageSquare,
} from "lucide-react";

const Report = ({ scores, onClose }) => {
  const { aptitude, coding, interview } = scores;

  const getOverallPerformance = () => {
    const aptitudeScore = aptitude.score || 0;
    const codingScore = coding.passed ? 100 : 0;
    const interviewScore = (interview.score / interview.totalQuestions) * 100;
    const average = (aptitudeScore + codingScore + interviewScore) / 3;

    if (average >= 80)
      return { level: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (average >= 60)
      return { level: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (average >= 40)
      return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-50" };
    return {
      level: "Needs Improvement",
      color: "text-red-600",
      bg: "bg-red-50",
    };
  };

  const getInterviewFeedback = () => {
    const feedback = [];

    // Analyze answer lengths
    const shortAnswers =
      interview.answers?.filter((answer) => answer && answer.length < 50) || [];
    const longAnswers =
      interview.answers?.filter((answer) => answer && answer.length >= 100) ||
      [];

    if (shortAnswers.length > 0) {
      feedback.push({
        type: "improvement",
        message: `${shortAnswers.length} of your answers were quite brief. Interviewers appreciate detailed responses that show depth of thought.`,
      });
    }

    if (longAnswers.length > 0) {
      feedback.push({
        type: "positive",
        message: `Great job providing detailed answers for ${longAnswers.length} questions! This demonstrates thorough thinking.`,
      });
    }

    // Check for specific examples or experiences
    const hasExamples = interview.answers?.some(
      (answer) =>
        answer &&
        (answer.toLowerCase().includes("example") ||
          answer.toLowerCase().includes("experience") ||
          answer.toLowerCase().includes("project") ||
          answer.toLowerCase().includes("worked on"))
    );

    if (!hasExamples) {
      feedback.push({
        type: "improvement",
        message:
          "Consider including specific examples from your experience or projects. Concrete examples make your answers more compelling and memorable.",
      });
    } else {
      feedback.push({
        type: "positive",
        message:
          "Excellent use of specific examples! This shows real-world application of your skills.",
      });
    }

    // Check for enthusiasm and passion
    const showsEnthusiasm = interview.answers?.some(
      (answer) =>
        answer &&
        (answer.toLowerCase().includes("excited") ||
          answer.toLowerCase().includes("passionate") ||
          answer.toLowerCase().includes("love") ||
          answer.toLowerCase().includes("enjoy") ||
          answer.toLowerCase().includes("interested"))
    );

    if (!showsEnthusiasm) {
      feedback.push({
        type: "improvement",
        message:
          "Try to convey enthusiasm and passion for the role and technology. Interviewers want to see genuine interest.",
      });
    } else {
      feedback.push({
        type: "positive",
        message:
          "Your enthusiasm shines through! This is very important for making a positive impression.",
      });
    }

    // Technical depth analysis
    const technicalQuestions = [3, 4, 5, 6, 7]; // Question indices that are technical
    const technicalAnswers = technicalQuestions
      .map((idx) => interview.answers?.[idx])
      .filter(Boolean);
    const detailedTechnical = technicalAnswers.filter(
      (answer) => answer.length > 80
    );

    if (detailedTechnical.length < technicalAnswers.length) {
      feedback.push({
        type: "improvement",
        message:
          "For technical questions, provide more detailed explanations. Show your understanding by explaining concepts thoroughly rather than just defining them.",
      });
    }

    return feedback;
  };

  const overall = getOverallPerformance();
  const interviewFeedback = getInterviewFeedback();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Placement Test Report</h1>
                <p className="text-purple-100">Your performance summary</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Overall Performance
                </h2>
                <div
                  className={`inline-block px-6 py-3 rounded-full text-xl font-bold ${overall.color} ${overall.bg} border-2 border-current`}
                >
                  {overall.level}
                </div>
                <p className="text-gray-600 mt-2">
                  Congratulations on completing all rounds!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Scores */}
        <div className="p-6 space-y-6">
          {/* Aptitude Test */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                Aptitude Test - Classroom Round
                <Badge
                  variant={aptitude.passed ? "default" : "destructive"}
                  className="ml-auto"
                >
                  {aptitude.passed ? "Passed" : "Failed"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {aptitude.score?.toFixed(1)}%
                  </div>
                  <div className="text-gray-600">Score</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {aptitude.correctAnswers}/{aptitude.totalQuestions}
                  </div>
                  <div className="text-gray-600">Correct Answers</div>
                </div>
                <div className="flex items-center">
                  {aptitude.passed ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </div>
              <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Passing Criteria:</strong> 60% or higher
                  {aptitude.passed ? " ✓ Achieved!" : " ✗ Not met"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coding Challenge */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="w-6 h-6 text-green-600" />
                Coding Challenge - Lab Round
                <Badge
                  variant={coding.passed ? "default" : "destructive"}
                  className="ml-auto"
                >
                  {coding.passed ? "Passed" : "Failed"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {coding.passed ? "100%" : "0%"}
                  </div>
                  <div className="text-gray-600">Score</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {coding.passed ? "3/3" : "0/3"}
                  </div>
                  <div className="text-gray-600">Test Cases Passed</div>
                </div>
                <div className="flex items-center">
                  {coding.passed ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </div>
              <div className="mt-4 bg-green-50 p-3 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Language:</strong> {coding.language || "N/A"} |
                  <strong> Challenge:</strong> Factorial Function Implementation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interview */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                HR Interview - Final Round
                <Badge
                  variant={interview.passed ? "default" : "destructive"}
                  className="ml-auto"
                >
                  {interview.passed ? "Passed" : "Failed"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(
                      (interview.score / interview.totalQuestions) * 100
                    )}
                    %
                  </div>
                  <div className="text-gray-600">Score</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {interview.score}/{interview.totalQuestions}
                  </div>
                  <div className="text-gray-600">Good Responses</div>
                </div>
                <div className="flex items-center">
                  {interview.passed ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </div>

              {/* Detailed Interview Feedback */}
              <div className="mt-4 space-y-3">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Detailed Interview Feedback
                  </h4>
                  <div className="space-y-3">
                    {interviewFeedback.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          item.type === "positive"
                            ? "bg-green-50 border border-green-200"
                            : "bg-orange-50 border border-orange-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              item.type === "positive"
                                ? "bg-green-500 text-white"
                                : "bg-orange-500 text-white"
                            }`}
                          >
                            {item.type === "positive" ? "✓" : "!"}
                          </div>
                          <p
                            className={`text-sm ${
                              item.type === "positive"
                                ? "text-green-800"
                                : "text-orange-800"
                            }`}
                          >
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-purple-800 text-sm">
                    <strong>
                      General Tips for Better Interview Performance:
                    </strong>
                  </p>
                  <ul className="text-purple-700 text-sm mt-2 space-y-1">
                    <li>
                      • <strong>Be specific:</strong> Instead of "I have
                      experience," say "In my last project, I optimized database
                      queries reducing load time by 40%."
                    </li>
                    <li>
                      • <strong>Use examples:</strong> Support your claims with
                      concrete examples from your work or studies.
                    </li>
                    <li>
                      • <strong>Show enthusiasm:</strong> Express genuine
                      interest in the role and company.
                    </li>
                    <li>
                      • <strong>Go beyond basics:</strong> For technical
                      questions, explain not just what something is, but why it
                      matters and how you've used it.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-3xl">
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Close Report
            </button>
            <p className="text-gray-600 text-sm mt-3">
              Keep practicing to improve your scores!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
