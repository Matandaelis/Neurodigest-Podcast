"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function FavoriteButton({ episode }: { episode: any }) {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  async function handleFavorite() {
    if (!session) {
      toast('Please sign in to favorite episodes');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guid: episode.guid ?? episode.id ?? episode.slug, title: episode.title, enclosure: episode.enclosure, feedUrl: episode.feedUrl ?? null }),
      });
      if (!res.ok) throw new Error('Failed to save favorite');
      toast.success('Saved to favorites');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleFavorite}
      disabled={saving}
      className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
    >
      {saving ? 'Saving...' : '❤ Favorite'}
    </button>
  );
}
