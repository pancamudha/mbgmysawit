"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DonatePage() {
  const [isIndonesian, setIsIndonesian] = useState(false);

  return (
    <div className="w-full bg-[#0A0A0A] text-[#8C8C8C] pt-10 sm:pt-14 pb-10 px-4 sm:px-6 lg:px-8 flex justify-center min-h-screen">
      
      <div className="max-w-4xl w-full">
        
        {/* Header & Translate Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2E] mb-8 pb-6 gap-4">
          <h1 className="text-4xl sm:text-[44px] font-bold text-white tracking-tight">
            Support & Donate
          </h1>
          <button 
            onClick={() => setIsIndonesian(!isIndonesian)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f0f0f] hover:bg-[#1A1A1C] border border-[#2A2A2E] text-xs font-semibold text-white transition-colors w-fit shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            {isIndonesian ? 'Switch to English' : 'Translate to Indonesia'}
          </button>
        </div>

        <div className="space-y-6 text-[14px] sm:text-[15px] leading-relaxed">
          {isIndonesian ? (
            // === INDONESIAN CONTENT ===
            <>
              <p>
                Animaple dibangun dengan dedikasi untuk menyediakan platform streaming anime yang cepat, berkualitas tinggi, dan sepenuhnya bebas iklan (<i>ad-free</i>). Kami percaya pengalaman menonton yang nyaman adalah hak setiap penggemar anime.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Mengapa Kami Membutuhkan Dukungan Anda?</h2>
              <p>
                Menjalankan platform tanpa iklan berarti kami tidak memiliki pemasukan dari pop-up atau banner yang mengganggu. Namun, biaya untuk pemeliharaan server, domain, dan infrastruktur sinkronisasi data terus berjalan setiap bulannya. Dukungan finansial sekecil apa pun dari Anda akan langsung digunakan untuk memastikan Animaple tetap hidup dan terus berkembang.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-6">Pilih Platform Donasi</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Saweria */}
                <a 
                  href="https://saweria.co/ofikur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-[#2A2A2E] hover:border-amber-500/50 hover:bg-[#1A1A1C] transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 group-hover:scale-110 transition-transform p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/saweria.webp" alt="Saweria Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Saweria</h3>
                    <p className="text-xs text-[#8C8C8C]">GoPay, OVO, Dana, LinkAja</p>
                  </div>
                </a>

                {/* Trakteer */}
                <a 
                  href="https://trakteer.id/ofikur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-[#2A2A2E] hover:border-rose-500/50 hover:bg-[#1A1A1C] transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 group-hover:scale-110 transition-transform p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/trakteer.webp" alt="Trakteer Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Trakteer</h3>
                    <p className="text-xs text-[#8C8C8C]">Dukung kreator lokal</p>
                  </div>
                </a>
              </div>

              {/* Box QRIS Besar */}
              <div className="mt-8 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0f0f0f] border border-[#2A2A2E] hover:border-emerald-500/50 transition-colors w-full">
                <h3 className="text-white font-bold text-lg mb-2">Scan QRIS</h3>
                <p className="text-sm text-[#8C8C8C] mb-6 text-center max-w-md">
                  Gunakan aplikasi m-Banking atau e-Wallet apa saja (GoPay, OVO, Dana, ShopeePay, LinkAja, BCA, dll).
                </p>
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/qris.webp" 
                    alt="QR Code QRIS" 
                    className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] object-contain" 
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-[#8C8C8C]">
                Terima kasih telah menjadi bagian dari perjalanan Animaple. Dukungan Anda sangat berarti bagi kami!
              </p>
            </>
          ) : (
            // === ENGLISH CONTENT (DEFAULT) ===
            <>
              <p>
                Animaple is built with a dedication to providing a fast, high-quality, and completely ad-free anime streaming platform. We believe a comfortable viewing experience is the right of every anime fan.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Why Do We Need Your Support?</h2>
              <p>
                Running an ad-free platform means we do not have income from annoying pop-ups or banners. However, the costs for server maintenance, domains, and data synchronization infrastructure continue to run every month. Even the smallest financial support from you will be used directly to ensure Animaple stays alive and continues to grow.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-6">Choose a Donation Platform</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ko-fi */}
                <a 
                  href="https://ko-fi.com/ofikur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-[#2A2A2E] hover:border-sky-500/50 hover:bg-[#1A1A1C] transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 group-hover:scale-110 transition-transform p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/kofi.webp" alt="Ko-fi Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Ko-fi</h3>
                    <p className="text-xs text-[#8C8C8C]">Buy us a coffee</p>
                  </div>
                </a>

                {/* PayPal */}
                <a 
                  href="https://paypal.me/ofikur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-[#2A2A2E] hover:border-blue-500/50 hover:bg-[#1A1A1C] transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 group-hover:scale-110 transition-transform p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/paypal.webp" alt="PayPal Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">PayPal</h3>
                    <p className="text-xs text-[#8C8C8C]">International support</p>
                  </div>
                </a>
              </div>

              {/* Large QRIS Box for English (Cross-Border) */}
              <div className="mt-8 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0f0f0f] border border-[#2A2A2E] hover:border-emerald-500/50 transition-colors w-full">
                <h3 className="text-white font-bold text-lg mb-2">Scan QRIS (Cross-Border)</h3>
                <p className="text-sm text-[#8C8C8C] mb-6 text-center max-w-md">
                  Supported for users with compatible banking apps in Indonesia, Singapore, Malaysia, and Thailand.
                </p>
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/qris.webp" 
                    alt="QR Code QRIS" 
                    className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] object-contain" 
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-[#8C8C8C]">
                Thank you for being part of the Animaple journey. Your support means the world to us!
              </p>
            </>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-[#2A2A2E]/50 flex items-center justify-between">
          <Link href="/" className="text-sm text-[#8C8C8C] hover:text-white transition-colors font-medium">
            &larr; {isIndonesian ? 'Kembali ke Beranda' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </div>
  );
}