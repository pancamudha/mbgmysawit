import { env } from '@/config/env';

const API_BASE_URL = env.api.bowo;
// Catatan: Secret key biarkan pakai process.env karena ini data sensitif (bukan URL)
const SECRET_KEY = process.env.ANIMAPLE_SECRET_KEY || process.env.NEXT_PUBLIC_ANIMAPLE_SECRET_KEY;

export async function fetchApi(endpoint: string) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'x-animaple-key': SECRET_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Fetch API] Error:", error);
    return null;
  }
}

export async function getAnilistTrailer(anilistId: string | number) {
  if (!anilistId) return [];

  const query = `
    query ($id: Int) {
      Media (id: $id) {
        trailer {
          id
          site
          thumbnail
        }
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { id: parseInt(anilistId as string) }
      }),
      next: { revalidate: 86400 }
    });

    const result = await res.json();
    const trailer = result?.data?.Media?.trailer;

    if (trailer && trailer.site === "youtube") {
      return [{
        title: "Official Trailer (AniList Sync)",
        url: `https://www.youtube.com/embed/${trailer.id}?rel=0`,
        thumbnail: trailer.thumbnail || `https://img.youtube.com/vi/${trailer.id}/hqdefault.jpg`
      }];
    }
  } catch (error) {
    console.error("Failed to retrieve trailer data from AniList:", error);
  }

  return [];
}

export async function getAnilistCharacters(anilistId: string | number) {
  if (!anilistId) return [];

  const query = `
    query ($id: Int) {
      Media (id: $id) {
        characters (sort: [ROLE, RELEVANCE, ID], perPage: 100) {
          edges {
            role
            node {
              id
              name { full }
              image { large }
            }
            voiceActors (language: JAPANESE) {
              id
              name { full }
              image { large }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { id: parseInt(anilistId as string) }
      }),
      next: { revalidate: 86400 }
    });

    const result = await res.json();
    const edges = result?.data?.Media?.characters?.edges || [];

    return edges.map((edge: any) => {
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
  } catch (error) {
    console.error("Failed to retrieve character data from AniList:", error);
  }

  return [];
}

export async function getMalTrailer(malId: string | number) {
  if (!malId) return [];

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`, {
      next: { revalidate: 86400 }
    });
    
    const result = await res.json();
    const trailer = result?.data?.trailer;

    if (trailer && trailer.youtube_id) {
      return [{
        title: "Official Trailer (MAL Sync)",
        url: `https://www.youtube.com/embed/${trailer.youtube_id}?rel=0`,
        thumbnail: trailer.images?.maximum_image_url || `https://img.youtube.com/vi/${trailer.youtube_id}/hqdefault.jpg`
      }];
    }
  } catch (error) {
    console.error("Failed to retrieve trailer data from MyAnimeList:", error);
  }

  return [];
}

export async function getMalCharacters(malId: string | number) {
  if (!malId) return [];

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/characters`, {
      next: { revalidate: 86400 }
    });
    
    const result = await res.json();
    const data = result?.data || [];

    const topCharacters = data.slice(0, 100);

    return topCharacters.map((item: any) => {
      const char = item.character;
      const va = item.voice_actors?.find((v: any) => v.language === "Japanese")?.person;

      return {
        character: {
          id: char?.mal_id?.toString() || "",
          poster: char?.images?.jpg?.image_url || char?.images?.webp?.image_url || "",
          name: char?.name || "",
          cast: item.role || "Supporting"
        },
        voiceActors: va ? [{
          id: va.mal_id?.toString() || "",
          poster: va.images?.jpg?.image_url || "",
          name: va.name || ""
        }] : []
      };
    });
  } catch (error) {
    console.error("Failed to retrieve character data from MyAnimeList:", error);
  }

  return [];
}

export interface FilterParams {
  format?: string;
  genre?: string;
  status?: string;
  year?: string;
  page?: string | number;
}

export async function fetchFilteredAnime(params: FilterParams) {
  const queryParams = new URLSearchParams();
  
  if (params.format) queryParams.append('type', params.format);
  if (params.genre) queryParams.append('genres', params.genre.replace(/-/g, '_'));
  if (params.status) queryParams.append('status', params.status.replace(/-/g, '_'));
  if (params.year) queryParams.append('sy', params.year);
  if (params.page) queryParams.append('page', params.page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/filter${queryString ? `?${queryString}` : ''}`;
  
  // PERUBAHAN: Tidak perlu lagi pengecekan '/api' karena env.api.bowo sudah valid
  return await fetchApi(endpoint);
}

export async function fetchSchedule(date: string, tzOffset: number) {
  const endpoint = `/schedule?date=${date}&tzOffset=${tzOffset}`;
  
  // PERUBAHAN: Tidak perlu lagi pengecekan '/api' karena env.api.bowo sudah valid
  return await fetchApi(endpoint);
}

// Initialize cache variable outside the function for in-memory storage
const posterCache = new Map<string, string>();

export async function getPosterFromDetail(id: string) {
  if (!id) return null;

  // Layer 1: Check Memory Cache (Fastest retrieval)
  if (posterCache.has(id)) return posterCache.get(id);

  // Layer 2: Check Session Storage (Persists across page refreshes)
  if (typeof window !== "undefined") {
    const cachedPoster = sessionStorage.getItem(`poster_${id}`);
    if (cachedPoster) {
      posterCache.set(id, cachedPoster); // Restore to memory cache
      return cachedPoster;
    }
  }

  try {
    // PERUBAHAN: Menggunakan env.api.bowo alih-alih hardcode domain Vercel
    const res = await fetch(`${env.api.bowo}/info?id=${id}`);
    const data = await res.json();
    
    if (data && data.success && data.results && data.results.data) {
      const posterUrl = data.results.data.poster;
      
      // Store in Cache upon successful retrieval
      posterCache.set(id, posterUrl);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`poster_${id}`, posterUrl);
      }
      
      return posterUrl;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to retrieve poster details:", error);
    return null;
  }
}