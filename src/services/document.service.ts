import { supabase } from '@/lib/supabase';
import type { Document, CreateDocumentRequest } from '@/types';

export async function getDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getDocument(id: string, userId: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createDocument(
  userId: string,
  document: CreateDocumentRequest
): Promise<Document> {
  const insertData = {
    user_id: userId,
    title: document.title,
    original_text: document.original_text,
    ambiguity_score: document.ambiguity_score,
    highlights: document.highlights,
    categories: document.categories,
    suggestions: document.suggestions,
    analysis_mode: document.analysis_mode, // 추가!
  };

  const { data, error } = await supabase
    .from('documents')
    .insert(insertData as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function searchDocuments(
  userId: string,
  query: string
): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,original_text.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
