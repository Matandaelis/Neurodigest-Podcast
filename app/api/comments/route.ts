import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { firestore } from '@/lib/firebaseAdmin';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return new Response('Missing slug', { status: 400 });

  const snapshot = await firestore.collection('comments')
    .where('slug', '==', slug)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();

  const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { slug, text } = body;
  if (!slug || !text) return new Response('Missing fields', { status: 400 });

  const docRef = await firestore.collection('comments').add({
    slug,
    text,
    user: { id: session.user.id, name: session.user.name, email: session.user.email },
    createdAt: Date.now(),
  });

  const doc = await docRef.get();
  return new Response(JSON.stringify({ id: doc.id, ...doc.data() }), { headers: { 'Content-Type': 'application/json' } });
}
