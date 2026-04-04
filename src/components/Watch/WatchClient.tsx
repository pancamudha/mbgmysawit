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

export default function WatchClient({ slug, initialEp }: { slug: string; initialEp: string | null }) {
  const router = useRouter();

  // Core Data States
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [baseEpisodes, setBaseEpisodes] = useState<any[]>([]); // Untuk menyimpan data asli dari bowo
  const [episodes, setEpisodes] = useState<any[]>([]); // Yang dirender ke UI (sudah dimerge dengan MW)
  const [currentEp, setCurrentEp] = useState<string | null>(initialEp);
  const [anilistId, setAnilistId] = useState<number | null>(null);

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

    // Cari server Zoro (paling lengkap gambarnya) atau fallback ke server pertama
    const serverConfig = availableServers.find(s => s.id === 'zoro') || availableServers[0];
    
    // Ambil list episode dari rawData (biasanya ada di properti 'sub' atau 'dub')
    const mwEpList = serverConfig?.rawData?.episodes?.sub || serverConfig?.rawData?.episodes?.dub || [];

    if (mwEpList.length > 0) {
      const mergedEpisodes = baseEpisodes.map((ep: any) => {
        // Cocokkan berdasarkan nomor episode
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
  // INITIAL DATA FETCHING
  // ==========================================
  useEffect(() => {
    const fetchBaseEpisodes = async () => {
      try {
        const res = await fetch(`${env.api.bowo}/episodes/${slug}`);
        const json = await res.json();
        
        if (json.success) {
          const bowoEpisodes = json.results.episodes;
          setBaseEpisodes(bowoEpisodes);
          setEpisodes(bowoEpisodes); // Set awal sebelum dimerge
          setAnilistId(json.results.anilist_id || null);
          
          if (!initialEp && bowoEpisodes.length > 0) {
            setCurrentEp(bowoEpisodes[0].id.split('?ep=')[1]);
          }
        }
      } catch (error) {
        console.error("[WatchClient] Failed to load episodes:", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    
    fetchBaseEpisodes();
  }, [slug, initialEp]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleEpisodeChange = (epId: string) => {
    setCurrentEp(epId);
    router.push(`/watch/${slug}?ep=${epId}`, { scroll: false });
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(e => e.id.includes(currentEp || ''));
    const nextEp = episodes[currentIndex + 1];
    if (nextEp) handleEpisodeChange(nextEp.id.split('?ep=')[1]);
  };

  if (loadingInitial) return <LoadingScreen />;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-10 gap-3">
      
      {/* LEFT COLUMN: Video & Controls */}
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
        />
        
        <WatchControls 
           currentEpIndex={episodes.findIndex(e => e.id.includes(currentEp || ''))}
           totalEpisodes={episodes.length}
           onPrev={() => {
              const prev = episodes[episodes.findIndex(e => e.id.includes(currentEp || '')) - 1];
              if (prev) handleEpisodeChange(prev.id.split('?ep=')[1]);
           }}
           onNext={handleNextEpisode}
           autoPlay={autoPlay} setAutoPlay={setAutoPlay}
           autoSkip={autoSkip} setAutoSkip={setAutoSkip}
           autoNext={autoNext} setAutoNext={setAutoNext}
        />
      </div>

      {/* LEFT COLUMN BOTTOM: Server Selector & Ads */}
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

      {/* RIGHT COLUMN: Episode List */}
      <div className="flex flex-col lg:col-span-3 min-w-0 lg:col-start-8 lg:row-start-1 relative">
        <div className="w-full lg:absolute lg:inset-0">
          <EpisodeList 
            episodes={episodes} 
            currentEp={currentEp} 
            onSelectEpisode={handleEpisodeChange} 
          />
        </div>
      </div>

      {/* MOBILE ANIME INFORMATION */}
      <div className="block lg:hidden w-full mt-1 p-4 rounded-xl bg-[#0F0F0F] border border-[#2A2A2E] lg:col-span-10">
        <h2 className="text-lg font-bold mb-2 text-white">Anime Information</h2>
        <p className="text-sm text-[#8C8C8C]">Details, synopsis, and other info can be placed here.</p>
      </div>

    </div>
  );
}