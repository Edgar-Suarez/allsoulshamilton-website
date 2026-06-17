'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/shared/contexts/language-context';
import { signOut } from '@/features/auth/services/auth';
import { ContentSection } from '../types';
import { RecorderScreen } from './recorder-screen';

type ScreenState = 'menu' | 'recording';

export function PadreScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('menu');
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push('/login');
    router.refresh();
  }

  function handleSelectSection(section: ContentSection) {
    setSelectedSection(section);
    setScreenState('recording');
  }

  function handleRecorderComplete() {
    setScreenState('menu');
    setSelectedSection(null);
  }

  if (screenState === 'recording' && selectedSection) {
    return (
      <div className="w-full">
        <div className="mb-8 text-center">
          <button
            type="button"
            onClick={handleRecorderComplete}
            className="text-senior-sm text-parish-muted hover:text-parish-navy transition-colors"
          >
            ← {t.voiceCms?.backLabel || 'Volver'}
          </button>
        </div>
        <RecorderScreen
          section={selectedSection}
          onComplete={handleRecorderComplete}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-12">
        <span aria-hidden="true" className="text-parish-gold text-5xl block">
          ✝
        </span>
        <h1 className="text-senior-3xl font-serif font-bold text-parish-navy mt-4">
          {t.voiceCms?.title || 'Grabar contenido'}
        </h1>
        <p className="text-senior-lg text-parish-muted mt-2">
          {t.voiceCms?.subtitle || 'Selecciona qué deseas grabar'}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          type="button"
          onClick={() => handleSelectSection('sermon')}
          className="w-full min-h-[80px] rounded-2xl bg-white border-3 border-parish-navy/20
                     text-senior-2xl font-bold text-parish-navy
                     hover:border-parish-gold hover:bg-parish-cream-light transition-all
                     active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-parish-gold/50"
        >
          🎙 {t.voiceCms?.sermónLabel || 'Sermón'}
        </button>

        <button
          type="button"
          onClick={() => handleSelectSection('quote')}
          className="w-full min-h-[80px] rounded-2xl bg-white border-3 border-parish-navy/20
                     text-senior-2xl font-bold text-parish-navy
                     hover:border-parish-gold hover:bg-parish-cream-light transition-all
                     active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-parish-gold/50"
        >
          ✝ {t.voiceCms?.frasaLabel || 'Frase del día'}
        </button>

        <button
          type="button"
          onClick={() => handleSelectSection('announcement')}
          className="w-full min-h-[80px] rounded-2xl bg-white border-3 border-parish-navy/20
                     text-senior-2xl font-bold text-parish-navy
                     hover:border-parish-gold hover:bg-parish-cream-light transition-all
                     active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-parish-gold/50"
        >
          📢 {t.voiceCms?.avisoLabel || 'Aviso'}
        </button>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="w-full min-h-[56px] rounded-lg border-2 border-parish-navy/30 bg-white
                   text-senior-lg font-bold text-parish-navy
                   hover:bg-parish-cream transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-parish-gold focus:ring-offset-2"
      >
        {t.auth?.signOut || 'Cerrar sesión'}
      </button>
    </div>
  );
}
