import { LayoutGrid } from "lucide-react";
import ExploreFilterBar from "@/components/Explore/ExploreFilterBar";
import ExplorePagination from "@/components/Explore/ExplorePagination";
import { AnimeCardClient } from "@/components/Explore/AnimeCardClient";

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
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slug = resolvedParams.slug || [];

  // SMART PARSER: Mencari parameter tanpa mempedulikan urutannya
  const formatParam = slug.find(s => Object.keys(FORMAT_MAP).includes(s.toLowerCase()));
  const genreParam = slug.find(s => Object.keys(GENRE_MAP).includes(s.toLowerCase()));
  const statusParam = slug.find(s => Object.keys(STATUS_MAP).includes(s.toLowerCase()));
  const yearParam = slug.find(s => /^\d{4}$/.test(s)); 
  
  // ANTI-NaN PARSER untuk Nomor Halaman
  let page = 1;
  const pageIndex = slug.indexOf('page');
  if (pageIndex !== -1 && slug[pageIndex + 1]) {
    const parsedPage = parseInt(slug[pageIndex + 1]);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  const queryParam = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined;

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
      
      // Keamanan Anti-NaN
      const rawTotal = parseInt(json?.results?.totalPage || json?.totalPage);
      totalPages = !isNaN(rawTotal) && rawTotal > 0 ? rawTotal : 1;
    } else {
      const queryParams = new URLSearchParams();
      
      if (formatParam) queryParams.append("type", FORMAT_MAP[formatParam.toLowerCase()]);
      if (genreParam) queryParams.append("genres", GENRE_MAP[genreParam.toLowerCase()]);
      if (statusParam) queryParams.append("status", STATUS_MAP[statusParam.toLowerCase()]);
      
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
      
      // Keamanan Anti-NaN (fallback ke 200 jika API filter tidak memberikan totalPages)
      const rawTotal = parseInt(json?.results?.totalPage || json?.totalPage);
      totalPages = !isNaN(rawTotal) && rawTotal > 0 ? rawTotal : 200;
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