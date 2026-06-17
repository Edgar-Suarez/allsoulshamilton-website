'use client';

import { useState } from 'react';
import { useLanguage } from '@/shared/contexts/language-context';
import { ContentSection } from '../types';
import { RecordButton } from './record-button';
import { TranscriptPreview } from './transcript-preview';
import { useRecorder } from '../hooks/use-recorder';
import { transcribeAudio } from '../services/transcribe';

interface RecorderScreenProps {
  section: ContentSection;
  onComplete?: () => void;
}

type Stage = 'selecting' | 'recording' | 'preview';

export function RecorderScreen({ section, onComplete }: RecorderScreenProps) {
  const { t } = useLanguage();
  const { isRecording, start, stop } = useRecorder();
  const [stage, setStage] = useState<Stage>('selecting');
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionLabels: Record<ContentSection, string> = {
    sermon: t.voiceCms?.sermónLabel || '🎙 Sermón',
    quote: t.voiceCms?.frasaLabel || '✝ Frase del día',
    announcement: t.voiceCms?.avisoLabel || '📢 Aviso',
  };

  async function handleStartRecording() {
    try {
      setError(null);
      await start();
      setStage('recording');
    } catch (err) {
      setError('No se pudo acceder al micrófono');
    }
  }

  async function handleStopRecording() {
    try {
      setError(null);
      const { blob, mimeType } = await stop();
      setIsTranscribing(true);

      const response = await transcribeAudio(blob, mimeType);
      setTranscript(response.text);
      setStage('preview');
    } catch (err) {
      setError('Error al transcribir. Intenta de nuevo.');
    } finally {
      setIsTranscribing(false);
    }
  }

  function handleRetry() {
    setTranscript('');
    setStage('selecting');
    onComplete?.();
  }

  if (stage === 'selecting') {
    return (
      <div className="w-full max-w-md mx-auto">
        <p className="text-center text-senior-lg text-parish-navy mb-8">
          {t.voiceCms?.selectLabel || 'Selecciona qué grabar:'}
        </p>
        <p className="text-center text-senior-sm text-parish-muted mb-6">
          {sectionLabels[section]}
        </p>
        <button
          type="button"
          onClick={handleStartRecording}
          className="w-full min-h-[80px] rounded-2xl bg-parish-gold text-parish-navy
                     text-senior-2xl font-bold
                     hover:bg-parish-gold/90 transition-colors
                     active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-parish-gold/50"
        >
          {t.voiceCms?.startLabel || '🎙 Empezar a grabar'}
        </button>
      </div>
    );
  }

  if (stage === 'recording') {
    return (
      <RecordButton
        isRecording={isRecording}
        onStop={handleStopRecording}
        sectionLabel={sectionLabels[section]}
      />
    );
  }

  return (
    <TranscriptPreview
      section={section}
      transcript={transcript}
      isTranscribing={isTranscribing}
      onRetry={handleRetry}
      onComplete={onComplete}
    />
  );
}
