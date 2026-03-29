import { fetchApi } from '@/lib/api';
import HeroCarousel from '@/components/HeroCarousel';
import GenreBar from '@/components/GenreBar';
import WelcomeBanner from '@/components/WelcomeBanner';
import LatestCompleted from '@/components/LatestCompleted';
import LatestEpisodes from '@/components/LatestEpisodes';
import TabbedAnimeSection from '@/components/TabbedAnimeSection';
import TopUpcoming from '@/components/TopUpcoming';
import TrendingSection from '@/components/TrendingSection';
import TopTenSidebar from '@/components/TopTenSidebar';
import AiringSchedule from '@/components/AiringSchedule';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Mengambil data dari endpoint root API
  const response = await fetchApi('/'); 
  
  // Data dibungkus dalam properti "results"
  const data = response?.results || {};

  // Memecah data sesuai kebutuhan masing-masing komponen
  const spotlights = data.spotlights || [];
  const latestEpisodes = data.latestEpisode || [];
  const topAiring = data.topAiring || [];
  const mostPopular = data.mostPopular || [];
  const mostFavorite = data.mostFavorite || [];
  const latestCompleted = data.latestCompleted || [];
  const topUpcoming = data.topUpcoming || [];
  const genres = data.genres || [];
  const trending = data.trending || []; 
  const topTen = data.topTen || { today: [], week: [], month: [] };
  
  // PERUBAHAN: Menarik data schedule
  const schedule = data.today?.schedule || [];

  return (
    <main className="w-full">
      {/* 1. HERO CAROUSEL */}
      <HeroCarousel animes={spotlights} />

      {/* 2. GENRE BAR */}
      <div className="mt-1 sm:mt-2">
        <GenreBar />
      </div>

      {/* 3. KONTEN BAWAH (DUA KOLOM DI DESKTOP) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12">
        
        {/* Section Trending */}
        <TrendingSection animes={trending} />

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          
          {/* KOLOM KIRI (Konten Utama) */}
          <div className="flex-1 min-w-0">
            <WelcomeBanner />
            <LatestEpisodes animes={latestEpisodes} />
            
            <div className="-mt-2 sm:-mt-4 relative z-10">
              <TabbedAnimeSection 
                topAiring={topAiring} 
                mostPopular={mostPopular} 
                mostFavorite={mostFavorite} 
              />
            </div>

            {/* PERUBAHAN: Menambahkan Jadwal Tayang di bawah Tabbed Section */}
            <AiringSchedule schedule={schedule} />
          </div>

          {/* KOLOM KANAN (Sidebar) */}
          <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <LatestCompleted animes={latestCompleted} />
            
            <div className="mt-6">
              <TopUpcoming animes={topUpcoming} />
            </div>

            <TopTenSidebar data={topTen} />
          </aside>

        </div>
      </div>
    </main>
  );
}