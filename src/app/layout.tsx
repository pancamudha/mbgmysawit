import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mbgmysawit.vercel.app"), 
  
  title: {
    default: "Animaple - Watch Free Anime Online · Stream Subbed & Dubbed Anime in HD",
    template: "%s | Animaple",
  },
  description: "A premier platform to stream high-quality anime online for free. Enjoy daily updates of your favorite subbed and dubbed episodes with a seamless, ad-free viewing experience.",
  
  openGraph: {
    title: "Animaple - Watch Free Anime Online · Stream Subbed & Dubbed Anime in HD",
    description: "A premier platform to stream high-quality anime online for free. Enjoy daily updates of your favorite subbed and dubbed episodes with a seamless, ad-free viewing experience.",
    url: "https://animaple-beta.vercel.app",
    siteName: "Animaple",
    images: [
      {
        url: "https://animaple-beta.vercel.app/favicon.png", 
        width: 1200,
        height: 630,
        alt: "Animaple - Anime Streaming Platform",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Animaple - Watch Free Anime Online · Stream Subbed & Dubbed Anime in HD",
    description: "A premier platform to stream high-quality anime online for free. Enjoy daily updates of your favorite subbed and dubbed episodes with a seamless, ad-free viewing experience.",
    images: ["https://animaple-beta.vercel.app/favicon.png"], 
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

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
    <html lang="id" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} bg-[#0A0A0B] text-slate-200 antialiased overflow-x-hidden`}>
        <Navbar />
        <Sidebar />

        <WelcomePopup />
        
        <div className="pt-16 pl-0 [.sidebar-expanded_&]:md:pl-[240px] transition-all duration-300 ease-in-out min-h-screen flex flex-col">
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
          
        </div>
        
      </body>
    </html>
  );
}