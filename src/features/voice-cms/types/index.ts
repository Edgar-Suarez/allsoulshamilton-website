export type ContentSection = 'sermon' | 'quote' | 'announcement';

export interface ParishContent {
  id: string;
  section: ContentSection;
  content: string;
  published: boolean;
  created_by: string;
  created_at: string;
}

export interface TranscribeRequest {
  audio: Blob;
  mimeType: string;
}

export interface TranscribeResponse {
  text: string;
}
