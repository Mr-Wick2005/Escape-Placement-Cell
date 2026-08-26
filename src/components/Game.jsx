import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ClassroomScene from "./scenes/ClassroomScene";
import CodingLabScene from "./scenes/CodingLabScene";
import InterviewRoomScene from "./scenes/InterviewRoomScene";
import GameUI from "./ui/GameUI";
import Report from "./ui/Report";
import AIAnalysis from "./ui/AIAnalysis";
import ComprehensiveAnalysis from "./ui/ComprehensiveAnalysis";
import {
  generateAptitudeAnalysis,
  generateCodingAnalysis,
  generateInterviewAnalysis,
  generateComprehensiveAnalysis,
} from "../mock/gameData";
import { LogOut } from "lucide-react";

const Game = ({ onSignOut }) => {
  const [currentRoom, setCurrentRoom] = useState(1);
  const [keysCollected, setKeysCollected] = useState({
    keyA: false,
    keyB: false,
    keyC: false,
  });
  const [roomsCompleted, setRoomsCompleted] = useState({
    classroom: false,
    codingLab: false,
    interviewRoom: false,
  });
  const [showUI, setShowUI] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scores, setScores] = useState({
    aptitude: null,
    coding: null,
    interview: null,
  });
  const [showReport, setShowReport] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [showComprehensiveAnalysis, setShowComprehensiveAnalysis] =
    useState(false);
  const [comprehensiveAnalysisData, setComprehensiveAnalysisData] =
    useState(null);
  const [testData, setTestData] = useState({
    aptitude: null,
    coding: null,
    interview: null,
  });
  const [testFailed, setTestFailed] = useState(false);

  useEffect(() => {
    const allKeysCollected =
      keysCollected.keyA && keysCollected.keyB && keysCollected.keyC;
    if (allKeysCollected && !gameCompleted) {
      setTimeout(() => {
        setGameCompleted(true);
      }, 1000);
    }
  }, [keysCollected, gameCompleted]);

  const handleRoomComplete = (roomType) => {
    setRoomsCompleted((prev) => ({ ...prev, [roomType]: true }));

    if (roomType === "classroom") {
      setKeysCollected((prev) => ({ ...prev, keyA: true }));
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentRoom(2);
        setIsTransitioning(false);
      }, 3000);
    } else if (roomType === "codingLab") {
      setKeysCollected((prev) => ({ ...prev, keyB: true }));
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentRoom(3);
        setIsTransitioning(false);
      }, 3000);
    } else if (roomType === "interviewRoom") {
      setKeysCollected((prev) => ({ ...prev, keyC: true }));
    }
  };

  const renderCurrentRoom = () => {
    switch (currentRoom) {
      case 1:
        return (
          <ClassroomScene
            onComplete={() => handleRoomComplete("classroom")}
            onShowUI={(type) => setShowUI(type)}
            completed={roomsCompleted.classroom}
          />
        );
      case 2:
        return (
          <CodingLabScene
            onComplete={() => handleRoomComplete("codingLab")}
            onShowUI={(type) => setShowUI(type)}
            completed={roomsCompleted.codingLab}
          />
        );
      case 3:
        return (
          <InterviewRoomScene
            onComplete={() => handleRoomComplete("interviewRoom")}
            onShowUI={(type) => setShowUI(type)}
            completed={roomsCompleted.interviewRoom}
          />
        );
      default:
        return null;
    }
  };

  const getRoomTheme = () => {
    switch (currentRoom) {
      case 1:
        return "from-blue-900 to-slate-800";
      case 2:
        return "from-gray-900 to-black";
      case 3:
        return "from-purple-900 to-slate-800";
      default:
        return "from-slate-900 to-slate-800";
    }
  };

  const getRoomName = () => {
    switch (currentRoom) {
      case 1:
        return "Classroom - Aptitude Round";
      case 2:
        return "Coding Lab - Programming Challenge";
      case 3:
        return "Interview Room - Final Assessment";
      default:
        return "Unknown Room";
    }
  };

  return (
    <div
      className={`w-full h-screen bg-gradient-to-b ${getRoomTheme()} relative overflow-hidden`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Room transition overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🔑</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Room Completed!
            </h2>
            <p className="text-white/80">Transitioning to next challenge...</p>
            <div className="mt-6 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Game Scene */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={20}
          enableDamping={true}
          dampingFactor={0.05}
        />
        {renderCurrentRoom()}
      </Canvas>

      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {/* Game UI Overlays */}
      <GameUI
        currentRoom={currentRoom}
        keysCollected={keysCollected}
        showUI={showUI}
        onCloseUI={() => setShowUI(null)}
        onRoomComplete={handleRoomComplete}
        onTestComplete={(testType, result, param1, param2, param3) => {
          setScores((prev) => ({ ...prev, [testType]: result }));

          setTestData((prev) => ({
            ...prev,
            [testType]: {
              result,
              param1,
              param2,
              param3,
            },
          }));

          const failed = !result.passed;
          if (failed) {
            setTestFailed(true);
            return;
          }
          const completedTests =
            Object.values(scores).filter((score) => score !== null).length + 1;
          const allCompleted = completedTests === 3;

          if (allCompleted) {
            setTimeout(() => {
              const comprehensiveAnalysis = generateComprehensiveAnalysis(
                scores,
                testData
              );
              setComprehensiveAnalysisData(comprehensiveAnalysis);
              setShowComprehensiveAnalysis(true);
            }, 1000);
          } else {
            setTimeout(() => {
              let analysis = null;
              if (testType === "aptitude") {
                analysis = generateAptitudeAnalysis(result, param1, param2);
              } else if (testType === "coding") {
                analysis = generateCodingAnalysis(result, param2, param1);
              } else if (testType === "interview") {
                analysis = generateInterviewAnalysis(result, param1);
              }

              if (analysis) {
                setAnalysisData(analysis);
                setShowAIAnalysis(testType);
              }
            }, 1000);
          }
        }}
        gameCompleted={gameCompleted}
      />

      {/* Enhanced Keys Display */}
      <div className="absolute top-4 right-24 flex flex-col gap-2 z-10">
        <div className="text-white text-sm font-semibold mb-2">
          Keys Collected
        </div>
        <div className="flex gap-2">
          <KeyDisplay keyName="A" collected={keysCollected.keyA} theme="blue" />
          <KeyDisplay
            keyName="B"
            collected={keysCollected.keyB}
            theme="green"
          />
          <KeyDisplay
            keyName="C"
            collected={keysCollected.keyC}
            theme="purple"
          />
        </div>
      </div>

      {/* Enhanced Room Progress */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl p-4 text-white z-10 border border-white/20">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          Progress
        </h3>

        <div className="space-y-2 text-sm">
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all ${
              currentRoom >= 1
                ? "bg-blue-600/30 text-blue-300"
                : "bg-gray-700/30 text-gray-500"
            }`}
          >
            <span>Room 1: Classroom</span>
            <span>
              {roomsCompleted.classroom ? "✓" : currentRoom === 1 ? "⏳" : "○"}
            </span>
          </div>
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all ${
              currentRoom >= 2
                ? "bg-green-600/30 text-green-300"
                : "bg-gray-700/30 text-gray-500"
            }`}
          >
            <span>Room 2: Coding Lab</span>
            <span>
              {roomsCompleted.codingLab ? "✓" : currentRoom === 2 ? "⏳" : "○"}
            </span>
          </div>
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all ${
              currentRoom >= 3
                ? "bg-purple-600/30 text-purple-300"
                : "bg-gray-700/30 text-gray-500"
            }`}
          >
            <span>Room 3: Interview</span>
            <span>
              {roomsCompleted.interviewRoom
                ? "✓"
                : currentRoom === 3
                ? "⏳"
                : "○"}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="text-xs text-white/70 mb-1">Current Location</div>
          <div className="font-semibold">{getRoomName()}</div>
        </div>

        {/* Debug buttons for testing */}
        {!roomsCompleted.classroom && currentRoom === 1 && (
          <button
            onClick={() => setShowUI("aptitude")}
            className="mt-3 w-full text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
          >
            🎯 Test Aptitude
          </button>
        )}
        {!roomsCompleted.codingLab && currentRoom === 2 && (
          <button
            onClick={() => setShowUI("coding")}
            className="mt-3 w-full text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
          >
            💻 Test Coding
          </button>
        )}
        {!roomsCompleted.interviewRoom && currentRoom === 3 && (
          <button
            onClick={() => setShowUI("interview")}
            className="mt-3 w-full text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors"
          >
            🎤 Test Interview
          </button>
        )}
      </div>

      {/* Report Modal */}
      {showReport && (
        <Report scores={scores} onClose={() => setShowReport(false)} />
      )}

      {/* Enhanced Game Completion Modal */}
      {gameCompleted && !showReport && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl text-center max-w-lg mx-4 shadow-2xl border-4 border-yellow-300 animate-pulse">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              CONGRATULATIONS!
            </h2>
            <p className="text-white/95 mb-6 text-lg font-medium">
              You have successfully escaped the Placement Cell!
              <br />
              All challenges completed with excellence.
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {["A", "B", "C"].map((key, index) => (
                <div
                  key={key}
                  className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center text-2xl font-bold text-yellow-800 shadow-lg animate-bounce"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {key}
                </div>
              ))}
            </div>

            <div className="text-white/90 mb-6">
              🏆 <strong>Achievement Unlocked:</strong> Placement Cell Escapee
              <br />⭐ Score: Perfect Performance
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReport(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                📊 View Report
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAIAnalysis && analysisData && (
        <AIAnalysis
          analysis={analysisData}
          testType={showAIAnalysis}
          onClose={() => {
            setShowAIAnalysis(null);
            setAnalysisData(null);
          }}
        />
      )}

      {/* Comprehensive Analysis Modal */}
      {showComprehensiveAnalysis && comprehensiveAnalysisData && (
        <ComprehensiveAnalysis
          analysis={comprehensiveAnalysisData}
          onClose={() => {
            setShowComprehensiveAnalysis(false);
            setComprehensiveAnalysisData(null);
            if (comprehensiveAnalysisData.completedTests < 3) {
              window.location.reload();
            }
          }}
        />
      )}

      {/* Test Failed Modal */}
      {testFailed && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-400 via-red-500 to-red-600 p-8 rounded-3xl text-center max-w-lg mx-4 shadow-2xl border-4 border-red-300 animate-pulse">
            <div className="text-8xl mb-6">❌</div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              TEST FAILED!
            </h2>
            <p className="text-white/95 mb-6 text-lg font-medium">
              You didn't pass the test. Better luck next time!
              <br />
              Returning to the classroom to try again.
            </p>

            <button
              onClick={() => {
                setCurrentRoom(1);
                setKeysCollected({
                  keyA: false,
                  keyB: false,
                  keyC: false,
                });
                setRoomsCompleted({
                  classroom: false,
                  codingLab: false,
                  interviewRoom: false,
                });
                setScores({
                  aptitude: null,
                  coding: null,
                  interview: null,
                });
                setTestFailed(false);
                setShowUI(null);
                setGameCompleted(false);
                setShowReport(false);
                setShowAIAnalysis(null);
                setAnalysisData(null);
                setShowComprehensiveAnalysis(false);
                setComprehensiveAnalysisData(null);
                setTestData({
                  aptitude: null,
                  coding: null,
                  interview: null,
                });
              }}
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const KeyDisplay = ({ keyName, collected, theme }) => {
  const getThemeColors = () => {
    switch (theme) {
      case "blue":
        return collected
          ? "bg-blue-500 border-blue-400 text-white shadow-blue-500/50"
          : "bg-gray-700 border-gray-600 text-gray-400";
      case "green":
        return collected
          ? "bg-green-500 border-green-400 text-white shadow-green-500/50"
          : "bg-gray-700 border-gray-600 text-gray-400";
      case "purple":
        return collected
          ? "bg-purple-500 border-purple-400 text-white shadow-purple-500/50"
          : "bg-gray-700 border-gray-600 text-gray-400";
      default:
        return "bg-gray-700 border-gray-600 text-gray-400";
    }
  };

  return (
    <div
      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-500 ${getThemeColors()} ${
        collected ? "animate-pulse shadow-lg" : ""
      }`}
    >
      {keyName}
    </div>
  );
};

export default Game;
