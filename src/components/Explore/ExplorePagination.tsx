"use client";

import { useRouter, useParams } from "next/navigation";
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
  const params = useParams();

  const slug = (params.slug as string[]) || [];
  
  // Memisahkan base URL (filter) dari kata 'page'
  const baseFilters = slug.filter((item, index) => {
    if (item === 'page') return false;
    if (slug[index - 1] === 'page') return false;
    return true;
  });

  // Anti-NaN Guards untuk Pagination Render
  const safeCurrentPage = Number.isInteger(currentPage) && currentPage > 0 ? currentPage : 1;
  const safeTotalPages = Number.isInteger(totalPages) && totalPages > 0 ? totalPages : 1;

  const getPageUrl = (pageNumber: number) => {
    const parts = ['/explore', ...baseFilters, 'page', pageNumber.toString()];
    return parts.join('/');
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (typeof pageNumber === "number" && pageNumber !== safeCurrentPage) {
      router.push(getPageUrl(pageNumber));
    }
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    
    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - 3) {
        pages.push(1, "...", safeTotalPages - 4, safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages);
      } else {
        pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", safeTotalPages);
      }
    }
    return pages;
  };

  if (safeTotalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-10 mb-4 sm:mb-5 w-full">
      <button
        onClick={() => handlePageChange(safeCurrentPage - 1)}
        disabled={safeCurrentPage <= 1}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-all mr-4 sm:mr-6 shrink-0"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {getPages().map((page, index) => {
          
          let hideOnMobile = false;
          if (safeTotalPages > 7) {
            if (safeCurrentPage <= 4 && page === 5) {
              hideOnMobile = true;
            } else if (safeCurrentPage >= safeTotalPages - 3 && page === safeTotalPages - 4) {
              hideOnMobile = true;
            } else if (safeCurrentPage > 4 && safeCurrentPage < safeTotalPages - 3 && page === safeCurrentPage + 1) {
              hideOnMobile = true;
            }
          }

          return (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              disabled={page === "..."}
              className={`${hideOnMobile ? 'hidden sm:flex' : 'flex'} items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] text-[13px] sm:text-sm font-medium transition-all ${
                page === safeCurrentPage
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
        onClick={() => handlePageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage >= safeTotalPages}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#0F0F0F] text-[#8C8C8C] border border-[#1C1C1F] hover:border-[#2A2A2E] hover:text-white hover:bg-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-4 sm:ml-6 shrink-0"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}