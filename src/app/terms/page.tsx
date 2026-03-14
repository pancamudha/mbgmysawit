"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function TermsPage() {
  const [isIndonesian, setIsIndonesian] = useState(false);

  return (
    <div className="w-full bg-[#0A0A0A] text-[#8C8C8C] pt-10 sm:pt-14 pb-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      <div className="max-w-4xl w-full">
        
        {/* Header & Translate Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2E] mb-8 pb-6 gap-4">
          <h1 className="text-4xl sm:text-[44px] font-bold text-white tracking-tight">
            Terms of Service
          </h1>
          <button 
            onClick={() => setIsIndonesian(!isIndonesian)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1A1A1C] border border-[#2A2A2E] text-xs font-semibold text-white transition-colors w-fit"
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
                Selamat datang di Animaple. Dengan mengakses dan menggunakan website ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di bawah ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Sifat Layanan</h2>
              <p>
                Animaple adalah platform agregator dan mesin pencari berbasis web. Kami tidak menyimpan, mengunggah, atau mengendalikan video, gambar, maupun file media apa pun di server kami. Semua konten didapatkan melalui teknik pengumpulan data otomatis (<i>scraping</i>) dari berbagai sumber publik di internet.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Penggunaan Non-Komersial</h2>
              <p>
                Layanan Animaple disediakan secara gratis semata-mata untuk tujuan hiburan dan informasi personal, non-komersial. Pengguna dilarang keras menjual, mendistribusikan ulang, atau mengeksploitasi layanan situs ini untuk keuntungan komersial tanpa izin tertulis.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Penafian Tanggung Jawab (Disclaimer)</h2>
              <p>
                Karena kami tidak menghosting konten apa pun, Animaple tidak bertanggung jawab atas keakuratan, kepatuhan, hak cipta, legalitas, atau kelayakan konten pihak ketiga yang ditautkan. Pengguna bertanggung jawab penuh atas risiko apa pun saat mengakses tautan pihak ketiga yang tersedia di situs ini.
              </p>
            </>
          ) : (
            // === ENGLISH CONTENT (DEFAULT) ===
            <>
              <p>
                Welcome to Animaple. By accessing and using this website, you are deemed to have read, understood, and agreed to all the terms and conditions below. If you do not agree, please do not use our services.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Nature of Service</h2>
              <p>
                Animaple is a web-based aggregator platform and search engine. We do not store, upload, or control any videos, images, or media files on our servers. All content is obtained through automated data collection techniques (<i>scraping</i>) from various public sources on the internet.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Non-Commercial Use</h2>
              <p>
                Animaple services are provided free of charge solely for personal entertainment and informational purposes, non-commercial use. Users are strictly prohibited from selling, redistributing, or exploiting the services of this site for commercial gain without written permission.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">Disclaimer</h2>
              <p>
                Since we do not host any content, Animaple is not responsible for the accuracy, compliance, copyright, legality, or decency of linked third-party content. Users are fully responsible for any risks when accessing third-party links available on this site.
              </p>
            </>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-[#2A2A2E]/50 flex items-center justify-between">
          <Link href="/" className="text-sm text-[#8C8C8C] hover:text-white transition-colors font-medium">
            &larr; {isIndonesian ? 'Kembali ke Beranda' : 'Back to Home'}
          </Link>
          <Link href="/dmca" className="text-sm text-white hover:underline transition-colors font-medium">
            {isIndonesian ? 'Baca Kebijakan DMCA' : 'Read DMCA Policy'} &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}