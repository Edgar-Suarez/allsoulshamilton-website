import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { z } from 'zod';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function validateRequest(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  if (!cookie.includes('sb-')) {
    return { valid: false, error: 'Unauthorized' };
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return { valid: false, error: 'No audio file provided' };
    }

    const maxSizeBytes = 4 * 1024 * 1024; // 4MB limit
    if (audioFile.size > maxSizeBytes) {
      return { valid: false, error: 'Audio file too large (max 4MB)' };
    }

    return { valid: true, audioFile };
  } catch (error) {
    return { valid: false, error: 'Failed to parse request' };
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const validation = await validateRequest(request);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 401 });
  }

  try {
    const audioFile = validation.audioFile!;
    const buffer = await audioFile.arrayBuffer();
    const blob = new Blob([buffer], { type: audioFile.type });

    const transcription = await client.audio.transcriptions.create({
      file: new File([blob], audioFile.name, { type: audioFile.type }),
      model: 'whisper-1',
      language: 'es',
    });

    return NextResponse.json({ text: (transcription as { text: string }).text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}
