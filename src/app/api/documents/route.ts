import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDocuments, createDocument, searchDocuments } from '@/services/document.service';
import type { CreateDocumentRequest } from '@/types';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    let documents;
    if (query) {
      documents = await searchDocuments(session.user.email, query);
    } else {
      documents = await getDocuments(session.user.email);
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: CreateDocumentRequest = await req.json();

    // Validate required fields
    if (!body.title || !body.original_text || body.ambiguity_score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const document = await createDocument(session.user.email, body);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json(
      { error: 'Failed to create document', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
