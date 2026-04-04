import { useState, useEffect } from 'react';
import { useMaplewatch } from './useMaplewatch';
import { useElbowo } from './useElbowo';
import { env } from '@/config/env';

export interface NormalizedServer {
  id: string;
  name: string;
  audios: string[];
  rawData?: any;
}

export interface NormalizedStream {
  m3u8Url: string;
  proxyUrl: string;
  iframeUrl: string;
  subtitles: any[];
  intro: { start: number; end: number };
  outro: { start: number; end: number };
}

export const useStreamManager = (anilistId: number | null, episodeId: string | undefined, episodeNumber: number | undefined) => {
  const { fetchProviders: fetchMwProviders, fetchStream: fetchMwStream, loading: mwLoading } = useMaplewatch();
  const { fetchStream: fetchElbStream, loading: elbLoading } = useElbowo();

  const [source, setSource] = useState<'maplewatch' | 'elbowo'>('maplewatch');
  const [streamData, setStreamData] = useState<NormalizedStream | null>(null);

  const [availableServers, setAvailableServers] = useState<NormalizedServer[]>([]);
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [audioType, setAudioType] = useState<string>('sub');

  const [managerLoading, setManagerLoading] = useState(false);
  
  // STATE BARU: Memicu fallback darurat ke Elbowo jika Stream Maplewatch kosong
  const [forceElbowo, setForceElbowo] = useState<boolean>(false);

  // Reset status fallback saat Mas Ofik pindah episode
  useEffect(() => {
    setForceElbowo(false);
  }, [episodeId]);

  // ==========================================
  // PHASE 1: Determine Source & Fetch Available Servers
  // ==========================================
  useEffect(() => {
    if (!episodeId || episodeNumber === undefined) return;

    const initializeProviders = async () => {
      setManagerLoading(true);
      setStreamData(null);
      setAvailableServers([]); 
      
      console.log(`[StreamManager] Initialization started. AniList ID: ${anilistId}, Episode ID: ${episodeId}`);

      // Attempt 1: Maplewatch (Hanya jalan jika forceElbowo = false)
      if (anilistId && !forceElbowo) {
        console.log('[StreamManager] Attempting to fetch from Maplewatch...');
        const mwProviders = await fetchMwProviders(anilistId);
        
        if (mwProviders && Object.keys(mwProviders).length > 0) {
          const servers: NormalizedServer[] = Object.keys(mwProviders).map(key => {
            const prov = mwProviders[key];
            const audios = [];
            if (prov.episodes?.sub?.length > 0) audios.push('sub');
            if (prov.episodes?.dub?.length > 0) audios.push('dub');
            return { id: key, name: key, audios, rawData: prov };
          }).filter(s => s.audios.length > 0);

          if (servers.length > 0) {
            console.log('[StreamManager] Maplewatch SUCCESS. Found servers:', servers);
            setSource('maplewatch'); 
            setAvailableServers(servers);
            setCurrentProvider(servers.find(s => s.id === 'zoro') ? 'zoro' : servers[0].id);
            setAudioType(servers[0].audios.includes('sub') ? 'sub' : servers[0].audios[0]);
            setManagerLoading(false);
            return; 
          }
        } 
      }
      
      // Attempt 2: Fallback to Elbowo (Dieksekusi jika Maplewatch kosong ATAU forceElbowo menyala)
      console.log('[StreamManager] FALLBACK TRIGGERED! Switching to Elbowo...');
      setSource('elbowo');
      const elbData = await fetchElbStream(episodeId, 'hd-1', 'sub');
      
      if (elbData && elbData.servers) {
         const serverMap = new Map<string, Set<string>>();
         
         elbData.servers.forEach((s: any) => {
           const sName = s.serverName.toLowerCase();
           if (!serverMap.has(sName)) serverMap.set(sName, new Set());
           serverMap.get(sName)!.add(s.type);
         });

         const servers: NormalizedServer[] = Array.from(serverMap.entries()).map(([id, audiosSet]) => ({
           id,
           name: id.toUpperCase(),
           audios: Array.from(audiosSet)
         }));

         if (servers.length > 0) {
           console.log('[StreamManager] Elbowo SUCCESS. Found servers:', servers);
           setAvailableServers(servers);
           setCurrentProvider(servers.find(s => s.id === 'hd-1') ? 'hd-1' : servers[0].id);
           setAudioType(servers[0].audios.includes('sub') ? 'sub' : servers[0].audios[0]);
         }
      } 
      
      setManagerLoading(false);
    };

    initializeProviders();
  }, [anilistId, episodeId, episodeNumber, forceElbowo]); 

  // ==========================================
  // PHASE 2: Fetch Active Stream Data & Inject Proxies
  // ==========================================
  useEffect(() => {
    if (!episodeId || !currentProvider || !audioType || availableServers.length === 0) return;

    const getStream = async () => {
      setManagerLoading(true);
      
      try {
        if (source === 'maplewatch') {
          console.log(`[StreamManager] Fetching Maplewatch Stream: Server [${currentProvider}] Audio [${audioType}]`);
          const serverConfig = availableServers.find(s => s.id === currentProvider);
          const mwEpList = serverConfig?.rawData?.episodes[audioType];
          const mwEp = mwEpList?.find((e: any) => e.number === episodeNumber);

          if (mwEp && mwEp.id) {
            // Ditambahkan : any agar TypeScript aman
            const rawStream: any = await fetchMwStream(mwEp.id);
            const hlsStream = rawStream?.streams?.find((s: any) => s.type === 'hls');
            const embedStream = rawStream?.streams?.find((s: any) => s.type === 'embed');

            // LOGIKA BARU: Jika Maplewatch memberi Harapan Palsu (kosong), tending ke Elbowo!
            if (!hlsStream?.url && !embedStream?.url) {
              console.warn(`[StreamManager] Warning: Maplewatch server '${currentProvider}' returned an empty video stream. Triggering emergency fallback to Elbowo...`);
              setForceElbowo(true);
              return;
            }
              
            setStreamData({
              m3u8Url: hlsStream?.url || '',
              proxyUrl: hlsStream?.url ? `${env.proxy.fourAnimo}?url=${encodeURIComponent(hlsStream.url)}` : '',
              iframeUrl: embedStream?.url || '',
              subtitles: rawStream.subtitles || [],
              intro: rawStream.intro || { start: 0, end: 0 },
              outro: rawStream.outro || { start: 0, end: 0 }
            });
          } else {
             // Jika episode spesifik tidak ditemukan di provider tersebut
             console.warn(`[StreamManager] Episode missing on Maplewatch server '${currentProvider}'. Triggering emergency fallback...`);
             setForceElbowo(true);
             return;
          }
        } 
        else if (source === 'elbowo') {
          console.log(`[StreamManager] Fetching Elbowo Stream: Server [${currentProvider}] Audio [${audioType}]`);
          const rawStream = await fetchElbStream(episodeId, currentProvider, audioType);
          
          if (rawStream?.streamingLink?.length > 0) {
            const streamLink = rawStream.streamingLink[0];
            setStreamData({
                m3u8Url: streamLink.link || '',
                proxyUrl: streamLink.link ? `${env.proxy.elbowo}?url=${encodeURIComponent(streamLink.link)}` : '',
                iframeUrl: streamLink.iframe || '',
                subtitles: rawStream.tracks || [],
                intro: rawStream.intro || { start: 0, end: 0 },
                outro: rawStream.outro || { start: 0, end: 0 }
            });
          } else {
             setStreamData(null);
          }
        }
      } catch (error) {
        console.error("[StreamManager] Failed to fetch streaming link:", error);
        // Jika fetch Maplewatch error/timeout, langsung tendang ke Elbowo
        if (source === 'maplewatch') {
            setForceElbowo(true);
        } else {
            setStreamData(null);
        }
      } finally {
        setManagerLoading(false);
      }
    };

    getStream();
  }, [source, episodeId, episodeNumber, currentProvider, audioType, availableServers]);

  return {
    streamData,
    loading: managerLoading || mwLoading || elbLoading,
    source,
    availableServers,
    currentProvider,
    setCurrentProvider,
    audioType,
    setAudioType
  };
};