"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X, LayoutGrid, Tag, PlayCircle, Calendar } from "lucide-react";

export default function ExploreFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); 
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    router.push(`/explore?${createQueryString(key, value)}`);
  };

  const handleReset = () => {
    router.push("/explore");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-[22px] w-full">
      {/* Format Filter */}
      <div className="relative flex-1 min-w-[150px] group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <LayoutGrid className="w-3.5 h-3.5 text-[#8C8C8C] group-focus-within:text-white transition-colors" />
        </div>
        <select
          value={searchParams.get("format") || ""}
          onChange={(e) => handleFilterChange("format", e.target.value)}
          className="w-full h-11 bg-[#0F0F0F] text-[13px] font-medium text-slate-200 border border-[#2A2A2E] hover:border-[#3A3A3E] focus:border-[#3A3A3E] rounded-[10px] pl-[36px] pr-8 appearance-none focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Format</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="ona">ONA</option>
          <option value="special">Special</option>
        </select>
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
          <svg className="w-3 h-3 text-[#8C8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="relative flex-1 min-w-[150px] group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Tag className="w-3.5 h-3.5 text-[#8C8C8C] group-focus-within:text-white transition-colors" />
        </div>
        <select
          value={searchParams.get("genre") || ""}
          onChange={(e) => handleFilterChange("genre", e.target.value)}
          className="w-full h-11 bg-[#0F0F0F] text-[13px] font-medium text-slate-200 border border-[#2A2A2E] hover:border-[#3A3A3E] focus:border-[#3A3A3E] rounded-[10px] pl-[36px] pr-8 appearance-none focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Genres</option>
          <option value="action">Action</option>
          <option value="adventure">Adventure</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="fantasy">Fantasy</option>
          <option value="romance">Romance</option>
          <option value="sci-fi">Sci-Fi</option>
        </select>
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
           <svg className="w-3 h-3 text-[#8C8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative flex-1 min-w-[150px] group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <PlayCircle className="w-3.5 h-3.5 text-[#8C8C8C] group-focus-within:text-white transition-colors" />
        </div>
        <select
          value={searchParams.get("status") || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full h-11 bg-[#0F0F0F] text-[13px] font-medium text-slate-200 border border-[#2A2A2E] hover:border-[#3A3A3E] focus:border-[#3A3A3E] rounded-[10px] pl-[36px] pr-8 appearance-none focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="finished">Finished Airing</option>
          <option value="currently-airing">Currently Airing</option>
          <option value="not-yet-aired">Not yet aired</option>
        </select>
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
           <svg className="w-3 h-3 text-[#8C8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {/* Year Filter */}
      <div className="relative flex-1 min-w-[150px] group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Calendar className="w-3.5 h-3.5 text-[#8C8C8C] group-focus-within:text-white transition-colors" />
        </div>
        <select
          value={searchParams.get("year") || ""}
          onChange={(e) => handleFilterChange("year", e.target.value)}
          className="w-full h-11 bg-[#0F0F0F] text-[13px] font-medium text-slate-200 border border-[#2A2A2E] hover:border-[#3A3A3E] focus:border-[#3A3A3E] rounded-[10px] pl-[36px] pr-8 appearance-none focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
           <svg className="w-3 h-3 text-[#8C8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="flex-1 min-w-[150px] flex items-center justify-start gap-2 pl-3.5 h-11 text-[13px] font-medium text-[#8C8C8C] bg-[#0F0F0F] border border-[#1C1C1F] hover:border-[#2A2A2E] rounded-[10px] hover:text-white hover:bg-[#161616] transition-all"
      >
        <X className="w-3.5 h-3.5" />
        Reset Filters
      </button>
    </div>
  );
}