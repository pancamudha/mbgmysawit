"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4">
      
      {/* PERUBAHAN: Tambahkan -mt-20 agar posisi visual naik ke atas sedikit */}
      <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 -mt-20">
        
        {/* PERUBAHAN: Ukuran gambar diperkecil sedikit (170px/220px) */}
        <div className="relative w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] -mb-4 sm:-mb-5 select-none pointer-events-none">
            <Image 
                src="/404.webp" 
                alt="404" 
                fill
                className="object-contain opacity-90 drop-shadow-2xl"
                priority
            />
        </div>

        {/* Pesan Utama */}
        <div className="space-y-2 mb-6 z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Halaman Tidak Ditemukan
            </h1>
            <p className="text-[#8C8C8C] text-sm sm:text-[15px] font-medium max-w-md mx-auto">
                Halaman yang Anda cari mungkin telah dipindahkan atau sedang dalam perbaikan.
            </p>
        </div>

        {/* Badge Status Development */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#2A2A2E] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs text-[#8C8C8C] font-medium tracking-wide">
                System Under Development
            </span>
        </div>

        {/* Tombol Kembali */}
        <Link 
            href="/" 
            className="text-sm text-[#8C8C8C] hover:text-white transition-colors font-medium flex items-center gap-2 group"
        >
            <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Kembali ke Beranda
        </Link>

      </div>
    </div>
  );
}