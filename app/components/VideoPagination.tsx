"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideoPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function VideoPagination({
  currentPage,
  totalPages,
}: VideoPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    router.push(`/videos?${params.toString()}`);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5; // Show max 5 page numbers at once

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-1 ${
            currentPage === 1
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-500"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-afro-primary text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-1 ${
            currentPage === totalPages
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Page Info */}
      <p className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}
