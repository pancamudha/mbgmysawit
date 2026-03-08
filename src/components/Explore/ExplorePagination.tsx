"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExplorePaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ExplorePagination({
  currentPage,
  totalPages,
}: ExplorePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber.toString());
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (pageNumber: number | string) => {
    if (typeof pageNumber === "number" && pageNumber !== currentPage) {
      router.push(`/explore?${createQueryString(pageNumber)}`);
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
    // Menambahkan kembali margin-bottom menjadi mb-4 sm:mb-5 agar tidak terlalu mepet
    <div className="flex items-center justify-center mt-10 mb-4 sm:mb-5 w-full">
      {/* Tombol Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-all mr-3 sm:mr-5 shrink-0"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Nomor Halaman */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {getPages().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            disabled={page === "..."}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] text-[13px] sm:text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-[#161616] text-white border border-[#2A2A2E]" 
                : page === "..."
                ? "bg-transparent text-[#8C8C8C] cursor-default border border-transparent"
                : "bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Tombol Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-3 sm:ml-5 shrink-0"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}