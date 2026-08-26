import React from "react";

const SimulationHUD = ({
  timer,
  collectedKeys = { keyA: false, keyB: false, keyC: false },
  currentRoom = 1,
  hintTokens = [false, false, false],
}) => {
  const getRoomName = () => {
    switch (currentRoom) {
      case 1:
        return "Classroom - Aptitude Round";
      case 2:
        return "Coding Lab - Programming Challenge";
      case 3:
        return "Interview Room - Final Assessment";
      default:
        return "Unknown Chamber";
    }
  };

  const formatTime = (time) => {
    if (typeof time === "string") return time;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const KeySlot = ({ label, isCollected, color }) => {
    const colorClasses = {
      A: isCollected
        ? "bg-blue-500 border-blue-400 text-white shadow-blue-500/50 shadow-lg"
        : "bg-gray-800/60 border-gray-600 text-gray-500",
      B: isCollected
        ? "bg-green-500 border-green-400 text-white shadow-green-500/50 shadow-lg"
        : "bg-gray-800/60 border-gray-600 text-gray-500",
      C: isCollected
        ? "bg-purple-500 border-purple-400 text-white shadow-purple-500/50 shadow-lg"
        : "bg-gray-800/60 border-gray-600 text-gray-500",
    };

    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className={`
            w-10 h-10 rounded-full border-2 flex items-center justify-center
            text-sm font-bold transition-all duration-500
            ${colorClasses[label]}
            ${isCollected ? "animate-pulse" : ""}
          `}
        >
          {label}
        </div>
        <span className="text-xs text-gray-400 font-medium">Key {label}</span>
      </div>
    );
  };

  const HintToken = ({ isActive }) => {
    return (
      <div
        className={`
          w-3 h-3 rounded-full transition-all duration-500
          ${
            isActive
              ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] shadow-cyan-400/50 animate-pulse"
              : "bg-gray-700 border border-gray-600"
          }
        `}
      />
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black/60 backdrop-blur-lg border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_30px_rgba(6,182,212,0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-lg border border-slate-700/50">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500/50 flex items-center justify-center">
                    <div
                      className="w-5 h-5 rounded-full border-2 border-cyan-400 animate-spin"
                      style={{ borderTopColor: "transparent" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-cyan-400/70 uppercase tracking-wider font-semibold">
                    Simulation
                  </span>
                  <span className="font-mono text-lg font-bold text-white">
                    {formatTime(timer)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="text-center">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Current Chamber
                </span>
                <div className="text-sm font-bold text-white mt-0.5 truncate px-2">
                  {getRoomName()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 rounded-lg border border-slate-700/50">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Keys
                  </span>
                  <div className="flex items-center gap-2">
                    <KeySlot
                      label="A"
                      isCollected={collectedKeys.keyA}
                      color="blue"
                    />
                    <KeySlot
                      label="B"
                      isCollected={collectedKeys.keyB}
                      color="green"
                    />
                    <KeySlot
                      label="C"
                      isCollected={collectedKeys.keyC}
                      color="purple"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-lg border border-slate-700/50">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Hints
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hintTokens.map((isActive, index) => (
                      <HintToken key={index} isActive={isActive} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationHUD;
