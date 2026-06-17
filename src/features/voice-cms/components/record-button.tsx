'use client';

import { useEffect, useState } from 'react';

interface RecordButtonProps {
  isRecording: boolean;
  onStop: () => Promise<void>;
  sectionLabel: string;
}

export function RecordButton({ isRecording, onStop, sectionLabel }: RecordButtonProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const maxDurationSeconds = 240; // 4 minutos máximo

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= maxDurationSeconds) {
          handleStop();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  async function handleStop() {
    setIsStopping(true);
    try {
      await onStop();
    } finally {
      setIsStopping(false);
      setElapsedTime(0);
    }
  }

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isNearLimit = elapsedTime > maxDurationSeconds - 30;

  return (
    <div className="w-full max-w-md mx-auto text-center py-12">
      <p className="text-senior-lg text-parish-navy mb-4">{sectionLabel}</p>

      <div className="mb-8 p-6 bg-parish-cream rounded-xl">
        <p
          className={`text-senior-3xl font-bold font-mono ${
            isNearLimit ? 'text-red-600 animate-pulse' : 'text-parish-navy'
          }`}
        >
          {timeDisplay}
        </p>
        <p className="text-senior-sm text-parish-muted mt-2">
          {isNearLimit ? '⏰ Límite de tiempo cercano' : '🎤 Grabando...'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleStop}
        disabled={isStopping}
        className="w-full min-h-[80px] rounded-2xl bg-red-600 text-white
                   text-senior-2xl font-bold
                   hover:bg-red-700 transition-colors
                   active:scale-95
                   disabled:opacity-60 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-4 focus:ring-red-600/50"
      >
        {isStopping ? '⏹ Procesando...' : '⏹ Detener'}
      </button>

      <p className="text-senior-xs text-parish-muted mt-4">
        Máximo {Math.round(maxDurationSeconds / 60)} minutos de audio
      </p>
    </div>
  );
}
