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
  { value: "", label: "All Years" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" },
  { value: "2018", label: "2018" },
  { value: "2017", label: "2017" },
  { value: "2016", label: "2016" },
  { value: "2015", label: "2015" },
  { value: "2014", label: "2014" },
  { value: "2013", label: "2013" },
  { value: "2012", label: "2012" },
  { value: "2011", label: "2011" },
  { value: "2010", label: "2010" },
  { value: "2009", label: "2009" },
  { value: "2008", label: "2008" },
  { value: "2007", label: "2007" },
  { value: "2006", label: "2006" },
  { value: "2005", label: "2005" },
  { value: "2004", label: "2004" },
  { value: "2003", label: "2003" },
  { value: "2002", label: "2002" },
  { value: "2001", label: "2001" },
  { value: "2000", label: "2000" },
  { value: "1999", label: "1999" },
  { value: "1998", label: "1998" },
  { value: "1997", label: "1997" },
  { value: "1996", label: "1996" },
  { value: "1995", label: "1995" },
  { value: "1994", label: "1994" },
  { value: "1993", label: "1993" },
  { value: "1992", label: "1992" },
  { value: "1991", label: "1991" },
  { value: "1990", label: "1990" },
  { value: "1989", label: "1989" },
  { value: "1988", label: "1988" },
  { value: "1987", label: "1987" },
  { value: "1986", label: "1986" },
  { value: "1985", label: "1985" },
  { value: "1984", label: "1984" },
  { value: "1983", label: "1983" },
  { value: "1982", label: "1982" },
  { value: "1981", label: "1981" },
  { value: "1980", label: "1980" },
  { value: "1979", label: "1979" },
  { value: "1978", label: "1978" },
  { value: "1977", label: "1977" },
  { value: "1976", label: "1976" },
  { value: "1975", label: "1975" },
  { value: "1974", label: "1974" },
  { value: "1973", label: "1973" },
  { value: "1972", label: "1972" },
  { value: "1971", label: "1971" },
  { value: "1970", label: "1970" },
  { value: "1969", label: "1969" },
  { value: "1968", label: "1968" },
  { value: "1967", label: "1967" },
  { value: "1966", label: "1966" },
  { value: "1965", label: "1965" },
  { value: "1964", label: "1964" },
  { value: "1963", label: "1963" },
  { value: "1962", label: "1962" },
  { value: "1961", label: "1961" },
  { value: "1960", label: "1960" },
  { value: "1959", label: "1959" },
  { value: "1958", label: "1958" },
  { value: "1957", label: "1957" },
  { value: "1956", label: "1956" },
  { value: "1955", label: "1955" },
  { value: "1954", label: "1954" },
  { value: "1953", label: "1953" },
  { value: "1952", label: "1952" },
  { value: "1951", label: "1951" },
  { value: "1950", label: "1950" },
  { value: "1949", label: "1949" },
  { value: "1948", label: "1948" },
  { value: "1947", label: "1947" },
  { value: "1946", label: "1946" },
  { value: "1945", label: "1945" },
];

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