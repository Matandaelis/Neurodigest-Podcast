import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { firestore } from '@/lib/firebaseAdmin';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response('Unauthorized', { status: 401 });
  const uid = session.user.id;
  const favsSnap = await firestore.collection('favorites').where('userId', '==', uid).get();
  const items = favsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  const uid = session.user.id;
  // body: { feedUrl, guid, title, enclosure }
  await firestore.collection('favorites').add({ userId: uid, ...body, createdAt: Date.now() });
  return new Response(JSON.stringify({ ok: true }));
}
