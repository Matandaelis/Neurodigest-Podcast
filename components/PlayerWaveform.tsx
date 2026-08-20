"use client";
import React, { useEffect, useRef, useState } from 'react';

type Props = { src: string };

export default function PlayerWaveform({ src }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let WaveSurfer: any;
    let wavesurfer: any;
    let isMounted = true;

    async function init() {
      try {
        WaveSurfer = (await import('wavesurfer.js')).default;
        if (!isMounted || !containerRef.current) return;
        wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#60a5fa',
          progressColor: '#2563eb',
          responsive: true,
          height: 80,
        });
        waveRef.current = wavesurfer;
        wavesurfer.load(src);
        wavesurfer.on('ready', () => setIsReady(true));
      } catch (err) {
        console.error('WaveSurfer init failed', err);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (waveRef.current) waveRef.current.destroy();
    };
  }, [src]);

  return (
    <div>
      <div ref={containerRef} />
      {!isReady && (
        <audio controls src={src} className="w-full mt-2" />
      )}
      {isReady && (
        <div className="mt-2 flex gap-2">
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded"
            onClick={() => waveRef.current && waveRef.current.play()}
          >
            Play
          </button>
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded"
            onClick={() => waveRef.current && waveRef.current.pause()}
          >
            Pause
          </button>
        </div>
      )}
    </div>
  );
}
