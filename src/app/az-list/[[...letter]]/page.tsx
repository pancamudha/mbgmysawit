import { LayoutGrid } from "lucide-react";
import ExplorePagination from "@/components/Explore/ExplorePagination";
import { AnimeCardClient } from "@/components/Explore/AnimeCardClient";
import AZFilterBar from "@/components/AZ-List/AZFilterBar";

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
  title: "A-Z List - Animaple",
  description: "Browse anime alphabetically from A to Z",
};

export default async function AZListPage({
  params,
  searchParams,
}: {
  params: Promise<{ letter?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Tangkap huruf dari segment URL (misal: /az-list/A -> 'A')
  const currentLetter = resolvedParams.letter ? resolvedParams.letter[0].toLowerCase() : "all";
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;

  let animeList: AnimeItem[] = [];
  let totalPages = 1;

  const baseUrl = process.env.API_BASE_URL || 'https://bowotheexplorer.vercel.app';
  const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  const secretKey = process.env.ANIMAPLE_SECRET_KEY || '';

  try {
    // Susun endpoint berdasarkan rute yang diakses
    // Default endpoint: /api/az-list
    // Endpoint spesifik: /api/az-list/A, /api/az-list/other, dll
    const endpoint = currentLetter === "all" 
      ? `${apiUrl}/az-list?page=${page}` 
      : `${apiUrl}/az-list/${currentLetter}?page=${page}`;

    const res = await fetch(endpoint, { 
      cache: 'no-store',
      headers: { 'x-animaple-key': secretKey }
    });
    
    const json = await res.json();
    
    if (json.success) {
      animeList = json.results?.data || [];
      // Mengambil totalPages dari JSON response (perhatikan 's' pada totalPages)
      totalPages = Number(json.results?.totalPages) || 1;
    }
  } catch (error) {
    console.error("Error fetching AZ list data:", error);
  }
  
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-8 pb-5 md:pb-6 pt-[6px] md:pt-[10px]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Render Komponen Navigasi A-Z */}
        <AZFilterBar />

        {/* Tampilan Grid Anime */}
        {animeList.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {animeList.map((anime, index) => (
              <AnimeCardClient 
                key={`${anime.id}-${index}`} 
                anime={anime} 
                fallbackYear={currentYear.toString()} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-[#8C8C8C]">
            <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No anime found in this category.</p>
          </div>
        )}

        {/* Pagination Reuse dari Explore */}
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