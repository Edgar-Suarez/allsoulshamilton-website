'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/shared/contexts/language-context';
import { ContentSection } from '../types';
import { publishContent } from '../services/content';

interface TranscriptPreviewProps {
  section: ContentSection;
  transcript: string;
  isTranscribing: boolean;
  onRetry: () => void;
  onComplete?: () => void;
}

export function TranscriptPreview({
  section,
  transcript,
  isTranscribing,
  onRetry,
  onComplete,
}: TranscriptPreviewProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [editedText, setEditedText] = useState(transcript);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    if (!editedText.trim()) {
      setError('El texto no puede estar vacío');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      await publishContent(section, editedText);
      router.refresh();
      onComplete?.();
    } catch (err) {
      setError('Error al publicar. Intenta de nuevo.');
    } finally {
      setIsPublishing(false);
    }
  }

  if (isTranscribing) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <div className="animate-pulse">
          <p className="text-senior-lg text-parish-navy mb-4">⏳ Procesando audio...</p>
          <div className="h-32 bg-parish-cream rounded-xl mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <label className="block text-senior-sm font-bold text-parish-navy mb-3">
        {t.voiceCms?.editLabel || 'Edita si es necesario:'}
      </label>

      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="w-full min-h-[160px] p-4 rounded-lg border-2 border-parish-navy/20
                   text-senior-lg text-parish-navy placeholder-parish-muted
                   focus:outline-none focus:ring-2 focus:ring-parish-gold focus:border-transparent
                   resize-none"
        placeholder="Tu texto aquí..."
      />

      {error && (
        <p className="text-senior-sm text-red-600 font-bold mt-3">{error}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onRetry}
          disabled={isPublishing}
          className="flex-1 min-h-[56px] rounded-lg border-2 border-parish-navy/30 bg-white
                     text-senior-lg font-bold text-parish-navy
                     hover:bg-parish-cream-dark transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-parish-gold focus:ring-offset-2"
        >
          {t.voiceCms?.retryLabel || '🔄 Regrabar'}
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing || !editedText.trim()}
          className="flex-1 min-h-[56px] rounded-lg bg-parish-gold text-parish-navy
                     text-senior-lg font-bold
                     hover:bg-parish-gold/90 transition-colors
                     active:scale-95
                     disabled:opacity-60 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-parish-gold focus:ring-offset-2"
        >
          {isPublishing ? '⏳ Publicando...' : t.voiceCms?.publishLabel || '✓ Publicar'}
        </button>
      </div>

      <p className="text-senior-xs text-parish-muted text-center mt-4">
        {t.voiceCms?.previewHint || 'Revisa el texto antes de publicar'}
      </p>
    </div>
  );
}
