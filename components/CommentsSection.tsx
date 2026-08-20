"use client";
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CommentsSection({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const { data: comments, mutate } = useSWR(() => `/api/comments?slug=${encodeURIComponent(slug)}`, fetcher);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!comments) return;
  }, [comments]);

  async function postComment() {
    if (!session) {
      toast('Sign in to comment');
      return;
    }
    if (!text.trim()) return;
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, text }),
      });
      if (!res.ok) throw new Error('Failed to post');
      setText('');
      mutate();
      toast.success('Comment posted');
    } catch (err: any) {
      toast.error(err?.message ?? 'Error');
    }
  }

  return (
    <section className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Comments</h4>
      <div className="space-y-3">
        {comments ? (
          comments.map((c: any) => (
            <div key={c.id} className="p-3 border rounded">
              <div className="text-sm text-gray-400">{c.user?.name ?? 'Anonymous'} · {new Date(c.createdAt).toLocaleString()}</div>
              <div className="mt-1">{c.text}</div>
            </div>
          ))
        ) : (
          <div>Loading comments...</div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 rounded bg-slate-800" rows={3} />
        <div className="flex gap-2">
          <button onClick={postComment} className="px-3 py-1 bg-indigo-600 text-white rounded">Post</button>
          {!session && <div className="text-sm text-gray-400">Sign in to join the conversation</div>}
        </div>
      </div>
    </section>
  );
}
