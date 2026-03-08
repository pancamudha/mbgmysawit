import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import ExploreFilterBar from "@/components/Explore/ExploreFilterBar";
import ExplorePagination from "@/components/Explore/ExplorePagination";

export const dynamic = "force-dynamic";

interface AnimeItem {
  id: string;
  title: string;
  poster: string;
  status?: string;
  tvInfo: {
    showType: string;
    duration: string;
    sub: number | null;
    dub: number | null;
    eps: number | null;
    releaseDate?: string;
  };
}

export const metadata = {
  title: "Explore - Animaple",
  description: "Search and filter your favorite anime", // Diterjemahkan
};

const FORMAT_MAP: Record<string, string> = {
  "movie": "1", "tv": "2", "ova": "3", "ona": "4", "special": "5", "music": "6"
};

const GENRE_MAP: Record<string, string> = {
  "action": "1", "adventure": "2", "cars": "3", "comedy": "4", "dementia": "5", "demons": "6",
  "mystery": "7", "drama": "8", "ecchi": "9", "fantasy": "10", "game": "11", "historical": "13",
  "horror": "14", "kids": "15", "magic": "16", "martial-arts": "17", "mecha": "18", "music": "19",
  "parody": "20", "samurai": "21", "romance": "22", "school": "23", "sci-fi": "24", "shoujo": "25",
  "shoujo-ai": "26", "shounen": "27", "shounen-ai": "28", "space": "29", "sports": "30",
  "super-power": "31", "vampire": "32", "harem": "35", "slice-of-life": "36", "supernatural": "37",
  "military": "38", "police": "39", "psychological": "40", "thriller": "41", "seinen": "42",
  "josei": "43", "isekai": "44"
};

const STATUS_MAP: Record<string, string> = {
  "finished": "1", "currently-airing": "2", "not-yet-aired": "3"
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const format = typeof resolvedParams.format === 'string' ? resolvedParams.format : undefined;
  const genre = typeof resolvedParams.genre === 'string' ? resolvedParams.genre : undefined;
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined;
  const yearParam = typeof resolvedParams.year === 'string' ? resolvedParams.year : undefined;
  
  const queryParam = typeof resolvedParams.query === 'string' ? resolvedParams.query : undefined;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;

  let animeList: AnimeItem[] = [];
  let totalPages = 200;

  const baseUrl = process.env.API_BASE_URL || 'https://bowotheexplorer.vercel.app';
  const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  const secretKey = process.env.ANIMAPLE_SECRET_KEY || '';

  try {
    if (queryParam) {
      const res = await fetch(`${apiUrl}/search?keyword=${encodeURIComponent(queryParam)}&page=${page}`, { 
        cache: 'no-store',
        headers: { 'x-animaple-key': secretKey }
      });
      const json = await res.json();
      animeList = json?.results?.data || json?.data || [];
      totalPages = Number(json?.results?.totalPage || json?.totalPage) || 1;
    } else {
      const queryParams = new URLSearchParams();
      
      if (format) queryParams.append("type", FORMAT_MAP[format.toLowerCase()] || format);
      if (genre) queryParams.append("genres", GENRE_MAP[genre.toLowerCase()] || genre.replace(/-/g, '_'));
      if (status) queryParams.append("status", STATUS_MAP[status.toLowerCase()] || status.replace(/-/g, '_'));
      
      if (yearParam) {
        queryParams.append("sy", yearParam);
        queryParams.append("sm", "1");
        queryParams.append("sd", "1");
        queryParams.append("ey", yearParam); 
        queryParams.append("em", "12");
        queryParams.append("ed", "31");
      }
      
      queryParams.append("page", page.toString());

      const res = await fetch(`${apiUrl}/filter?${queryParams.toString()}`, { 
        cache: 'no-store',
        headers: { 'x-animaple-key': secretKey }
      });
      const json = await res.json();
      
      animeList = json?.results?.data || json?.data || [];
      totalPages = Number(json?.results?.totalPage || json?.totalPage) || 200;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-8 pb-5 md:pb-6 pt-[6px] md:pt-[10px]">
      <div className="max-w-[1600px] mx-auto">
        
        <ExploreFilterBar />

        {queryParam && (
          <div className="flex items-center gap-4 mb-6 sm:mb-8 w-full mt-2">
            <h2 className="text-[12px] sm:text-[14px] font-semibold tracking-[0.1em] text-[#8C8C8C] whitespace-nowrap uppercase">
              SEARCH RESULT FOR <span className="text-white ml-1">"{queryParam}"</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#2A2A2E] to-transparent"></div>
          </div>
        )}

        {animeList.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {animeList.map((anime, index) => {
              const sub = anime.tvInfo?.sub;
              const eps = anime.tvInfo?.eps;
              
              const showType = anime.tvInfo?.showType || 'TV';
              const releaseYear = anime.tvInfo?.releaseDate ? anime.tvInfo.releaseDate.split(', ').pop() : (yearParam || currentYear);
              const epsCount = eps || sub || '';

              return (
                <Link href={`/anime/${anime.id}`} key={`${anime.id}-${index}`} className="group cursor-pointer flex flex-col active:scale-[0.98] transition-transform duration-200">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1C] mb-2.5 group-hover:ring-2 group-active:ring-2 ring-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1.5">
                    <Image
                      src={anime.poster}
                      alt={anime.title}
                      fill
                      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                      className="object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-colors duration-300 z-20 flex items-center justify-center">
                      <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 hover:scale-120 transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.89 10.363l-10.29-6.39c-1.258-.781-2.9.117-2.9 1.637v12.78c0 1.52 1.642 2.418 2.9 1.637l10.29-6.39c1.218-.756 1.218-2.518 0-3.274z"/>
                      </svg>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 z-10" />
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <h3 className="text-[13px] sm:text-[14px] font-bold line-clamp-1 group-hover:text-indigo-400 group-active:text-indigo-400 transition-colors text-white leading-snug">
                      {anime.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 mt-1 text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      <span>{showType}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {releaseYear}
                      </span>
                    </div>
                    {epsCount && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        {epsCount} EPS
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
            <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No anime found.</p> {/* Diterjemahkan */}
          </div>
        )}

        {animeList.length > 0 && (
          <ExplorePagination 
            currentPage={page} 
            totalPages={totalPages} 
          />
        )}
      </div>
    </div>
  );
}