"use client";
import React from 'react';
import FavoriteButton from './FavoriteButton';
import CommentsSection from './CommentsSection';

export default function EpisodeCard({ episode, onPlay }: { episode: any; onPlay: (url: string) => void }) {
  const audioUrl = episode.enclosure?.url ?? episode.audioUrl ?? null;
  const slug = episode.slug ?? episode.id ?? episode.guid ?? null;
  return (
    <article className="p-4 border rounded-md bg-white/5 space-y-3">
      <div className="flex gap-4">
        {episode.image && (
          <img src={episode.image} alt={episode.title ?? 'episode artwork'} className="w-24 h-24 object-cover rounded" />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{episode.title}</h3>
          <p className="text-sm text-muted line-clamp-3" dangerouslySetInnerHTML={{ __html: episode.summary ?? '' }} />
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-gray-400">{new Date(episode.isoDate ?? episode.pubDate ?? '').toLocaleString()}</span>
            {audioUrl && (
              <button
                onClick={() => onPlay(audioUrl)}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Play
              </button>
            )}
            <FavoriteButton episode={{ ...episode, feedUrl: episode.feedUrl ?? null }} />
          </div>
        </div>
      </div>

      {slug && <CommentsSection slug={slug} />}
    </article>
  );
}
