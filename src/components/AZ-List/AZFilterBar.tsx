"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AZFilterBar() {
  const params = useParams();
  
  // Baca array dari URL (misal: ['A', 'page', '2'] atau ['page', '2'])
  const letterArray = params.letter as string[] | undefined;
  
  let currentLetter = "all";
  if (letterArray && letterArray.length > 0) {
    // Jika segment pertama adalah "page", berarti kita ada di kategori "All"
    if (letterArray[0] !== "page") {
      currentLetter = letterArray[0]; // Akan menghasilkan "A", "B", "other", dll
    }
  }

  const letters = [
    { label: "All", value: "all" },
    { label: "#", value: "other" },
    { label: "0-9", value: "0-9" },
    ...Array.from({ length: 26 }, (_, i) => ({
      label: String.fromCharCode(65 + i), // Label A-Z
      value: String.fromCharCode(65 + i), // Value A-Z (tanpa toLowerCase)
    }))
  ];

  const paddingPattern = [
    "px-3.5 sm:px-4", 
    "px-7 sm:px-8",   
    "px-3 sm:px-3.5", 
    "px-3.5 sm:px-4", 
    "px-7 sm:px-8",   
  ];

  return (
    <div className="w-full mb-6 sm:mb-8 flex flex-col items-center sm:items-start">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-baseline justify-center sm:justify-start gap-3 w-full">
          <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-wide text-center sm:text-left">Sort By Letters</h1>
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 mt-1 w-full">
          {letters.map((item, index) => {
            const isActive = currentLetter === item.value;
            const href = item.value === "all" ? "/az-list" : `/az-list/${item.value}`;
            const dynamicPadding = paddingPattern[index % paddingPattern.length];

            return (
              <Link
                key={item.value}
                href={href}
                className={`flex items-center justify-center h-9 sm:h-10 ${dynamicPadding} rounded-[10px] text-[13px] sm:text-sm font-medium transition-all min-w-[36px] sm:min-w-[40px] ${
                  isActive
                    ? "bg-[#161616] text-white border border-[#2A2A2E] pointer-events-none" 
                    : "bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}