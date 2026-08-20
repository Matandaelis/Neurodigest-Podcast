// Server-only helper to call MDCMS REST API.
// Usage: import { getEpisodeBySlug, listEpisodes } from '@/lib/mdcms';

const BASE = process.env.MDCMS_BASE_URL || 'https://api.mdcms.ai';
const API_KEY = process.env.MDCMS_API_KEY;

type RawResponse = any;

async function fetchMDCMS(path: string, opts?: { revalidateSeconds?: number }): Promise<RawResponse> {
  if (!API_KEY) throw new Error('MDCMS_API_KEY not set in environment');
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json',
    },
    ...(opts?.revalidateSeconds ? { next: { revalidate: opts.revalidateSeconds } } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`MDCMS error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Fetch a single episode/post by slug.
 * Adjust the path/query to match your MDCMS project's resource path.
 */
export async function getEpisodeBySlug(slug: string, revalidateSeconds = 60) {
  // Example: replace with the real endpoint your MDCMS instance uses
  // e.g. `/content/episodes?slug=${slug}` or `/episodes/${slug}`
  const path = `/episodes?filter[slug]=${encodeURIComponent(slug)}&limit=1`;
  const data = await fetchMDCMS(path, { revalidateSeconds });
  const item = Array.isArray(data) ? data[0] : data;
  return item ?? null;
}

/** List episodes (pagination-friendly) */
export async function listEpisodes(limit = 20, revalidateSeconds = 60) {
  const path = `/episodes?limit=${limit}`;
  const data = await fetchMDCMS(path, { revalidateSeconds });
  return data ?? [];
}
