import React from 'react';

const Timer = ({ timeLeft, formattedTime, className = "" }) => {
  const isLowTime = timeLeft <= 60; // Less than 1 minute

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isLowTime ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
      <span className={`font-mono text-lg font-bold ${isLowTime ? 'text-red-400' : 'text-white'}`}>
        {formattedTime}
      </span>
    </div>
  );
};

export default Timer;
