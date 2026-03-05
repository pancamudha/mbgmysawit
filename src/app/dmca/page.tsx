"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DMCAPage() {
  const [isIndonesian, setIsIndonesian] = useState(false);

  return (
    <div className="w-full bg-[#0A0A0A] text-[#8C8C8C] pt-10 sm:pt-14 pb-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      <div className="max-w-4xl w-full">
        
        {/* Header & Translate Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2E] mb-8 pb-6 gap-4">
          <h1 className="text-4xl sm:text-[44px] font-bold text-white tracking-tight leading-tight">
            DMCA Takedown Request
          </h1>
          <button 
            onClick={() => setIsIndonesian(!isIndonesian)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1A1A1C] border border-[#2A2A2E] text-xs font-semibold text-white transition-colors w-fit shrink-0"
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
                Kami sangat menghormati hak kekayaan intelektual orang lain dan mewajibkan Pengguna kami untuk melakukan hal yang sama. Digital Millennium Copyright Act (DMCA) menetapkan proses untuk menangani klaim pelanggaran hak cipta. Jika Anda memiliki hak cipta atau memiliki wewenang untuk bertindak atas nama pemilik hak cipta dan ingin melaporkan klaim bahwa pihak ketiga melanggar materi tersebut pada atau melalui layanan Animaple, silakan kirimkan laporan DMCA ke email kami, dan kami akan mengambil tindakan yang sesuai.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">
                DMCA Report Requirements
              </h2>
              
              <ul className="list-disc pl-5 space-y-4 text-[#8C8C8C]">
                <li>Deskripsi karya berhak cipta yang Anda klaim telah dilanggar;</li>
                <li>Deskripsi materi yang Anda klaim melanggar dan yang ingin Anda hapus atau aksesnya ingin Anda nonaktifkan beserta URL atau lokasi lain dari materi tersebut;</li>
                <li>Nama, jabatan (jika bertindak sebagai agen), alamat, nomor telepon, dan alamat email Anda;</li>
                <li>Pernyataan berikut: "Saya memiliki itikad baik bahwa penggunaan materi berhak cipta yang saya keluhkan tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum (misalnya, sebagai penggunaan wajar)";</li>
                <li>Pernyataan berikut: "Informasi dalam pemberitahuan ini adalah akurat dan, di bawah sumpah, saya adalah pemilik, atau berwenang untuk bertindak atas nama pemilik, dari hak cipta atau hak eksklusif yang diduga dilanggar";</li>
              </ul>
            </>
          ) : (
            // === ENGLISH CONTENT (DEFAULT) ===
            <>
              <p>
                We respect the intellectual property rights of others and require our Users to do the same. The Digital Millennium Copyright Act (DMCA) establishes a process for addressing claims of copyright infringement. If you own a copyright or have authority to act on behalf of a copyright owner and want to report a claim that a third party is infringing that material on or through Animaple's services, please submit a DMCA report to our email, and we will take appropriate action.
              </p>

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-10 mb-4">
                DMCA Report Requirements
              </h2>
              
              <ul className="list-disc pl-5 space-y-4 text-[#8C8C8C]">
                <li>A description of the copyrighted work that you claim is being infringed;</li>
                <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled and the URL or other location of that material;</li>
                <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
                <li>The following statement: "I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)";</li>
                <li>The following statement: "The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed";</li>
              </ul>
            </>
          )}

          <p className="mt-8">
            {isIndonesian ? 'Kirimkan laporan Anda beserta semua informasi di atas ke email kami:' : 'Submit your report along with all the information above to our email:'} <br/>
            <a href="mailto:animaplexyz@gmail.com" className="text-white font-bold hover:underline mt-2 inline-block transition-all">
              animaplexyz@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-[#2A2A2E]/50 flex items-center gap-6">
          <Link href="/" className="text-sm text-[#8C8C8C] hover:text-white transition-colors font-medium">
            &larr; {isIndonesian ? 'Kembali ke Beranda' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </div>
  );
}