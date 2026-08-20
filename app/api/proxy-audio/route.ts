import { NextRequest } from 'next/server';
import { fetch as nodeFetch } from 'undici';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new Response('Missing url parameter', { status: 400 });

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new Response('Invalid URL protocol', { status: 400 });
    }
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  // Proxy the audio stream
  try {
    const res = await fetch(url);
    if (!res.ok) return new Response('Upstream fetch failed', { status: res.status });

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    });

    return new Response(res.body, { headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? 'error' }), { status: 500 });
  }
}
