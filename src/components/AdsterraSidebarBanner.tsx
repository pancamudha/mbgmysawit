"use client";

import React from "react";

export default function AdsterraSidebarThinBanner() {
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Body dibuat width 100% agar iklan otomatis di tengah kalau ada sisa ruang */
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : 'de4a301333955fdf5c888e28a02eb32d',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/de4a301333955fdf5c888e28a02eb32d/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="relative w-full flex flex-col justify-center items-center overflow-hidden min-h-[100px] bg-gradient-to-r from-[#080808] via-[#121212] to-[#080808]">
      
      <div className="absolute inset-0 flex justify-between items-center px-1.5 sm:px-2 pointer-events-none opacity-[0.15]">
        <span 
          className="text-[8px] font-black tracking-widest text-white uppercase" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Advertisement
        </span>
        <span 
          className="text-[8px] font-black tracking-widest text-white uppercase" 
          style={{ writingMode: 'vertical-rl' }}
        >
          Advertisement
        </span>
      </div>
      
      <iframe
        srcDoc={iframeHtml}
        width="100%"
        height="50"
        frameBorder="0"
        scrolling="no"
        className="relative z-10 block"
      />
      
      <iframe
        srcDoc={iframeHtml}
        width="100%"
        height="50"
        frameBorder="0"
        scrolling="no"
        className="relative z-10 block"
      />
      
    </div>
  );
}