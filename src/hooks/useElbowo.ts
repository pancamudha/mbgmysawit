import { useState, useCallback } from 'react';
import { env } from '@/config/env';

export const useElbowo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the streaming data and available servers from Elbowo.
   * @param episodeId - The full episode ID (e.g., overflow-uncensored-17884?ep=79462)
   * @param server - The target server string (default: 'hd-1')
   * @param type - The audio type: 'sub' | 'dub' | 'raw'
   */
  const fetchStream = useCallback(async (
    episodeId: string, 
    server: string = 'hd-1', 
    type: string = 'sub'
  ) => {
    setLoading(true);
    setError(null);
    try {
      // PERBAIKAN: Jangan gunakan URLSearchParams. Langsung rakit string
      // agar karakter '?ep=' tidak di-encode menjadi '%3Fep%3D' yang bikin server error.
      const url = `${env.api.elbowo}/stream?id=${episodeId}&server=${server}&type=${type}`;
      
      console.log('[useElbowo] Fetching fallback URL:', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Elbowo API Error: ${response.status}`);
      
      const data = await response.json();
      
      if (!data.success || !data.results) {
        throw new Error('Elbowo API returned unsuccessful payload.');
      }
      
      return data.results;
    } catch (err: any) {
      console.error('[useElbowo] Failed to fetch stream:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchStream,
    loading,
    error
  };
};