"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AZListPaginationProps {
  currentPage: number;
  totalPages: number;
  currentLetter: string; // Tambahan prop untuk mengetahui huruf saat ini
}

export default function AZListPagination({
  currentPage,
  totalPages,
  currentLetter,
}: AZListPaginationProps) {
  const router = useRouter();

  // Fungsi untuk menghasilkan URL yang cantik tanpa tanda tanya (?)
  const getPageUrl = (pageNumber: number) => {
    const letterPath = currentLetter === "all" ? "" : `/${currentLetter}`;
    
    // Jika kembali ke halaman 1, sembunyikan "/page/1" agar URL lebih bersih
    if (pageNumber === 1) {
      return `/az-list${letterPath}`;
    }
    
    return `/az-list${letterPath}/page/${pageNumber}`;
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (typeof pageNumber === "number" && pageNumber !== currentPage) {
      router.push(getPageUrl(pageNumber));
    }
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-10 mb-4 sm:mb-5 w-full">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-all mr-4 sm:mr-6 shrink-0"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {getPages().map((page, index) => {
          let hideOnMobile = false;
          if (totalPages > 7) {
            if (currentPage <= 4 && page === 5) {
              hideOnMobile = true;
            } else if (currentPage >= totalPages - 3 && page === totalPages - 4) {
              hideOnMobile = true;
            } else if (currentPage > 4 && currentPage < totalPages - 3 && page === currentPage + 1) {
              hideOnMobile = true;
            }
          }

          return (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              disabled={page === "..."}
              className={`${hideOnMobile ? 'hidden sm:flex' : 'flex'} items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] text-[13px] sm:text-sm font-medium transition-all ${
                page === currentPage
                  ? "bg-[#161616] text-white border border-[#2A2A2E]" 
                  : page === "..."
                  ? "bg-transparent text-[#8C8C8C] cursor-default border border-transparent"
                  : "bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616]"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-4 sm:ml-6 shrink-0"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}