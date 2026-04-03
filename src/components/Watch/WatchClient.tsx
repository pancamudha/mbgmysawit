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
  
  // STATE BARU UNTUK MAPLEWATCH
  const [mwData, setMwData] = useState<any>(null);
  const [currentProvider, setCurrentProvider] = useState<string>('zoro'); // Default
  const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');
  
  const [streamData, setStreamData] = useState<any>(null);
  const [loadingStream, setLoadingStream] = useState(false);

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
          let bowoEpisodes = json.results.episodes;
          
          setEpisodes(bowoEpisodes);
          
          if (!initialEp && bowoEpisodes.length > 0) {
            const firstEp = bowoEpisodes[0].id.split('?ep=')[1];
            setCurrentEp(firstEp);
          }

          const anilistId = json.results.anilist_id;

          if (anilistId) {
            try {
              const mwRes = await fetch(`https://maplewatch.vercel.app/episodes/${anilistId}`);
              
              if (mwRes.ok) {
                const mwJson = await mwRes.json();
                
                // Simpan raw data dari maplewatch untuk digunakan ServerSelector & VideoPlayer
                setMwData(mwJson.providers);
                
                // Pilih provider default yang tersedia
                const availableProviders = Object.keys(mwJson.providers || {}).filter(k => 
                  mwJson.providers[k]?.episodes?.sub?.length > 0 || mwJson.providers[k]?.episodes?.dub?.length > 0
                );
                const defaultProv = availableProviders.includes('zoro') ? 'zoro' : (availableProviders[0] || 'zoro');
                setCurrentProvider(defaultProv);

                // DITAMBAHKAN: Atur audio default dengan cerdas jika server tidak punya 'sub'
                const hasSub = mwJson.providers[defaultProv]?.episodes?.sub?.length > 0;
                const hasDub = mwJson.providers[defaultProv]?.episodes?.dub?.length > 0;
                setAudioType(hasSub ? 'sub' : (hasDub ? 'dub' : 'sub'));

                const mwEpisodesList = mwJson.providers?.[defaultProv]?.episodes?.sub || mwJson.providers?.[defaultProv]?.episodes?.dub || [];
                
                if (mwEpisodesList.length > 0) {
                  const mergedEpisodes = bowoEpisodes.map((ep: any) => {
                    const mwMatch = mwEpisodesList.find((m: any) => m.number === ep.episode_no);
                    return {
                      ...ep,
                      image: mwMatch?.image || ep.image,
                      description: mwMatch?.description || ep.description
                    };
                  });
                  setEpisodes(mergedEpisodes);
                }
              }
            } catch (mwError) {
              console.error("Gagal melakukan sinkronisasi dengan Maplewatch", mwError);
            }
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
    if (!currentEp || !mwData || !currentProvider) return;

    const fetchStreamData = async () => {
      setLoadingStream(true);
      try {
        const currentEpDataLocal = episodes.find(e => e.id.includes(currentEp || ''));
        const epNumber = currentEpDataLocal?.episode_no;
        
        // Cari id spesifik maplewatch (contoh: watch/zoro/182255/sub/zoro-1)
        const maplewatchEp = mwData[currentProvider]?.episodes[audioType]?.find((e: any) => e.number === epNumber);

        if (maplewatchEp && maplewatchEp.id) {
          const streamUrl = `https://maplewatch.vercel.app/${maplewatchEp.id}`;
          const res = await fetch(streamUrl);
          const json = await res.json();

          // Maplewatch membalas dengan key dinamis ssub/sdub, ambil object pertama
          const streamObj = Object.values(json)[0];
          setStreamData(streamObj);
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
  }, [currentEp, currentProvider, audioType, mwData, episodes]);

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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-10 gap-3">
      
      {/* KOLOM KIRI ATAS (Breadcrumb, Video, Controls) */}
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
          currentProvider={currentProvider} // DITAMBAHKAN: Mengoper status provider saat ini
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

      {/* KOLOM KIRI BAWAH (Server, Ads, Info) */}
      <div className="flex flex-col gap-1 lg:col-span-7 min-w-0 lg:col-start-1 lg:row-start-2 -mt-2">
        <ServerSelector 
          mwData={mwData}
          providersList={Object.keys(mwData || {}).filter(k => mwData[k]?.episodes?.sub?.length > 0 || mwData[k]?.episodes?.dub?.length > 0)}
          currentProvider={currentProvider}
          setCurrentProvider={setCurrentProvider}
          audioType={audioType}
          setAudioType={setAudioType}
          currentEpisodeNumber={currentEpData?.episode_no}
          episodeData={currentEpData} 
        />

        <div className="w-full mt-2 sm:mt-2 flex justify-center items-center overflow-hidden rounded-xl bg-[#0F0F0F] border border-[#2A2A2E] min-h-[90px] relative z-20">
           <AdsterraBanner />
        </div>

        {/* ANIME INFORMATION (VERSI DESKTOP) */}
        <div className="hidden lg:block mt-2 p-4 rounded-xl bg-[#0F0F0F] border border-[#2A2A2E]">
          <h2 className="text-lg font-bold mb-2 text-white">Anime Information</h2>
          <p className="text-sm text-[#8C8C8C]">
            Details, synopsis, and other info can be placed here.
          </p>
        </div>
      </div>

      {/* KOLOM KANAN - EPISODE LIST */}
      <div className="flex flex-col lg:col-span-3 min-w-0 lg:col-start-8 lg:row-start-1 relative">
        <div className="w-full lg:absolute lg:inset-0">
          <EpisodeList 
            episodes={episodes} 
            currentEp={currentEp} 
            onSelectEpisode={handleEpisodeChange} 
          />
        </div>
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