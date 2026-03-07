"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AnimeHero from '@/components/AnimeDetail/AnimeHero';
import AnimeRelated from '@/components/AnimeDetail/AnimeRelated';
import AnimeCharacters from '@/components/AnimeDetail/AnimeCharacters';
import AnimeRecommendations from '@/components/AnimeDetail/AnimeRecommendations';
import AnimeTrailer from '@/components/AnimeDetail/AnimeTrailer';
import LoadingScreen from '@/components/LoadingScreen'; 
import { getAnilistTrailer, getAnilistCharacters, getMalTrailer, getMalCharacters } from '@/lib/api';

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [animeData, setAnimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      const cacheKey = `animaple_cache_v5_${slug}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        setAnimeData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://bowotheexplorer.vercel.app/api/info?id=${slug}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const json = await res.json();
        
        if (json && json.results && json.results.data) {
          const detailData = json.results.data;
          
          detailData.seasons = json.results.seasons || [];

          let trailers = detailData.animeInfo?.trailers || [];
          let characters = detailData.charactersVoiceActors || [];
          const anilistId = detailData.anilistId;
          const malId = detailData.malId;

          // 0. SINKRONISASI BANNER
          if (!detailData.banner && anilistId) {
            try {
              const aniBannerRes = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                  query: `query ($id: Int) { Media (id: $id) { bannerImage } }`,
                  variables: { id: parseInt(anilistId) }
                })
              });
              const aniBannerJson = await aniBannerRes.json();
              if (aniBannerJson?.data?.Media?.bannerImage) {
                detailData.banner = aniBannerJson.data.Media.bannerImage;
              }
            } catch (err) {
              console.error("Gagal sinkronisasi banner AniList:", err);
            }
          }

          // 1. SINKRONISASI TRAILER
          if (trailers.length === 0) {
            if (anilistId) trailers = await getAnilistTrailer(anilistId);
            if (trailers.length === 0 && malId) trailers = await getMalTrailer(malId);
            if (trailers.length > 0) {
                if (!detailData.animeInfo) detailData.animeInfo = {};
                detailData.animeInfo.trailers = trailers;
            }
          }

          // 2. SINKRONISASI KARAKTER
          if (characters.length === 0) {
            if (anilistId) characters = await getAnilistCharacters(anilistId);
            if (characters.length === 0 && malId) characters = await getMalCharacters(malId);
            if (characters.length > 0) {
                detailData.charactersVoiceActors = characters;
            }
          }

          setAnimeData(detailData);
          sessionStorage.setItem(cacheKey, JSON.stringify(detailData));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAnimeDetail();
  }, [slug]);

  if (loading) return <LoadingScreen />;

  if (!animeData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white">
        <h1 className="text-2xl font-bold mb-2">Anime tidak ditemukan</h1>
        <p className="text-[#8C8C8C]">Silakan kembali ke beranda.</p>
      </div>
    );
  }

  // Cek ketersediaan data untuk layouting dinamis
  const hasTrailer = animeData.animeInfo?.trailers?.length > 0;
  const hasRelated = (animeData.related_data?.length > 0) || (animeData.seasons?.length > 0);
  const hasCharacters = animeData.charactersVoiceActors?.length > 0;

  return (
    <div className="relative w-full bg-[#0A0A0B] pb-6">
      
      <div className="absolute top-0 left-0 w-full h-[450px] sm:h-[500px] z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={animeData.banner || animeData.poster} 
          alt="Background" 
          className={`w-full h-full object-cover opacity-60 scale-105 ${!animeData.banner ? 'blur-sm' : ''}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/40 via-[#0A0A0B]/80 to-[#0A0A0B]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-[30px] flex flex-col gap-6 sm:gap-8">
        
        <AnimeHero anime={animeData} />
        
        {/* SECTION GRID: Trailer & Related dengan Logika Lebar Dinamis */}
        {(hasTrailer || hasRelated) && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* RELATED ANIME */}
              {hasRelated && (
                <div className={`flex flex-col gap-4 order-2 lg:order-1 ${hasTrailer ? 'lg:col-span-3' : 'lg:col-span-12'}`}>
                    <AnimeRelated 
                      relations={animeData.related_data} 
                      seasons={animeData.seasons} 
                      hasTrailer={hasTrailer} 
                    />
                </div>
              )}

              {/* TRAILER */}
              {hasTrailer && (
                <div className={`order-1 lg:order-2 ${hasRelated ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
                    <AnimeTrailer 
                      trailer={animeData.animeInfo.trailers[0]} 
                      hasRelated={hasRelated} 
                    />
                </div>
              )}
              
          </div>
        )}
        
        {/* Render hanya jika karakter ada (tanpa placeholder) */}
        {hasCharacters && (
          <AnimeCharacters characters={animeData.charactersVoiceActors} />
        )}
        
        <AnimeRecommendations recommendations={animeData.recommended_data} />

      </div>
    </div>
  );
}