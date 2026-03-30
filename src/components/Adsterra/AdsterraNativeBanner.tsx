"use client";

import React from "react";

export default function AdsterraNativeBanner() {
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="https://pl29011009.profitablecpmratenetwork.com/d47ebbe0f5ffa60254e29ac3fc895262/invoke.js"></script>
        <div id="container-d47ebbe0f5ffa60254e29ac3fc895262"></div>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center overflow-hidden min-h-[90px]">
      <iframe
        srcDoc={iframeHtml}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        className="w-full min-h-[90px]"
      />
    </div>
  );
}