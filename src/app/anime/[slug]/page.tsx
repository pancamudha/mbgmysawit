"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AnimeHero from '@/components/AnimeDetail/AnimeHero';
import AnimeRelated from '@/components/AnimeDetail/AnimeRelated';
import AnimeCharacters from '@/components/AnimeDetail/AnimeCharacters';
import AnimeRecommendations from '@/components/AnimeDetail/AnimeRecommendations';
import AnimeTrailer from '@/components/AnimeDetail/AnimeTrailer';
import LoadingScreen from '@/components/LoadingScreen'; 

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [animeData, setAnimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      const cacheKey = `animaple_cache_v3_${slug}`;
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
          
          // SUNTIKKAN DATA SEASONS DARI LUAR OBJEK DATA
          detailData.seasons = json.results.seasons || [];

          const trailers = detailData.animeInfo?.trailers || [];
          const characters = detailData.charactersVoiceActors || [];
          const anilistId = detailData.anilistId;

          // SINKRONISASI SMART FALLBACK (Trailer & Character)
          if (anilistId && (trailers.length === 0 || characters.length === 0)) {
            try {
              const fetchPromises = [];
              if (trailers.length === 0) {
                fetchPromises.push(
                  fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                      query: `query ($id: Int) { Media (id: $id) { trailer { id site thumbnail } } }`,
                      variables: { id: parseInt(anilistId) }
                    })
                  }).then(r => r.json())
                );
              } else {
                fetchPromises.push(Promise.resolve(null));
              }

              if (characters.length === 0) {
                fetchPromises.push(
                  fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                      query: `query ($id: Int) { Media (id: $id) { characters (sort: [ROLE, RELEVANCE, ID], perPage: 12) { edges { role node { id name { full } image { large } } voiceActors (language: JAPANESE) { id name { full } image { large } } } } } }`,
                      variables: { id: parseInt(anilistId) }
                    })
                  }).then(r => r.json())
                );
              } else {
                fetchPromises.push(Promise.resolve(null));
              }

              const [aniTrailerJson, aniCharJson] = await Promise.all(fetchPromises);

              if (aniTrailerJson) {
                const trailer = aniTrailerJson?.data?.Media?.trailer;
                if (trailer && trailer.site === "youtube") {
                  if (!detailData.animeInfo.trailers) detailData.animeInfo.trailers = [];
                  detailData.animeInfo.trailers.push({
                    title: "Official Trailer (AniList Sync)",
                    url: `https://www.youtube.com/embed/${trailer.id}?rel=0`,
                    thumbnail: trailer.thumbnail || `https://img.youtube.com/vi/${trailer.id}/hqdefault.jpg`
                  });
                }
              }

              if (aniCharJson) {
                const edges = aniCharJson?.data?.Media?.characters?.edges || [];
                if (edges.length > 0) {
                  detailData.charactersVoiceActors = edges.map((edge: any) => {
                    const char = edge.node;
                    const va = edge.voiceActors && edge.voiceActors.length > 0 ? edge.voiceActors[0] : null;
                    return {
                      character: {
                        id: char?.id?.toString() || "",
                        poster: char?.image?.large || "",
                        name: char?.name?.full || "",
                        cast: edge.role || "Supporting"
                      },
                      voiceActors: va ? [{
                        id: va.id?.toString() || "",
                        poster: va.image?.large || "",
                        name: va.name?.full || ""
                      }] : []
                    };
                  });
                }
              }
            } catch (err) {
              console.error("Gagal sinkronisasi AniList:", err);
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!animeData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white">
        <h1 className="text-2xl font-bold mb-2">Anime tidak ditemukan</h1>
        <p className="text-[#8C8C8C]">Silakan kembali ke beranda.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0A0A0B] pb-6">
      <div className="absolute top-0 left-0 w-full h-[450px] sm:h-[500px] z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={animeData.poster} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60 scale-105 blur-sm" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/40 via-[#0A0A0B]/80 to-[#0A0A0B]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-[30px] flex flex-col gap-6 sm:gap-8">
        
        <AnimeHero anime={animeData} />
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
                 {/* Lempar relasi dan season sekaligus */}
                 <AnimeRelated relations={animeData.related_data} seasons={animeData.seasons} />
            </div>

            <div className="lg:col-span-9 order-1 lg:order-2">
                 <AnimeTrailer trailer={animeData.animeInfo?.trailers?.[0]} />
            </div>
        </div>
        
        <AnimeCharacters characters={animeData.charactersVoiceActors} />
        <AnimeRecommendations recommendations={animeData.recommended_data} />

      </div>
    </div>
  );
}