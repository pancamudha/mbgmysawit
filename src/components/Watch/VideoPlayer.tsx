"use client";
import React, { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Plyr from 'plyr';
import videojs from 'video.js';
import Hls from 'hls.js';

import 'plyr/dist/plyr.css';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  streamData: any;
  loading: boolean;
  episodeData: any;
  autoPlay?: boolean;
  autoSkip?: boolean;
  autoNext?: boolean;
  onNextEpisode?: () => void;
  activePlayer: string; // Menerima state player dari parent
}

export default function VideoPlayer({ 
  streamData, 
  loading, 
  episodeData, 
  autoPlay, 
  autoSkip, 
  autoNext, 
  onNextEpisode,
  activePlayer 
}: VideoPlayerProps) {
  
  const artRef = useRef<HTMLDivElement>(null);
  const plyrRef = useRef<HTMLVideoElement>(null);
  const vjsRef = useRef<HTMLDivElement>(null);
  const vjsPlayerRef = useRef<any>(null);

  const hasSkippedIntroRef = useRef(false);
  const hasTriggeredNextRef = useRef(false);

  const m3u8Url = streamData?.streamingLink?.link?.file;
  const proxyUrl = m3u8Url ? `https://stream.animeparadise.moe/m3u8?url=${m3u8Url}` : '';
  const iframeUrl = streamData?.streamingLink?.iframe;
  const tracks = streamData?.streamingLink?.tracks || [];
  
  const intro = streamData?.streamingLink?.intro;
  const outro = streamData?.streamingLink?.outro;

  useEffect(() => {
    hasSkippedIntroRef.current = false;
    hasTriggeredNextRef.current = false;
  }, [streamData]);

  // ==========================================
  // 1. ARTPLAYER INTEGRATION
  // ==========================================
  useEffect(() => {
    if (activePlayer !== 'artplayer' || !artRef.current || !proxyUrl || loading) return;

    const captionTracks = tracks.filter((t: any) => t.kind === 'captions');
    const defaultTrack = captionTracks.find((t: any) => t.default) || captionTracks[0];

    // BENAR-BENAR DEFAULT SESUAI PERMINTAAN
    const art = new Artplayer({
      container: artRef.current,
      url: proxyUrl,
      type: 'm3u8',
      theme: '#ffbaba', 
      title: episodeData?.title || 'Episode',
      poster: episodeData?.thumbnail || '',
      volume: 1,
      pip: true,
      autoplay: autoPlay,
      autoSize: false, 
      autoMini: false,
      setting: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      
      customType: {
        m3u8: function (video, url, art) {
          if (Hls.isSupported()) {
            const hls = new Hls({ debug: false });
            hls.loadSource(url);
            hls.attachMedia(video);
            art.on('destroy', () => hls.destroy());
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          }
        },
      },
    });

    art.on('video:timeupdate', () => {
       const t = art.currentTime;
       if (autoSkip && intro && intro.end > 0 && !hasSkippedIntroRef.current) {
          if (t >= intro.start && t < intro.end) {
             art.currentTime = intro.end;
             hasSkippedIntroRef.current = true;
             art.notice.show = 'Intro Skipped';
          }
       }
       if (autoNext && outro && outro.start > 0 && onNextEpisode && !hasTriggeredNextRef.current) {
          if (t >= outro.start) {
             hasTriggeredNextRef.current = true;
             onNextEpisode();
          }
       }
    });

    art.on('video:ended', () => {
       if (autoNext && onNextEpisode && !hasTriggeredNextRef.current) {
          hasTriggeredNextRef.current = true;
          onNextEpisode();
       }
    });

    return () => { if (art && art.destroy) art.destroy(false); };
  }, [activePlayer, proxyUrl, loading, autoPlay, autoSkip, autoNext, intro, outro, onNextEpisode, episodeData, tracks]);

  // ==========================================
  // 2. PLYR INTEGRATION
  // ==========================================
  useEffect(() => {
    if (activePlayer !== 'plyr' || !plyrRef.current || !proxyUrl || loading) return;

    const video = plyrRef.current;
    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(proxyUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxyUrl;
    }

    const player = new Plyr(video, {
      autoplay: autoPlay,
      captions: { active: true, update: true },
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    });

    player.on('timeupdate', (event) => {
       const t = event.detail.plyr.currentTime;
       if (autoSkip && intro && intro.end > 0 && !hasSkippedIntroRef.current) {
          if (t >= intro.start && t < intro.end) {
             event.detail.plyr.currentTime = intro.end;
             hasSkippedIntroRef.current = true;
          }
       }
       if (autoNext && outro && outro.start > 0 && onNextEpisode && !hasTriggeredNextRef.current) {
          if (t >= outro.start) {
             hasTriggeredNextRef.current = true;
             onNextEpisode();
          }
       }
    });

    player.on('ended', () => {
       if (autoNext && onNextEpisode && !hasTriggeredNextRef.current) {
          hasTriggeredNextRef.current = true;
          onNextEpisode();
       }
    });

    return () => {
      if (hls) hls.destroy();
      if (player) player.destroy();
    };
  }, [activePlayer, proxyUrl, loading, autoPlay, autoSkip, autoNext, intro, outro, onNextEpisode]);

  // ==========================================
  // 3. VIDEO.JS INTEGRATION
  // ==========================================
  useEffect(() => {
    if (activePlayer !== 'videojs' || !vjsRef.current || !proxyUrl || loading) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add('vjs-big-play-centered');
    vjsRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      controls: true,
      autoplay: autoPlay,
      preload: 'auto',
      fluid: true,
      sources: [{ src: proxyUrl, type: 'application/x-mpegURL' }],
    });

    player.on('timeupdate', () => {
       const t = player.currentTime() as number;
       if (autoSkip && intro && intro.end > 0 && !hasSkippedIntroRef.current) {
          if (t >= intro.start && t < intro.end) {
             player.currentTime(intro.end);
             hasSkippedIntroRef.current = true;
          }
       }
       if (autoNext && outro && outro.start > 0 && onNextEpisode && !hasTriggeredNextRef.current) {
          if (t >= outro.start) {
             hasTriggeredNextRef.current = true;
             onNextEpisode();
          }
       }
    });

    player.on('ended', () => {
       if (autoNext && onNextEpisode && !hasTriggeredNextRef.current) {
          hasTriggeredNextRef.current = true;
          onNextEpisode();
       }
    });

    vjsPlayerRef.current = player;

    return () => {
      if (vjsPlayerRef.current) {
        vjsPlayerRef.current.dispose();
        vjsPlayerRef.current = null;
      }
    };
  }, [activePlayer, proxyUrl, loading, autoPlay, autoSkip, autoNext, intro, outro, onNextEpisode]);

  return (
    <div className="w-full flex flex-col gap-0 min-w-0">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
        
        {loading || (!proxyUrl && !iframeUrl) ? (
          <div className="absolute inset-0 w-full h-full outline-none z-10 bg-black" />
        ) : (
          <>
            {activePlayer === 'artplayer' && proxyUrl && (
              <div ref={artRef} className="absolute inset-0 w-full h-full outline-none z-10 bg-black" />
            )}
            
            {activePlayer === 'plyr' && proxyUrl && (
              <div className="absolute inset-0 w-full h-full outline-none z-10 bg-black">
                <video ref={plyrRef} crossOrigin="anonymous" playsInline poster={episodeData?.thumbnail || ''} className="w-full h-full">
                  {tracks.map((track: any, idx: number) => (
                    track.kind === "captions" && (
                      <track key={idx} kind="captions" label={track.label} srcLang={track.label.substring(0,2).toLowerCase()} src={track.file} default={track.default} />
                    )
                  ))}
                </video>
              </div>
            )}

            {activePlayer === 'videojs' && proxyUrl && (
              <div ref={vjsRef} className="absolute inset-0 w-full h-full outline-none z-10 bg-black [&>div]:w-full [&>div]:h-full" />
            )}

            {/* IFRAME INTEGRATION */}
            {activePlayer === 'iframe' && iframeUrl && (
              <iframe 
                src={iframeUrl} 
                className="absolute inset-0 w-full h-full border-none outline-none z-10 bg-black" 
                allowFullScreen 
                allow="autoplay; fullscreen" 
              />
            )}
            
            {/* Fallback jika URL untuk player yang dipilih tidak ada */}
            {activePlayer !== 'iframe' && !proxyUrl && iframeUrl && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0B] text-[#8C8C8C] text-sm text-center px-4 z-50">
                 <p className="mb-2">HLS Stream is currently unavailable.</p>
               </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}