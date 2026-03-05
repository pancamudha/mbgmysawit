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