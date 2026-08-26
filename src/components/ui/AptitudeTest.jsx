import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import Timer from './Timer';
import api from '../../lib/api';

const AptitudeTest = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    timeLeft,
    formattedTime,
    startTimer,
    stopTimer,
    resetTimer,
    isRunning
  } = useCountdownTimer(600, 'aptitude-timer', () => {
    if (!showResults && !loading) {
      handleSubmit();
    }
  });

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.aptitudeStart();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  useEffect(() => {
    if (currentPage === 2 && !showResults) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [currentPage, showResults, startTimer, stopTimer]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const answerArray = questions.map((_, index) => answers[index] ?? -1);
      const testResults = await api.aptitudeSubmit({
        answers: answerArray,
      });

      const adaptedResults = {
        score: testResults.score,
        correctAnswers: testResults.correctCount,
        totalQuestions: testResults.totalQuestions,
        passed: testResults.passed,
        keyAwarded: testResults.keyAwarded,
      };

      setResults(adaptedResults);
      setShowResults(true);
      stopTimer();

      setTimeout(() => {
        onComplete(adaptedResults, questions, Object.values(answers));
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (answers[index] !== undefined) return 'answered';
    return 'not-answered';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const renderWelcomePage = () => (
    <div className="text-center py-16">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Welcome to the Aptitude Test</h2>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Instructions:</strong>
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>You will have 10 minutes to complete 10 questions</li>
              <li>Each question has multiple choice answers</li>
              <li>You can navigate between questions freely</li>
              <li>You need to score at least 60% to pass</li>
              <li>The test will auto-submit when time runs out</li>
            </ul>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <Button
        onClick={() => setCurrentPage(1)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        disabled={loading || questions.length === 0}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Start Test
      </Button>
    </div>
  );

  const renderInstructionsPage = () => (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Test Instructions</h2>
      <Card className="text-left max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">Time Limit</h4>
                <p className="text-slate-600">10 minutes for 10 questions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">Navigation</h4>
                <p className="text-slate-600">You can jump to any question using the question panel</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">Auto-Submit</h4>
                <p className="text-slate-600">Test will automatically submit when time expires</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={() => setCurrentPage(2)}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
      >
        Begin Questions
      </Button>
    </div>
  );

  const renderTestInterface = () => {
    const question = questions[currentQuestionIndex];

    if (!question) return null;

    return (
      <div className="h-full flex">
        {/* Left Side - Question Display */}
        <div className="flex-1 flex flex-col p-6">
          {/* Question Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Question {currentQuestionIndex + 1}</h2>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Question Content */}
          <Card className="flex-1">
            <CardContent className="p-6">
              <p className="text-slate-800 mb-8 text-lg leading-relaxed">{question.question}</p>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Test
            </Button>
          </div>
        </div>

        {/* Right Side - Question Navigation and Timer */}
        <div className="w-80 bg-slate-50 border-l border-slate-200 p-6 flex flex-col">
          {/* Timer */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-600' : 'text-slate-600'}`} />
              <span className={`font-mono text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-center text-sm text-slate-600">Time Remaining</div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="text-center mb-2">
              <span className="text-lg font-semibold text-slate-800">
                {getAnsweredCount()}/{questions.length}
              </span>
              <span className="text-sm text-slate-600 ml-1">Questions Answered</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Grid */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                    currentQuestionIndex === index
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : getQuestionStatus(index) === 'answered'
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-300 bg-white rounded"></div>
              <span className="text-slate-600">Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded"></div>
              <span className="text-slate-600">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 bg-blue-100 rounded"></div>
              <span className="text-slate-600">Current</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="text-center py-8">
      <div className={`text-6xl mb-4 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
        {results.passed ? '🎉' : '😞'}
      </div>

      <h2 className={`text-3xl font-bold mb-4 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
        {results.passed ? 'Congratulations!' : 'Test Failed'}
      </h2>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">{results.score}%</div>
              <div className="text-slate-600">Your Score</div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Correct Answers:</span>
                <span className="font-semibold">{results.correctAnswers}/{results.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Passing Score:</span>
                <span className="font-semibold">60%</span>
              </div>
            </div>

            {results.passed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">You earned Key A! 🔑</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading aptitude questions...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return renderResults();
  }

  if (currentPage === 0) {
    return renderWelcomePage();
  }

  if (currentPage === 1) {
    return renderInstructionsPage();
  }

  return renderTestInterface();
};

export default AptitudeTest;
