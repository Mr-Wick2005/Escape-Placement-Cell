import { useState, useEffect, useCallback, useRef } from 'react';

const useCountdownTimer = (initialTimeInSeconds, storageKey, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const savedTime = parseInt(saved, 10);
      return savedTime > 0 ? savedTime : initialTimeInSeconds;
    }
    return initialTimeInSeconds;
  });

  const intervalRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Update the callback ref when it changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return; // Already running

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;

        // Save to localStorage every second
        localStorage.setItem(storageKey, newTime.toString());

        if (newTime <= 0) {
          // Time's up!
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          localStorage.removeItem(storageKey); // Clean up storage

          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);
  }, [storageKey]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(initialTimeInSeconds);
    localStorage.removeItem(storageKey);
  }, [initialTimeInSeconds, storageKey, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    startTimer,
    stopTimer,
    resetTimer,
    isRunning: intervalRef.current !== null
  };
};

export default useCountdownTimer;
