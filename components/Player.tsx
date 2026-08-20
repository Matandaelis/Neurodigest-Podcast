"use client";
import React from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function Player({ src }: { src?: string | null }) {
  if (!src) return null;
  return <H5AudioPlayer autoPlay src={src} />;
}
