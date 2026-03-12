"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import EpisodeList from './EpisodeList';
import ServerSelector from './ServerSelector';
import WatchControls from './WatchControls';
import WatchBreadcrumb from './WatchBreadcrumb';
import LoadingScreen from '@/components/LoadingScreen';

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

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEp, setCurrentEp] = useState<string | null>(initialEp);
  
  const [streamData, setStreamData] = useState<any>(null);
  const [loadingStream, setLoadingStream] = useState(false);
  
  const [servers, setServers] = useState<any[]>([]);
  const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');
  const [currentServer, setCurrentServer] = useState<string>('hd-1');

  // STATE UNTUK KONTROL PLAYER
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  
  // STATE UNTUK PEMILIHAN PLAYER (DARI BREADCRUMB KE VIDEOPLAYER)
  const [activePlayer, setActivePlayer] = useState('artplayer');
  const [isLoadedPlayer, setIsLoadedPlayer] = useState(false);

  // Flag pelindung agar localStorage tidak tertimpa saat render pertama
  const [isLoaded, setIsLoaded] = useState(false);

  // =======================================================
  // 1. Baca pengaturan yang tersimpan HANYA SAAT MOUNTING
  // =======================================================
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('animaple_autoplay');
    const savedAutoSkip = localStorage.getItem('animaple_autoskip');
    const savedAutoNext = localStorage.getItem('animaple_autonext');
    const savedPlayer = localStorage.getItem('animaple_player_type');

    if (savedAutoPlay !== null) setAutoPlay(savedAutoPlay === 'true');
    if (savedAutoSkip !== null) setAutoSkip(savedAutoSkip === 'true');
    if (savedAutoNext !== null) setAutoNext(savedAutoNext === 'true');
    if (savedPlayer) setActivePlayer(savedPlayer);
    
    // Izinkan penyimpanan setelah proses baca memori selesai
    setIsLoaded(true);
    setIsLoadedPlayer(true);
  }, []);

  // =======================================================
  // 2. Simpan pengaturan HANYA JIKA proses baca sudah selesai
  // =======================================================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('animaple_autoplay', String(autoPlay));
      localStorage.setItem('animaple_autoskip', String(autoSkip));
      localStorage.setItem('animaple_autonext', String(autoNext));
    }
  }, [autoPlay, autoSkip, autoNext, isLoaded]);

  useEffect(() => {
    if (isLoadedPlayer) {
      localStorage.setItem('animaple_player_type', activePlayer);
    }
  }, [activePlayer, isLoadedPlayer]);


  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(`https://bowotheexplorer.vercel.app/api/episodes/${slug}`);
        const json = await res.json();
        if (json.success) {
          setEpisodes(json.results.episodes);
          if (!initialEp && json.results.episodes.length > 0) {
            const firstEp = json.results.episodes[0].id.split('?ep=')[1];
            setCurrentEp(firstEp);
          }
        }
      } catch (error) {
        console.error("Gagal memuat episode", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchEpisodes();
  }, [slug, initialEp]);

  useEffect(() => {
    if (!currentEp) return;

    const fetchStreamData = async () => {
      setLoadingStream(true);
      try {
        const streamUrl = `https://bowotheexplorer.vercel.app/api/stream?id=${slug}?ep=${currentEp}&server=${currentServer}&type=${audioType}`;
        const res = await fetch(streamUrl);
        const json = await res.json();

        if (json.success) {
          setStreamData(json.results);
          if (json.results.servers) {
             setServers(json.results.servers);
          }
        } else {
          setStreamData(null);
        }
      } catch (error) {
        console.error("Gagal memuat stream", error);
        setStreamData(null);
      } finally {
        setLoadingStream(false);
      }
    };

    fetchStreamData();
  }, [slug, currentEp, currentServer, audioType]);

  const handleEpisodeChange = (epId: string) => {
    setCurrentEp(epId);
    router.push(`/watch/${slug}?ep=${epId}`, { scroll: false });
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(e => e.id.includes(currentEp || ''));
    const nextEp = episodes[currentIndex + 1];
    if (nextEp) {
      handleEpisodeChange(nextEp.id.split('?ep=')[1]);
    }
  };

  if (loadingInitial) return <LoadingScreen />;

  const currentEpData = episodes.find(e => e.id.includes(currentEp || ''));

  return (
    // FITUR DIPERBAIKI: Menggunakan grid-cols-10 agar gap-3 tidak membuat elemen meluber melebihi 100% width
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-10 gap-3">
      
      {/* KOLOM KIRI (7 PORSI DI DESKTOP, PENUH DI HP) */}
      <div className="flex flex-col gap-1 lg:col-span-7 min-w-0">
        
        <div className="flex flex-col gap-2">
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

        <ServerSelector 
          servers={servers} 
          audioType={audioType}
          setAudioType={setAudioType}
          currentServer={currentServer}
          setCurrentServer={setCurrentServer}
          currentEpisodeNumber={currentEpData?.episode_no}
          episodeData={currentEpData} 
        />

        {/* ANIME INFORMATION (VERSI DESKTOP) */}
        <div className="hidden lg:block mt-2 p-4 rounded-xl bg-[#0F0F0F] border border-[#2A2A2E]">
          <h2 className="text-lg font-bold mb-2 text-white">Anime Information</h2>
          <p className="text-sm text-[#8C8C8C]">
            Details, synopsis, and other info can be placed here.
          </p>
        </div>
      </div>

      {/* KOLOM KANAN - EPISODE LIST (3 PORSI DI DESKTOP, PENUH DI HP) */}
      <div className="flex flex-col lg:col-span-3 min-w-0">
        <EpisodeList 
          episodes={episodes} 
          currentEp={currentEp} 
          onSelectEpisode={handleEpisodeChange} 
        />
      </div>

      {/* ANIME INFORMATION (VERSI MOBILE) */}
      <div className="block lg:hidden w-full mt-1 p-4 rounded-xl bg-[#0F0F0F] border border-[#2A2A2E] lg:col-span-10">
        <h2 className="text-lg font-bold mb-2 text-white">Anime Information</h2>
        <p className="text-sm text-[#8C8C8C]">
          Details, synopsis, and other info can be placed here.
        </p>
      </div>

    </div>
  );
}