"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import EpisodeList from './EpisodeList';
import ServerSelector from './ServerSelector';
import WatchControls from './WatchControls';
import WatchBreadcrumb from './WatchBreadcrumb';
import LoadingScreen from '@/components/LoadingScreen';
import AdsterraBanner from '@/components/Adsterra/AdsterraBanner';
import { env } from '@/config/env';
import { useStreamManager } from '@/hooks/useStreamManager';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full flex flex-col gap-2 min-w-0">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10" />
    </div>
  )
});

// PERUBAHAN: Menggunakan initialEpNumber alih-alih initialEp
export default function WatchClient({ slug, initialEpNumber }: { slug: string; initialEpNumber: string | null }) {
  const router = useRouter();

  // Core Data States
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [baseEpisodes, setBaseEpisodes] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]); 
  const [currentEp, setCurrentEp] = useState<string | null>(null);
  const [anilistId, setAnilistId] = useState<number | null>(null);
  const [isTBD, setIsTBD] = useState(false); // STATE BARU UNTUK TBD

  // Player Preferences States
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [activePlayer, setActivePlayer] = useState('artplayer');
  const [isLoaded, setIsLoaded] = useState(false);

  const currentEpData = episodes.find(e => e.id.includes(currentEp || ''));

  // ==========================================
  // ORCHESTRATOR: Stream Manager Hook
  // ==========================================
  const { 
    streamData, 
    loading: loadingStream, 
    availableServers, 
    currentProvider, 
    setCurrentProvider, 
    audioType, 
    setAudioType 
  } = useStreamManager(anilistId, currentEpData?.id, currentEpData?.episode_no);

  // ==========================================
  // SYNC EPISODE METADATA (Gambar & Sinopsis)
  // ==========================================
  useEffect(() => {
    if (baseEpisodes.length === 0 || availableServers.length === 0) return;

    const serverConfig = availableServers.find(s => s.id === 'zoro') || availableServers[0];
    const mwEpList = serverConfig?.rawData?.episodes?.sub || serverConfig?.rawData?.episodes?.dub || [];

    if (mwEpList.length > 0) {
      const mergedEpisodes = baseEpisodes.map((ep: any) => {
        const mwMatch = mwEpList.find((m: any) => m.number === ep.episode_no);
        return {
          ...ep,
          image: mwMatch?.image || ep.image,
          description: mwMatch?.description || ep.description
        };
      });
      setEpisodes(mergedEpisodes);
    }
  }, [baseEpisodes, availableServers]);

  // ==========================================
  // LOCAL STORAGE HYDRATION
  // ==========================================
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('animaple_autoplay');
    const savedAutoSkip = localStorage.getItem('animaple_autoskip');
    const savedAutoNext = localStorage.getItem('animaple_autonext');
    const savedPlayer = localStorage.getItem('animaple_player_type');

    if (savedAutoPlay !== null) setAutoPlay(savedAutoPlay === 'true');
    if (savedAutoSkip !== null) setAutoSkip(savedAutoSkip === 'true');
    if (savedAutoNext !== null) setAutoNext(savedAutoNext === 'true');
    if (savedPlayer) setActivePlayer(savedPlayer);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('animaple_autoplay', String(autoPlay));
      localStorage.setItem('animaple_autoskip', String(autoSkip));
      localStorage.setItem('animaple_autonext', String(autoNext));
      localStorage.setItem('animaple_player_type', activePlayer);
    }
  }, [autoPlay, autoSkip, autoNext, activePlayer, isLoaded]);

  // ==========================================
  // INITIAL DATA FETCHING & TRANSLATOR
  // ==========================================
  useEffect(() => {
    const fetchBaseEpisodes = async () => {
      try {
        const res = await fetch(`${env.api.bowo}/episodes/${slug}`);
        const json = await res.json();
        
        if (json.success) {
          const bowoEpisodes = json.results.episodes;
          setBaseEpisodes(bowoEpisodes);
          setEpisodes(bowoEpisodes); 
          setAnilistId(json.results.anilist_id || null);
          
          if (bowoEpisodes.length > 0) {
            // TRANSLATOR: Ubah episode number dari URL menjadi episode ID
            if (initialEpNumber) {
               const targetEp = bowoEpisodes.find((e: any) => e.episode_no.toString() === initialEpNumber.toString());
               if (targetEp) {
                 setCurrentEp(targetEp.id.split('?ep=')[1]);
               } else {
                 // PERUBAHAN: Jika episode (misal 13) belum ada, cari episode di bawahnya (misal 12)
                 const targetNum = Number(initialEpNumber);
                 const epsBelow = bowoEpisodes.filter((e: any) => Number(e.episode_no) < targetNum);
                 
                 let fallbackEp;
                 if (epsBelow.length > 0) {
                   // Urutkan dari yang terbesar untuk mendapat episode paling dekat (terbaru)
                   epsBelow.sort((a: any, b: any) => Number(b.episode_no) - Number(a.episode_no));
                   fallbackEp = epsBelow[0];
                 } else {
                   // Jika gagal (misal request eps 0), ambil episode terbaru dari semua yang ada
                   const sortedAll = [...bowoEpisodes].sort((a: any, b: any) => Number(b.episode_no) - Number(a.episode_no));
                   fallbackEp = sortedAll[0] || bowoEpisodes[0];
                 }
                 
                 setCurrentEp(fallbackEp.id.split('?ep=')[1]);
                 router.replace(`/watch/${slug}/episode/${fallbackEp.episode_no}`); // Mengganti URL di browser
               }
            } else {
               setCurrentEp(bowoEpisodes[0].id.split('?ep=')[1]);
            }
          } else {
            // LOGIKA TBD: Jika tidak ada episode sama sekali dari API
            setIsTBD(true);
          }
        }
      } catch (error) {
        console.error("[WatchClient] Failed to load episodes:", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    
    fetchBaseEpisodes();
  }, [slug, initialEpNumber, router]);

  // ==========================================
  // HANDLERS
  // ==========================================
  // PERUBAHAN: Menerima epNumber untuk ditempelkan ke URL yang baru
  const handleEpisodeChange = (epId: string, epNumber: string | number) => {
    setCurrentEp(epId);
    router.push(`/watch/${slug}/episode/${epNumber}`, { scroll: false });
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(e => e.id.includes(currentEp || ''));
    const nextEp = episodes[currentIndex + 1];
    if (nextEp) handleEpisodeChange(nextEp.id.split('?ep=')[1], nextEp.episode_no);
  };

  if (loadingInitial) return <LoadingScreen />;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-10 gap-3">
      
      <div className="flex flex-col gap-2 lg:col-span-7 min-w-0 lg:col-start-1 lg:row-start-1">
        <WatchBreadcrumb 
          episodeData={currentEpData} 
          activePlayer={activePlayer} 
          setActivePlayer={setActivePlayer} 
        />

        <VideoPlayer 
          streamData={streamData} 
          loading={loadingStream} 
          episodeData={currentEpData}
          autoPlay={autoPlay}
          autoSkip={autoSkip}
          autoNext={autoNext}
          onNextEpisode={handleNextEpisode}
          activePlayer={activePlayer} 
          isTBD={isTBD} // PROPS BARU UNTUK TBD
        />
        
        <WatchControls 
           currentEpIndex={episodes.findIndex(e => e.id.includes(currentEp || ''))}
           totalEpisodes={episodes.length}
           onPrev={() => {
              const prev = episodes[episodes.findIndex(e => e.id.includes(currentEp || '')) - 1];
              if (prev) handleEpisodeChange(prev.id.split('?ep=')[1], prev.episode_no);
           }}
           onNext={handleNextEpisode}
           autoPlay={autoPlay} setAutoPlay={setAutoPlay}
           autoSkip={autoSkip} setAutoSkip={setAutoSkip}
           autoNext={autoNext} setAutoNext={setAutoNext}
        />
      </div>

      <div className="flex flex-col gap-1 lg:col-span-7 min-w-0 lg:col-start-1 lg:row-start-2 -mt-2">
        <ServerSelector 
          availableServers={availableServers}
          currentProvider={currentProvider}
          setCurrentProvider={setCurrentProvider}
          audioType={audioType}
          setAudioType={setAudioType}
          currentEpisodeNumber={currentEpData?.episode_no}
          episodeData={currentEpData} 
        />

        <div className="w-full mt-2 flex justify-center items-center overflow-hidden rounded-xl bg-[#0F0F0F] border border-[#2A2A2E] min-h-[90px]">
           <AdsterraBanner />
        </div>

        <div className="hidden lg:block mt-2 p-4 rounded-xl bg-[#0F0F0F] border border-[#2A2A2E]">
          <h2 className="text-lg font-bold mb-2 text-white">Anime Information</h2>
          <p className="text-sm text-[#8C8C8C]">Details, synopsis, and other info can be placed here.</p>
        </div>
      </div>

      <div className="flex flex-col lg:col-span-3 min-w-0 lg:col-start-8 lg:row-start-1 relative">
        <div className="w-full lg:absolute lg:inset-0">
          <EpisodeList 
            episodes={episodes} 
            currentEp={currentEp} 
            onSelectEpisode={handleEpisodeChange} 
          />
        </div>
      </div>

      <div className="block lg:hidden w-full mt-1 p-4 rounded-xl bg-[#0F0F0F] border border-[#2A2A2E] lg:col-span-10">
        <h2 className="text-lg font-bold mb-2 text-white">Anime Information</h2>
        <p className="text-sm text-[#8C8C8C]">Details, synopsis, and other info can be placed here.</p>
      </div>

    </div>
  );
}