import React from "react";
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
} from "lucide-react";

const AIAnalysis = ({ analysis, testType, onClose }) => {
  const getTestIcon = () => {
    switch (testType) {
      case "aptitude":
        return <Target className="w-6 h-6 text-blue-600" />;
      case "coding":
        return <Code className="w-6 h-6 text-green-600" />;
      case "interview":
        return <MessageSquare className="w-6 h-6 text-purple-600" />;
      default:
        return <Brain className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTestColor = () => {
    switch (testType) {
      case "aptitude":
        return "blue";
      case "coding":
        return "green";
      case "interview":
        return "purple";
      default:
        return "gray";
    }
  };

  const getTestTitle = () => {
    switch (testType) {
      case "aptitude":
        return "Aptitude Test AI Analysis";
      case "coding":
        return "Coding Challenge AI Analysis";
      case "interview":
        return "Interview Performance AI Analysis";
      default:
        return "AI Analysis";
    }
  };

  const color = getTestColor();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${color}-600 via-${color}-600 to-${color}-600 text-white p-6 rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTestIcon()}
              <div>
                <h1 className="text-3xl font-bold">{getTestTitle()}</h1>
                <p className="text-${color}-100">AI-Powered Performance Insights</p>
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
          <Card className={`border-l-4 border-l-${color}-500`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-${color}-600" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                <p className={`text-${color}-800 text-lg font-medium`}>
                  {analysis.overallAssessment}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className={`border-l-4 border-l-${color}-500`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-${color}-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                <p className={`text-${color}-800`}>
                  {analysis.aiInsights}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
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
                  <XCircle className="w-6 h-6 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="text-orange-800">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Code Quality (for coding tests) */}
          {analysis.codeQuality && analysis.codeQuality.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code className="w-6 h-6 text-green-600" />
                  Code Quality Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.codeQuality.map((item, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${
                      item.includes('✓') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.includes('✓') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {item.includes('✓') ? '✓' : '✗'}
                      </span>
                      <span className={item.includes('✓') ? 'text-green-800' : 'text-red-800'}>
                        {item.replace(/[✓✗]/g, '').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Communication Skills (for interview) */}
          {analysis.communicationSkills && analysis.communicationSkills.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Communication Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.communicationSkills.map((skill, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="text-blue-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Depth (for interview) */}
          {analysis.technicalDepth && analysis.technicalDepth.length > 0 && (
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Technical Depth Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.technicalDepth.map((depth, index) => (
                    <div key={index} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <span className="text-purple-800">{depth}</span>
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
                    <div key={index} className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
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
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 bg-teal-50 p-3 rounded-lg border border-teal-200">
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
            <button
              onClick={onClose}
              className={`bg-gradient-to-r from-${color}-600 to-${color}-600 text-white px-8 py-3 rounded-xl font-bold hover:from-${color}-700 hover:to-${color}-700 transition-all transform hover:scale-105 shadow-lg`}
            >
              Continue Game
            </button>
            <p className="text-gray-600 text-sm mt-3">
              Use this analysis to improve your performance in future challenges!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
