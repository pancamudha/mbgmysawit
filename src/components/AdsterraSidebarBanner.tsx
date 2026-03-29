"use client";

import React from "react";

export default function AdsterraSidebarThinBanner() {
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
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
    // Container dibuat flex-col agar iframe tersusun atas-bawah (tinggi total 100px)
    <div className="w-full flex flex-col justify-center items-center overflow-hidden min-h-[100px]">
      
      {/* Banner Tipis Bagian Atas */}
      <iframe
        srcDoc={iframeHtml}
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        className="max-w-full border-b border-[#2A2A2E]/60"
      />
      
      {/* Banner Tipis Bagian Bawah */}
      <iframe
        srcDoc={iframeHtml}
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        className="max-w-full"
      />
      
    </div>
  );
}