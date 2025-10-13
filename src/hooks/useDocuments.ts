import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customAxios } from '@/lib/customAxios';
import type { Document, CreateDocumentRequest } from '@/types';

const DOCUMENTS_KEY = ['documents'];

async function fetchDocuments(query?: string): Promise<Document[]> {
  const url = query ? `/api/documents?q=${encodeURIComponent(query)}` : '/api/documents';
  const { data } = await customAxios.get<Document[]>(url);
  return data;
}

async function fetchDocument(id: string): Promise<Document> {
  const { data } = await customAxios.get<Document>(`/api/documents/${id}`);
  return data;
}

async function createDocument(document: CreateDocumentRequest): Promise<Document> {
  const { data } = await customAxios.post<Document>('/api/documents', document);
  return data;
}

async function deleteDocument(id: string): Promise<void> {
  await customAxios.delete(`/api/documents/${id}`);
}

export function useDocuments(searchQuery?: string) {
  return useQuery({
    queryKey: searchQuery ? [...DOCUMENTS_KEY, searchQuery] : DOCUMENTS_KEY,
    queryFn: () => fetchDocuments(searchQuery),
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: [...DOCUMENTS_KEY, id],
    queryFn: () => fetchDocument(id),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}
