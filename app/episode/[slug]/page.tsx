import type { Metadata } from 'next';
import { getEpisodeBySlug } from '@/lib/mdcms';
import { markdownToSafeHtml, sanitizeHtml } from '@/lib/markdownServer';
import PlayerWaveform from '@/components/PlayerWaveform';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getEpisodeBySlug(params.slug, 60);
  if (!post) return { title: 'Episode' };
  return {
    title: post.title,
    description: post.excerpt ?? post.summary ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  } as any;
}

export default async function EpisodePage({ params }: Props) {
  const post = await getEpisodeBySlug(params.slug, 60);

  if (!post) {
    return <p className="p-8 text-center">Episode not found</p>;
  }

  const rawHtml: string =
    post.html || (post.content ? markdownToSafeHtml(post.content) : post.body ? markdownToSafeHtml(post.body) : '');

  const safeHtml = post.html ? sanitizeHtml(post.html) : rawHtml;
  const audioUrl = post.enclosure?.url ?? post.audioUrl ?? null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-muted mb-6">{new Date(post.publishedAt ?? post.date).toLocaleString()}</p>

      {post.image && <img src={post.image} alt={post.title ?? 'Episode artwork'} className="w-full rounded-lg mb-6" />}

      <article className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: safeHtml }} />

      {audioUrl && (
        <div className="mt-6">
          {/* PlayerWaveform is a client component that renders waveform + controls */}
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <PlayerWaveform src={audioUrl} />
        </div>
      )}
    </main>
  );
}
