import { TranscribeResponse } from '../types';

export async function transcribeAudio(
  blob: Blob,
  mimeType: string
): Promise<TranscribeResponse> {
  const formData = new FormData();
  const filename = getAudioFilename(mimeType);
  formData.append('audio', blob, filename);

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }

  return response.json();
}

function getAudioFilename(mimeType: string): string {
  const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('mpeg') ? 'mp3' : 'webm';
  return `audio.${ext}`;
}
