"use client";
import React from 'react';
import { StepBack, StepForward } from 'lucide-react';

export default function WatchControls({ 
  onPrev, 
  onNext, 
  currentEpIndex, 
  totalEpisodes,
  autoPlay, setAutoPlay,
  autoSkip, setAutoSkip,
  autoNext, setAutoNext
}: any) {
  return (
    <div className="flex items-center justify-between flex-nowrap gap-4 py-2 px-3 sm:px-4 bg-[#0F0F0F] border border-[#2A2A2E] rounded-[10px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* Checkboxes Section */}
      <div className="flex items-center gap-3 sm:gap-6 py-1 shrink-0">
         
         <label className="flex items-center gap-1.5 cursor-pointer text-[13px] font-medium group">
           <input 
             type="checkbox" 
             checked={autoPlay}
             onChange={() => setAutoPlay(!autoPlay)}
             // accent-white untuk warna centang putih, rounded-md untuk sudut agak bulat
             className="w-4 h-4 accent-white cursor-pointer bg-[#0F0F0F] border-[#2A2A2E] rounded-md transition-colors shrink-0"
           />
           <span className={`whitespace-nowrap transition-colors ${autoPlay ? 'text-white font-bold' : 'text-[#8C8C8C] group-hover:text-slate-200'}`}>
             Auto Play
           </span>
         </label>

         <label className="flex items-center gap-1.5 cursor-pointer text-[13px] font-medium group">
           <input 
             type="checkbox" 
             checked={autoSkip}
             onChange={() => setAutoSkip(!autoSkip)}
             className="w-4 h-4 accent-white cursor-pointer bg-[#0F0F0F] border-[#2A2A2E] rounded-md transition-colors shrink-0"
           />
           <span className={`whitespace-nowrap transition-colors ${autoSkip ? 'text-white font-bold' : 'text-[#8C8C8C] group-hover:text-slate-200'}`}>
             Auto Skip
           </span>
         </label>

         <label className="flex items-center gap-1.5 cursor-pointer text-[13px] font-medium group">
           <input 
             type="checkbox" 
             checked={autoNext}
             onChange={() => setAutoNext(!autoNext)}
             className="w-4 h-4 accent-white cursor-pointer bg-[#0F0F0F] border-[#2A2A2E] rounded-md transition-colors shrink-0"
           />
           <span className={`whitespace-nowrap transition-colors ${autoNext ? 'text-white font-bold' : 'text-[#8C8C8C] group-hover:text-slate-200'}`}>
             Auto Next
           </span>
         </label>

      </div>

      {/* Nav Buttons Section */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
         <button 
           onClick={onPrev} 
           disabled={currentEpIndex <= 0}
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-slate-200 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
         >
            <StepBack className="w-3.5 h-3.5 shrink-0" /> Prev
         </button>
         <button 
           onClick={onNext}
           disabled={currentEpIndex >= totalEpisodes - 1}
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-slate-200 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
         >
            Next <StepForward className="w-3.5 h-3.5 shrink-0" />
         </button>
      </div>
      
    </div>
  );
}