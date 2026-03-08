"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { X, LayoutGrid, Tag, PlayCircle, Calendar, ChevronDown, Check } from "lucide-react";

// Opsi filter (label dan value)
const formatOptions = [
  { value: "", label: "All Format" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "ona", label: "ONA" },
  { value: "special", label: "Special" },
  { value: "music", label: "Music" },
];

const genreOptions = [
  { value: "", label: "All Genres" },
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "cars", label: "Cars" },
  { value: "comedy", label: "Comedy" },
  { value: "dementia", label: "Dementia" },
  { value: "demons", label: "Demons" },
  { value: "drama", label: "Drama" },
  { value: "ecchi", label: "Ecchi" },
  { value: "fantasy", label: "Fantasy" },
  { value: "game", label: "Game" },
  { value: "harem", label: "Harem" },
  { value: "historical", label: "Historical" },
  { value: "horror", label: "Horror" },
  { value: "isekai", label: "Isekai" },
  { value: "josei", label: "Josei" },
  { value: "kids", label: "Kids" },
  { value: "magic", label: "Magic" },
  { value: "martial-arts", label: "Martial Arts" },
  { value: "mecha", label: "Mecha" },
  { value: "military", label: "Military" },
  { value: "music", label: "Music" },
  { value: "mystery", label: "Mystery" },
  { value: "parody", label: "Parody" },
  { value: "police", label: "Police" },
  { value: "psychological", label: "Psychological" },
  { value: "romance", label: "Romance" },
  { value: "samurai", label: "Samurai" },
  { value: "school", label: "School" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "seinen", label: "Seinen" },
  { value: "shoujo", label: "Shoujo" },
  { value: "shoujo-ai", label: "Shoujo Ai" },
  { value: "shounen", label: "Shounen" },
  { value: "shounen-ai", label: "Shounen Ai" },
  { value: "slice-of-life", label: "Slice of Life" },
  { value: "space", label: "Space" },
  { value: "sports", label: "Sports" },
  { value: "super-power", label: "Super Power" },
  { value: "supernatural", label: "Supernatural" },
  { value: "thriller", label: "Thriller" },
  { value: "vampire", label: "Vampire" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "finished", label: "Finished" },
  { value: "currently-airing", label: "Releasing" },
  { value: "not-yet-aired", label: "Upcoming" },
];

const yearOptions = [
  { value: "", label: "All Years" }
];

for (let year = 2026; year >= 1945; year--) {
  yearOptions.push({
    value: year.toString(),
    label: year.toString()
  });
}

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

  // Komponen Dropdown Kustom yang dapat digunakan kembali
  const Dropdown = ({
    labelKey,
    options,
    icon: Icon,
    paramKey,
  }: {
    labelKey: string;
    options: { value: string; label: string }[];
    icon: any;
    paramKey: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dapatkan nilai terpilih dari searchParams
    const selectedValue = searchParams.get(paramKey) || "";
    // Temukan label terpilih atau gunakan label default
    const selectedLabel =
      options.find((option) => option.value === selectedValue)?.label ||
      labelKey;

    // Tutup menu saat klik di luar
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const isApplied = selectedValue !== "";

    return (
      <div
        ref={dropdownRef}
        className="relative flex-1 min-w-[150px] group transition-all"
      >
        {/* Pemicu Dropdown (Tombol) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-11 bg-[#0F0F0F] text-[13px] font-medium border ${
            isOpen ? "border-[#3A3A3E]" : "border-[#2A2A2E]"
          } hover:border-[#3A3A3E] rounded-[10px] pl-[36px] pr-8 flex items-center justify-between transition-all cursor-pointer focus:outline-none`}
        >
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Icon
              className={`w-3.5 h-3.5 transition-colors ${
                isOpen || isApplied ? "text-white" : "text-[#8C8C8C]"
              } group-hover:text-white`}
            />
          </div>
          <span
            className={`truncate transition-colors ${
              isOpen || isApplied ? "text-white" : "text-slate-200"
            } group-hover:text-white`}
          >
            {selectedLabel}
          </span>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                isOpen ? "rotate-180 text-white" : "text-[#8C8C8C] group-hover:text-white"
              }`}
            />
          </div>
        </button>

        {/* Menu Dropdown (Daftar Pilihan) dengan Custom Scrollbar dan ukuran pas 7 item */}
        {isOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[10px] py-1.5 z-50 shadow-2xl max-h-[278px] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2A2A2E] hover:[&::-webkit-scrollbar-thumb]:bg-[#3A3A3E] [&::-webkit-scrollbar-thumb]:rounded-full">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleFilterChange(paramKey, option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-[9px] text-[13px] font-medium transition-colors ${
                  selectedValue === option.value
                    ? "text-white bg-[#2D2D2F]" // Warna background saat item aktif
                    : "text-[#8C8C8C] hover:text-white hover:bg-[#1C1C1F]" // Hover background agar tidak hanya teks putih
                }`}
              >
                <span className="truncate">{option.label}</span>
                {selectedValue === option.value && (
                  // Ikon check dibuat lebih tipis menyerupai JustAnime
                  <Check className="w-[14px] h-[14px] text-[#8C8C8C] shrink-0" strokeWidth={1.5} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-[22px] w-full">
      {/* Format Filter */}
      <Dropdown
        labelKey="All Format"
        options={formatOptions}
        icon={LayoutGrid}
        paramKey="format"
      />

      {/* Genre Filter */}
      <Dropdown
        labelKey="All Genres"
        options={genreOptions}
        icon={Tag}
        paramKey="genre"
      />

      {/* Status Filter */}
      <Dropdown
        labelKey="All Status"
        options={statusOptions}
        icon={PlayCircle}
        paramKey="status"
      />

      {/* Year Filter */}
      <Dropdown
        labelKey="All Years"
        options={yearOptions}
        icon={Calendar}
        paramKey="year"
      />

      {/* Tombol Reset */}
      <button
        onClick={handleReset}
        className="flex-1 min-w-[150px] flex items-center justify-start gap-2 pl-3.5 h-11 text-[13px] font-medium text-[#8C8C8C] bg-[#0F0F0F] border border-[#1C1C1F] hover:border-[#2A2A2E] rounded-[10px] hover:text-white hover:bg-[#161616] transition-all focus:outline-none"
      >
        <X className="w-3.5 h-3.5" />
        Reset Filters
      </button>
    </div>
  );
}