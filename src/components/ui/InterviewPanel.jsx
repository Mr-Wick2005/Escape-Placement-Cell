import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Textarea } from "./textarea";
import { Progress } from "./progress";
import {
  firstInterviewQuestion,
  detectInterests,
  generateDynamicQuestions,
  evaluateInterviewAnswers,
  generateInterviewAnalysis,
} from "../../mock/gameData";
import api from "../../lib/api";
import {
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Mic,
  MicOff,
  Loader2,
} from "lucide-react";
import useCountdownTimer from "../../hooks/useCountdownTimer";

const InterviewPanel = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([""]); // Start with one answer for first question
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [dynamicQuestions, setDynamicQuestions] = useState([
    firstInterviewQuestion,
  ]); // Start with first question
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]); // Track Q&A history for AI
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false); // Loading state for AI generation
  const speechAccumulatedRef = useRef("");

  // Use the countdown timer hook for round 3 (20 minutes)
  const {
    timeLeft,
    formattedTime,
    startTimer,
    stopTimer,
    resetTimer,
    isRunning: timerRunning,
  } = useCountdownTimer(1200, "interview-timer", () => {
    // Auto-submit when time runs out
    if (!showResults) {
      handleSubmitInterview();
    }
  });

  // Start timer when interview starts
  useEffect(() => {
    if (interviewStarted && !showResults) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [interviewStarted, showResults, startTimer, stopTimer]);

  // Initialize Speech Recognition with enhanced settings
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();

      // Enhanced configuration for better accuracy
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";
      speechRecognition.maxAlternatives = 3;

      let finalTranscript = "";
      let interimTranscript = "";

      speechRecognition.onstart = () => {
        console.log("Speech recognition started");
      };

      speechRecognition.onresult = (event) => {
        finalTranscript = "";
        interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Accumulate speech text and update the answer
        if (finalTranscript) {
          speechAccumulatedRef.current += finalTranscript;
          const newAnswer = speechAccumulatedRef.current;
          handleAnswerChange(newAnswer);

          // Show feedback to user
          console.log("Speech captured:", finalTranscript);
        }

        // Update interim text for display
        if (interimTranscript) {
          setInterimText(interimTranscript);
        }
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        // Handle different error types
        switch (event.error) {
          case "network":
            alert(
              "Network error occurred during speech recognition. Please check your internet connection."
            );
            break;
          case "not-allowed":
            alert(
              "Microphone access denied. Please allow microphone access and try again."
            );
            break;
          case "no-speech":
            console.log("No speech detected, continuing...");
            break;
          case "audio-capture":
            alert(
              "No microphone was found. Please connect a microphone and try again."
            );
            break;
          default:
            console.warn("Speech recognition error:", event.error);
        }

        setIsListening(false);
      };

      speechRecognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    } else {
      console.warn("Speech Recognition not supported in this browser");
    }
  }, [currentQuestion]); // Removed answers from dependencies to prevent excessive re-initialization

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const generateNextQuestion = async (questionNumber, interests = null) => {
    try {
      setIsGeneratingQuestion(true);

      const data = await api.interviewQuestion({
        conversation_history: conversationHistory,
        question_number: questionNumber,
        interests: interests,
      });

      return {
        id: data.id,
        question: data.question,
        type: data.question_type,
      };
    } catch (error) {
      console.error("Error generating question:", error);
      // Fallback to static questions
      const fallbackInterests = interests || detectInterests([answers[0]]);
      const staticQuestions = generateDynamicQuestions(fallbackInterests);
      const fallbackIndex = (questionNumber - 2) % staticQuestions.length;
      return staticQuestions[fallbackIndex] || staticQuestions[0];
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleNextQuestion = async () => {
    // Stop speech recognition when moving to next question
    if (isListening && recognition) {
      recognition.stop();
    }

    // Reset speech accumulation for new question
    speechAccumulatedRef.current = "";

    // If this is the first question and we haven't generated dynamic questions yet
    if (
      currentQuestion === 0 &&
      !questionsGenerated &&
      answers[0] &&
      answers[0].length > 0
    ) {
      // Add first Q&A to conversation history
      const newHistory = [
        ...conversationHistory,
        {
          question: dynamicQuestions[0].question,
          answer: answers[0],
        },
      ];
      setConversationHistory(newHistory);

      // Detect interests from the first answer
      const interests = detectInterests([answers[0]]);

      // Generate AI-powered questions
      const newQuestions = [dynamicQuestions[0]]; // Keep first question

      // Generate remaining 6 questions using AI
      for (let i = 2; i <= 7; i++) {
        const aiQuestion = await generateNextQuestion(i, interests);
        newQuestions.push(aiQuestion);
      }

      setDynamicQuestions(newQuestions);
      setQuestionsGenerated(true);

      // Expand answers array to match the number of questions
      const expandedAnswers = [...answers];
      while (expandedAnswers.length < newQuestions.length) {
        expandedAnswers.push("");
      }
      setAnswers(expandedAnswers);

      // Move to the next question
      setCurrentQuestion(1);
    } else if (currentQuestion < dynamicQuestions.length - 1) {
      // Add current Q&A to conversation history before moving to next
      if (answers[currentQuestion] && answers[currentQuestion].length > 0) {
        const newHistory = [
          ...conversationHistory,
          {
            question: dynamicQuestions[currentQuestion].question,
            answer: answers[currentQuestion],
          },
        ];
        setConversationHistory(newHistory);
      }

      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    // Stop speech recognition when moving to previous question
    if (isListening && recognition) {
      recognition.stop();
    }

    // Reset speech accumulation for new question
    speechAccumulatedRef.current = "";

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitInterview = async () => {
    // Stop speech recognition before submitting
    if (isListening && recognition) {
      recognition.stop();
    }

    try {
      // Call the AI-powered interview analysis API
      const aiAnalysis = await api.interviewAnalyze({
        answers: answers,
        questions: dynamicQuestions.map((q) => ({
          question: q.question,
          type: q.type,
        })),
      });

      // Get basic evaluation for score/passed status
      const interviewResults = evaluateInterviewAnswers(answers);

      // Combine AI analysis with basic results
      const resultsWithAnswers = {
        ...interviewResults,
        ...aiAnalysis,
        answers: [...answers],
        totalQuestions: dynamicQuestions.length,
      };

      setResults(resultsWithAnswers);
      setShowResults(true);

      setTimeout(() => {
        onComplete(resultsWithAnswers, answers, dynamicQuestions);
      }, 3000);
    } catch (error) {
      console.error("Error getting AI analysis:", error);

      // Fallback to mock analysis if API fails
      const interviewResults = evaluateInterviewAnswers(answers);
      const mockAnalysis = generateInterviewAnalysis(
        interviewResults,
        answers,
        dynamicQuestions
      );

      const resultsWithAnswers = {
        ...interviewResults,
        ...mockAnalysis,
        answers: [...answers],
        totalQuestions: dynamicQuestions.length,
      };

      setResults(resultsWithAnswers);
      setShowResults(true);

      setTimeout(() => {
        onComplete(resultsWithAnswers, answers, dynamicQuestions);
      }, 3000);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognition) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience."
      );
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        alert(
          "Could not start speech recognition. Please ensure your microphone is connected and try again."
        );
      }
    }
  };

  const handleRestartInterview = () => {
    // Reset all interview state
    setCurrentQuestion(0);
    setAnswers([""]);
    setIsListening(false);
    setShowResults(false);
    setResults(null);
    setInterviewStarted(false);
    setRecognition(null);
    setDynamicQuestions([firstInterviewQuestion]);
    setQuestionsGenerated(false);
    setInterimText("");
    setConversationHistory([]);
    setIsGeneratingQuestion(false);
    speechAccumulatedRef.current = "";

    // Reset timer
    resetTimer();
  };

  const renderWelcome = () => (
    <div className="text-center py-8">
      <div className="text-6xl mb-6">👔</div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">
        HR Interview Round
      </h2>
      <Card className="max-w-2xl mx-auto text-left">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">
                  Interview Format
                </h4>
                <p className="text-slate-600">
                  7 questions covering personal and technical topics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">
                  Response Options
                </h4>
                <p className="text-slate-600">
                  Type your answers or use speech-to-text (Chrome recommended)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">
                  Passing Criteria
                </h4>
                <p className="text-slate-600">
                  Answer at least 4 out of 7 questions satisfactorily
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Tip:</strong> Provide detailed, thoughtful answers.
              Include relevant examples and demonstrate your knowledge and
              enthusiasm.
            </p>
          </div>

          {!recognition && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Speech recognition is not available in
                your browser. You can still type your answers manually.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={() => setInterviewStarted(true)}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
      >
        Begin Interview
      </Button>
    </div>
  );

  const renderQuestion = () => {
    const question = dynamicQuestions[currentQuestion];

    return (
      <div className="w-full h-full flex gap-6">
        {/* Left Side: Questions List */}
        <div className="w-1/3 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Interview Questions
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {dynamicQuestions.map((q, index) => (
              <div
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  currentQuestion === index
                    ? "bg-purple-100 border-purple-300 shadow-md"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      answers[index] && answers[index].length > 20
                        ? "bg-green-500 text-white"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {answers[index] && answers[index].length > 20
                      ? "✓"
                      : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 line-clamp-2">
                      {q.question}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          q.type === "personal"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {q.type}
                      </span>
                      {answers[index] && (
                        <span className="text-xs text-slate-500">
                          {answers[index].length} chars
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Progress</div>
            <div className="flex items-center gap-2">
              <Progress
                value={
                  (answers.filter((a) => a && a.length > 20).length /
                    dynamicQuestions.length) *
                  100
                }
                className="flex-1"
              />
              <span className="text-xs text-slate-500">
                {answers.filter((a) => a && a.length > 20).length}/
                {dynamicQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Answer Input */}
        <div className="flex-1 flex flex-col">
          {/* Question Display */}
          <Card className="mb-4 border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  Question {currentQuestion + 1}
                  {isGeneratingQuestion && (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  )}
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      question.type === "personal"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {question.type === "personal" ? "Personal" : "Technical"}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 ${
                      timeLeft <= 60 ? "bg-red-900 border-red-700" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        timeLeft <= 60
                          ? "bg-red-500 animate-pulse"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span
                      className={`font-mono text-lg font-bold ${
                        timeLeft <= 60 ? "text-red-400" : "text-white"
                      }`}
                    >
                      {formattedTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGeneratingQuestion ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-slate-600">
                      Generating personalized question...
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-800 text-lg leading-relaxed">
                  {question.question}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Answer Input */}
          <Card className="flex-1 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Answer</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSpeechRecognition}
                  disabled={!recognition}
                  className={`${
                    isListening
                      ? "bg-red-50 border-red-300 text-red-600"
                      : "bg-gray-50"
                  } ${!recognition ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  {isListening ? "Stop" : "Voice"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Textarea
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Share your thoughts here... (minimum 20 characters for a good response)"
                className="flex-1 resize-none min-h-[200px]"
              />

              <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
                <span>
                  {answers[currentQuestion].length} characters
                  {answers[currentQuestion].length < 20 &&
                    " (minimum 20 recommended)"}
                </span>
                {isListening && (
                  <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">
                      Recording...
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-red-400 rounded animate-pulse"></div>
                      <div
                        className="w-1 h-4 bg-red-500 rounded animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 h-3 bg-red-400 rounded animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {recognition && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-800 text-sm font-semibold mb-2">
                        🎤 Enhanced Voice Input Available
                      </p>
                      <div className="text-blue-700 text-xs space-y-1">
                        <div>
                          • <strong>Click microphone</strong> to start/stop
                          recording
                        </div>
                        <div>
                          • <strong>Speak clearly</strong> at normal pace for
                          best results
                        </div>
                        <div>
                          • <strong>Automatic punctuation</strong> and
                          capitalization
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            isListening ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isListening ? "bg-red-500" : "bg-green-500"
                            }`}
                          ></div>
                          <strong>Status:</strong>{" "}
                          {isListening ? "Listening..." : "Ready to record"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!recognition && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <MicOff className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-yellow-800 text-sm font-semibold mb-1">
                        Speech Recognition Unavailable
                      </p>
                      <p className="text-yellow-700 text-xs">
                        Please use <strong>Chrome, Edge, or Safari</strong> for
                        voice input support. You can still type your answers
                        manually.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={
                (currentQuestion === 0 &&
                  !questionsGenerated &&
                  answers[0].length < 20) ||
                (questionsGenerated &&
                  (currentQuestion === dynamicQuestions.length - 1 ||
                    answers[currentQuestion].length < 20))
              }
            >
              Next
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmitInterview}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
            >
              Submit Interview
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="text-center py-8">
      <div
        className={`text-6xl mb-4 ${
          results.passed ? "text-green-600" : "text-red-600"
        }`}
      >
        {results.passed ? "🎉" : "😞"}
      </div>

      <h2
        className={`text-3xl font-bold mb-4 ${
          results.passed ? "text-green-600" : "text-red-600"
        }`}
      >
        {results.passed ? "Interview Passed!" : "Interview Failed"}
      </h2>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">
                {results.score}/{results.totalQuestions}
              </div>
              <div className="text-slate-600">Questions Answered Well</div>
            </div>

            <div className="border-t pt-4">
              <p className="text-slate-600 text-sm">{results.feedback}</p>
            </div>

            {results.passed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">
                  You earned Key C! 🔑
                </p>
              </div>
            )}

            {!results.passed && (
              <div className="border-t pt-4">
                <p className="text-center text-slate-600 text-sm">
                  Generating comprehensive report...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (showResults) {
    return renderResults();
  }

  if (!interviewStarted) {
    return renderWelcome();
  }

  return renderQuestion();
};

export default InterviewPanel;
