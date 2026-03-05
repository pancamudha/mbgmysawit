import React from 'react';

export default function LoadingScreen() {
  return (
    // Tambahkan -mt-20 agar posisi visualnya sedikit naik ke atas (tidak dead-center)
    <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center z-50 -mt-20">
      
      {/* LOGO LOADING ANIMAPLE (IMUT & BERNAPAS) */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 animate-pulse transition-transform duration-1000 ease-in-out">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/loading.webp" 
          alt="Loading..." 
          className="w-full h-full object-contain"
        />
      </div>

      {/* TIGA TITIK MELOMPAT (PUTIH & LEBIH MEPET) */}
      <div className="flex items-center gap-1.5 mt-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>

    </div>
  );
}