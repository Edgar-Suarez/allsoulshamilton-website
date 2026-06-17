import { createClient } from '@/lib/supabase/client';
import { ContentSection, ParishContent } from '../types';

export async function publishContent(
  section: ContentSection,
  content: string
): Promise<ParishContent> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('parish_content')
    .insert({
      section,
      content,
      published: true,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchContentBySection(section: ContentSection, limit = 1) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('parish_content')
    .select('*')
    .eq('section', section)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}
