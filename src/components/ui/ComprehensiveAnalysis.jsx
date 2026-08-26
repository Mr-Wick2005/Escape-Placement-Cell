import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import {
  Brain,
  Target,
  Code,
  MessageSquare,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  AlertTriangle,
} from "lucide-react";

const ComprehensiveAnalysis = ({ analysis, onClose }) => {
  // Auto-restart game after showing report for failed players
  useEffect(() => {
    if (analysis.completedTests < 3) {
      // Player failed - auto-restart after 5 seconds
      const timer = setTimeout(() => {
        localStorage.removeItem("escapeRoomGameState");
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [analysis.completedTests]);

  const getOverallColor = () => {
    if (analysis.overallScore >= 80) return "green";
    if (analysis.overallScore >= 60) return "blue";
    if (analysis.overallScore >= 40) return "yellow";
    return "red";
  };

  const color = getOverallColor();

  const getColorClasses = (type) => {
    const classes = {
      headerBg:
        color === "green"
          ? "from-green-600 via-green-600 to-green-600"
          : color === "blue"
          ? "from-blue-600 via-blue-600 to-blue-600"
          : color === "yellow"
          ? "from-yellow-600 via-yellow-600 to-yellow-600"
          : "from-red-600 via-red-600 to-red-600",
      headerText:
        color === "green"
          ? "text-green-100"
          : color === "blue"
          ? "text-blue-100"
          : color === "yellow"
          ? "text-yellow-100"
          : "text-red-100",
      border:
        color === "green"
          ? "border-l-green-500"
          : color === "blue"
          ? "border-l-blue-500"
          : color === "yellow"
          ? "border-l-yellow-500"
          : "border-l-red-500",
      icon:
        color === "green"
          ? "text-green-600"
          : color === "blue"
          ? "text-blue-600"
          : color === "yellow"
          ? "text-yellow-600"
          : "text-red-600",
      bg:
        color === "green"
          ? "bg-green-50 border-green-200"
          : color === "blue"
          ? "bg-blue-50 border-blue-200"
          : color === "yellow"
          ? "bg-yellow-50 border-yellow-200"
          : "bg-red-50 border-red-200",
      text:
        color === "green"
          ? "text-green-800"
          : color === "blue"
          ? "text-blue-800"
          : color === "yellow"
          ? "text-yellow-800"
          : "text-red-800",
      button:
        color === "green"
          ? "from-green-600 to-green-600 hover:from-green-700 hover:to-green-700"
          : color === "blue"
          ? "from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700"
          : color === "yellow"
          ? "from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
          : "from-red-600 to-red-600 hover:from-red-700 hover:to-red-700",
    };
    return classes[type];
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${getColorClasses(
            "headerBg"
          )} text-white p-6 rounded-t-3xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Performance Analysis</h1>
                <p className={getColorClasses("headerText")}>
                  Mentor-Style Feedback for Your Growth
                </p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Assessment */}
          <Card className={`border-l-4 ${getColorClasses("border")}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className={`w-6 h-6 ${getColorClasses("icon")}`} />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${getColorClasses("bg")} p-4 rounded-lg border`}>
                <p
                  className={`${getColorClasses(
                    "text"
                  )} text-lg font-medium mb-2`}
                >
                  {analysis.overallAssessment}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Overall Score:</span>
                  <Badge
                    variant={
                      analysis.overallScore >= 60 ? "default" : "destructive"
                    }
                  >
                    {Math.round(analysis.overallScore)}%
                  </Badge>
                  <span className="text-sm text-gray-600">
                    ({analysis.completedTests}/{analysis.totalTests} tests
                    completed)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Breakdown */}
          {analysis.testBreakdown && analysis.testBreakdown.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  Test Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.testBreakdown.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {test.test === "Aptitude Test" && (
                          <Target className="w-5 h-5 text-blue-600" />
                        )}
                        {test.test === "Coding Challenge" && (
                          <Code className="w-5 h-5 text-green-600" />
                        )}
                        {test.test === "Interview" && (
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                        )}
                        <span className="font-medium">{test.test}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {test.score}%
                        </span>
                        <Badge
                          variant={
                            test.status === "Passed" ? "default" : "destructive"
                          }
                        >
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          <Card className={`border-l-4 ${getColorClasses("border")}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className={`w-6 h-6 ${getColorClasses("icon")}`} />
                AI Mentor Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${getColorClasses("bg")} p-4 rounded-lg border`}>
                <p className={getColorClasses("text")}>{analysis.aiInsights}</p>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses && analysis.weaknesses.length > 0 && (
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg border border-orange-200"
                    >
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="text-orange-800">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                    >
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-indigo-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {analysis.nextSteps && analysis.nextSteps.length > 0 && (
            <Card className="border-l-4 border-l-teal-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                  Next Steps for Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-teal-50 p-3 rounded-lg border border-teal-200"
                    >
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-teal-800">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-3xl">
          <div className="text-center">
            {analysis.completedTests < 3 ? (
              <div>
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Game will restart automatically in 5 seconds...
                </div>
                <div className="w-32 h-2 bg-gray-300 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-red-500 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <button
                onClick={onClose}
                className={`bg-gradient-to-r ${getColorClasses(
                  "button"
                )} text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg`}
              >
                Complete Game
              </button>
            )}
            <p className="text-gray-600 text-sm mt-3">
              Remember: Every expert was once a beginner. Keep learning and
              growing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAnalysis;
