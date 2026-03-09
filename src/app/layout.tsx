import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Ganti URL ini dengan domain deployment kamu (misal: https://animaple.vercel.app)
  metadataBase: new URL("https://mbgmysawit.vercel.app"), 
  
  title: {
    default: "Animaple - Watch Free Anime Online · Stream Subbed & Dubbed Anime in HD",
    template: "%s | Animaple",
  },
  description: "A premier platform to stream high-quality anime online for free. Enjoy daily updates of your favorite subbed and dubbed episodes with a seamless, ad-free viewing experience.",
  
  // Konfigurasi untuk Facebook, WhatsApp, Discord, dll.
  openGraph: {
    title: "Animaple - Watch Free Anime Online · Stream Subbed & Dubbed Anime in HD",
    description: "A premier platform to stream high-quality anime online for free. Enjoy daily updates of your favorite subbed and dubbed episodes with a seamless, ad-free viewing experience.",
    url: "https://animaple-beta.vercel.app",
    siteName: "Animaple",
    images: [
      {
        // MAGISNYA DI SINI: URL HARUS ABSOLUTE (lengkap dengan domainnya) agar WhatsApp bisa membacanya
        url: "https://animaple-beta.vercel.app/favicon.png", 
        width: 1200,
        height: 630,
        alt: "Animaple - Anime Streaming Platform",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // Konfigurasi untuk Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Animaple - Watch Free Anime Online · Stream Subbed & Dubbed Anime in HD",
    description: "A premier platform to stream high-quality anime online for free. Enjoy daily updates of your favorite subbed and dubbed episodes with a seamless, ad-free viewing experience.",
    // URL Twitter juga harus absolute
    images: ["https://animaple-beta.vercel.app/favicon.png"], 
  },

  // Icon browser (Favicon)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// MAGISNYA DI SINI: Memaksa UI Browser HP (Status Bar) jadi hitam pekat
export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Tambahkan className="dark" dan style colorScheme agar konsisten di semua browser
    <html lang="id" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} bg-[#0A0A0B] text-slate-200 antialiased overflow-x-hidden`}>
        <Navbar />
        <Sidebar />

        <WelcomePopup />
        
        {/* MAGISNYA DI SINI: Default pl-0 (mentok kiri-kanan). Saat menu diklik, dorong 240px ke kanan */}
        {/* Ditambahkan flex flex-col agar footer selalu di bawah */}
        <div className="pt-16 pl-0 [.sidebar-expanded_&]:md:pl-[240px] transition-all duration-300 ease-in-out min-h-screen flex flex-col">
          
          {/* flex-grow membuat konten membentang mengisi ruang kosong */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer diletakkan di dalam sini agar ikut tergeser saat sidebar terbuka */}
          <Footer />
          
        </div>
        
      </body>
    </html>
  );
}