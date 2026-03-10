import { LayoutGrid } from "lucide-react";
import ExploreFilterBar from "@/components/Explore/ExploreFilterBar";
import ExplorePagination from "@/components/Explore/ExplorePagination";
import { AnimeCardClient } from "@/components/Explore/AnimeCardClient"; // Import komponen client

export const dynamic = "force-dynamic";

interface AnimeItem {
  id: string;
  title: string;
  japanese_title?: string;
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
  description: "Search and filter your favorite anime",
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
            {animeList.map((anime, index) => (
              <AnimeCardClient 
                key={`${anime.id}-${index}`} 
                anime={anime} 
                fallbackYear={yearParam || currentYear.toString()} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
            <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No anime found.</p>
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