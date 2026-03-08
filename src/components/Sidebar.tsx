"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // Fungsi helper untuk mengecek status aktif
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    // Sidebar disamakan warnanya dengan navbar (bg-[#0A0A0A]/80 + glass effect)
    <aside className="fixed left-0 top-[60px] bg-[#0A0A0A]/80 backdrop-blur-xl z-40 h-[calc(100vh-60px)] py-6 px-3 flex flex-col items-start gap-2 border-r border-[#2A2A2E] w-[240px] -translate-x-full [.sidebar-expanded_&]:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl">
      
      {/* Home */}
      <Link 
        href="/" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group shadow-sm ${
          isActive('/') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
        title="Home"
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">Home</span>
      </Link>
      
      {/* Explore */}
      <Link 
        href="/explore" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group shadow-sm ${
          isActive('/explore') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
        title="Explore"
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">Explore</span>
      </Link>
      
      {/* Schedule */}
      <Link 
        href="/schedule" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group shadow-sm ${
          isActive('/schedule') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
        title="Schedule"
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">Schedule</span>
      </Link>
      
      {/* History */}
      <Link 
        href="/history" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group shadow-sm ${
          isActive('/history') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
        title="History"
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M12 7v5l4 2"></path>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">History</span>
      </Link>

    </aside>
  );
}