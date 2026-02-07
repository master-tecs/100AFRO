"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoCategory } from "@prisma/client";

interface VideoFiltersProps {
  activeCategory?: VideoCategory | null;
}

const CATEGORIES: { value: VideoCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Videos" },
  { value: "Music_Video", label: "Music Videos" },
  { value: "Dance", label: "Dance" },
  { value: "Interview", label: "Interviews" },
  { value: "Vlog", label: "Vlogs" },
  { value: "Performance", label: "Performances" },
];

export default function VideoFilters({ activeCategory }: VideoFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (category: VideoCategory | "ALL") => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === "ALL") {
      params.delete("category");
      params.delete("page"); // Reset to page 1 when changing filter
    } else {
      params.set("category", category);
      params.delete("page"); // Reset to page 1 when changing filter
    }

    router.push(`/videos?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {CATEGORIES.map((cat) => {
        const isActive =
          (cat.value === "ALL" && !activeCategory) ||
          (cat.value === activeCategory);

        return (
          <button
            key={cat.value}
            onClick={() => handleFilter(cat.value as VideoCategory | "ALL")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isActive
                ? "bg-afro-primary text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            aria-pressed={isActive}
            aria-label={`Filter by ${cat.label}`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
