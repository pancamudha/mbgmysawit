const API_BASE_URL = process.env.API_BASE_URL;
const SECRET_KEY = process.env.ANIMAPLE_SECRET_KEY;

export async function fetchApi(endpoint: string) {
  // Pastikan endpoint diawali dengan '/'
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      // Kita gunakan opsi 'no-store' saat development agar selalu fresh, 
      // nanti bisa kita ubah sesuai kebutuhan saat production
      cache: 'no-store', 
      headers: {
        'x-animaple-key': SECRET_KEY || '', // Header sakti penembus batas Upstash!
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari API: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch API Error:", error);
    return null;
  }
}


// ====================================================================
// FUNGSI SMART FALLBACK SINKRONISASI ANILIST (TRAILER & CHARACTERS)
// ====================================================================

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
      // Cache data selama 24 jam agar tidak membebani server AniList
      next: { revalidate: 86400 } 
    });

    const result = await res.json();
    const trailer = result?.data?.Media?.trailer;

    // Pastikan trailernya ada dan berasal dari YouTube
    if (trailer && trailer.site === "youtube") {
      return [{
        title: "Official Trailer (AniList Sync)",
        url: `https://www.youtube.com/embed/${trailer.id}?rel=0`,
        thumbnail: trailer.thumbnail || `https://img.youtube.com/vi/${trailer.id}/hqdefault.jpg`
      }];
    }
  } catch (error) {
    console.error("Gagal mengambil trailer dari AniList:", error);
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

    // Mapping agar strukturnya persis seperti API utama (bowotheexplorer)
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
    console.error("Gagal mengambil karakter dari AniList:", error);
  }

  return [];
}

// ====================================================================
// FUNGSI SMART FALLBACK SINKRONISASI MYANIMELIST (VIA JIKAN API)
// ====================================================================

export async function getMalTrailer(malId: string | number) {
  if (!malId) return [];

  try {
    // Menggunakan Jikan API (Public MAL API)
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
    console.error("Gagal mengambil trailer dari MyAnimeList:", error);
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

    // Ambil maksimal 12 karakter seperti batas UI kita
    const topCharacters = data.slice(0, 100);

    return topCharacters.map((item: any) => {
      const char = item.character;
      // Cari voice actor Jepang
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
    console.error("Gagal mengambil karakter dari MyAnimeList:", error);
  }

  return [];
}