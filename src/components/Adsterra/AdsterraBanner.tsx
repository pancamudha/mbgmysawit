"use client";

import React from "react";

export default function AdsterraBanner() {
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Body dibuat width 100% agar iklan otomatis di tengah layar lebar */
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '87348fcf9e7c84a58c27d777757b69a2',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/87348fcf9e7c84a58c27d777757b69a2/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden min-h-[90px] bg-gradient-to-r from-[#080808] via-[#121212] to-[#080808]">
      
      <div className="absolute inset-0 flex justify-between items-center px-4 sm:px-12 pointer-events-none opacity-[0.15]">
        <span 
          className="text-[10px] font-black tracking-[0.4em] text-white uppercase hidden sm:block" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Advertisement
        </span>
        <span 
          className="text-[10px] font-black tracking-[0.4em] text-white uppercase hidden sm:block" 
          style={{ writingMode: 'vertical-rl' }}
        >
          Advertisement
        </span>
      </div>

      <iframe
        srcDoc={iframeHtml}
        width="100%"
        height="90"
        frameBorder="0"
        scrolling="no"
        className="relative z-10"
      />
    </div>
  );
}