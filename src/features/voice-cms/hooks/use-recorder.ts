'use client';

import { useState, useRef } from 'react';

export function useRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mimeType, setMimeType] = useState<string>('audio/webm');

  const detectMimeType = () => {
    const types = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        setMimeType(type);
        return type;
      }
    }
    // Fallback para iOS Safari
    return 'audio/mp4';
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const detectedMime = detectMimeType();

      const recorder = new MediaRecorder(stream, { mimeType: detectedMime });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recorder:', error);
      throw error;
    }
  };

  const stop = async (): Promise<{ blob: Blob; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        reject(new Error('Recorder not initialized'));
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const stream = recorder.stream;
        stream.getTracks().forEach((track) => track.stop());

        setIsRecording(false);
        resolve({ blob, mimeType });
      };

      recorder.stop();
    });
  };

  return { isRecording, start, stop };
}
