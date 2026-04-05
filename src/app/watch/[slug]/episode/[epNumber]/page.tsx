"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import WatchClient from '@/components/Watch/WatchClient';

export default function EpisodePage() {
  const params = useParams();
  
  const slug = params.slug as string;
  const epNumber = params.epNumber as string;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-[10px] pb-8">
      <WatchClient slug={slug} initialEpNumber={epNumber} />
    </div>
  );
}