import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook de temporizador
 * @param {Object} options
 * @param {number} options.initialTime - tiempo inicial en segundos
 * @param {boolean} options.countdown - true = cuenta regresiva, false = cronómetro
 * @param {boolean} options.autoStart - iniciar automáticamente
 * @param {Function} options.onEnd - callback cuando llega a 0 (solo countdown)
 */
export function useTimer({
  initialTime = 0,
  countdown = false,
  autoStart = false,
  onEnd = null,
} = {}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);

  const intervalRef = useRef(null);

  // Formatear tiempo (mm:ss)
  const formatTime = useCallback(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [time]);

  // Iniciar
  const start = useCallback(() => {
    if (!intervalRef.current) {
      setIsRunning(true);
    }
  }, []);

  // Pausar
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Resetear
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  // Lógica del temporizador
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (countdown) {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setIsRunning(false);
              if (onEnd) onEnd();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, countdown, onEnd]);

  return {
    time,              // tiempo en segundos
    formatted: formatTime(), // mm:ss
    isRunning,
    start,
    pause,
    reset,
  };
}