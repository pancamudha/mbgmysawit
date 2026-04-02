import { LayoutGrid } from "lucide-react";
import AZListPagination from "@/components/AZ-List/AZListPagination";
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
}: {
  params: Promise<{ letter?: string[] }>;
}) {
  const resolvedParams = await params;
  const letterArray = resolvedParams.letter || [];

  let currentLetter = "all";
  let page = 1;

  // Bedah struktur URL (contoh isinya: ['A', 'page', '2'] atau ['page', '2'])
  if (letterArray.length > 0) {
    if (letterArray[0] === 'page') {
      // Kondisi URL: /az-list/page/2
      page = parseInt(letterArray[1]) || 1;
    } else {
      // Kondisi URL: /az-list/A atau /az-list/A/page/2
      currentLetter = letterArray[0];
      if (letterArray[1] === 'page') {
        page = parseInt(letterArray[2]) || 1;
      }
    }
  }

  let animeList: AnimeItem[] = [];
  let totalPages = 1;

  const baseUrl = process.env.API_BASE_URL || 'https://bowotheexplorer.vercel.app';
  const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  const secretKey = process.env.ANIMAPLE_SECRET_KEY || '';

  try {
    // API dipanggil menggunakan huruf kecil (toLowerCase) agar aman
    const apiLetter = currentLetter === "all" ? "" : currentLetter.toLowerCase();
    
    const endpoint = currentLetter === "all" 
      ? `${apiUrl}/az-list?page=${page}` 
      : `${apiUrl}/az-list/${apiLetter}?page=${page}`;

    const res = await fetch(endpoint, { 
      cache: 'no-store',
      headers: { 'x-animaple-key': secretKey }
    });
    
    const json = await res.json();
    
    if (json.success) {
      animeList = json.results?.data || [];
      totalPages = Number(json.results?.totalPages) || 1;
    }
  } catch (error) {
    console.error("Error fetching AZ list data:", error);
  }
  
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-8 pb-5 md:pb-6 pt-[6px] md:pt-[10px]">
      <div className="max-w-[1600px] mx-auto">
        
        <AZFilterBar />

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

        {/* Kirim currentLetter ke Pagination agar dia tahu kita sedang di kategori apa */}
        {animeList.length > 0 && (
          <AZListPagination 
            currentPage={page} 
            totalPages={totalPages} 
            currentLetter={currentLetter}
          />
        )}
      </div>
    </div>
  );
}