"use client";

import { useEffect, useRef } from "react";

export default function AdsterraBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mencegah script ter-render ganda akibat React Strict Mode
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");

      conf.type = "text/javascript";
      conf.innerHTML = `atOptions = {
        'key' : '87348fcf9e7c84a58c27d777757b69a2',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };`;

      script.type = "text/javascript";
      script.src = "https://www.highperformanceformat.com/87348fcf9e7c84a58c27d777757b69a2/invoke.js";

      // Memasukkan script ke dalam div secara berurutan
      bannerRef.current.append(conf);
      bannerRef.current.append(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden min-h-[90px]">
      {/* Script Adsterra akan di-inject ke dalam div ini */}
      <div ref={bannerRef}></div>
    </div>
  );
}