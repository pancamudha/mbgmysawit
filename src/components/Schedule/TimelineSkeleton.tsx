import React from "react";

export default function TimelineSkeleton() {
  return (
    <div className="relative border-l border-[#222222] ml-[10px] sm:ml-[16px] mt-4 space-y-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-6 sm:pl-8">
          <div className="w-16 h-5 bg-[#222222] rounded-md animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2].map((j) => (
              <div key={j} className="h-[80px] sm:h-[90px] w-full bg-[#111111] rounded-[16px] sm:rounded-[20px] border border-[#222222] animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}