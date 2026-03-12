"use client";

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import WatchClient from '@/components/Watch/WatchClient';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params.slug as string;
  const initialEp = searchParams.get('ep');

  return (
    // Jarak pt-[20px] dipotong menjadi pt-[10px] agar lebih merapat ke Navbar
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-[10px] pb-10">
      <WatchClient slug={slug} initialEp={initialEp} />
    </div>
  );
}