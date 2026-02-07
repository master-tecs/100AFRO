"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface TruncatedTitleProps {
  title: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "p";
  maxLines?: number;
  showTooltip?: boolean;
  showExpand?: boolean;
  linkHref?: string;
}

export default function TruncatedTitle({
  title,
  className = "",
  as = "div",
  maxLines = 2,
  showTooltip = true,
  showExpand = true,
  linkHref,
}: TruncatedTitleProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const titleRef = useRef<HTMLElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        const element = titleRef.current;
        // Temporarily remove line-clamp to measure actual height
        const hasLineClamp = element.classList.contains(`line-clamp-${maxLines}`);
        if (hasLineClamp) {
          element.classList.remove(`line-clamp-${maxLines}`);
        }
        
        const lineHeight = parseFloat(
          window.getComputedStyle(element).lineHeight || "24"
        );
        const maxHeight = lineHeight * maxLines;
        const actualHeight = element.scrollHeight;
        
        // Restore line-clamp
        if (hasLineClamp) {
          element.classList.add(`line-clamp-${maxLines}`);
        }
        
        setNeedsTruncation(actualHeight > maxHeight);
      }
    };

    // Delay check to ensure DOM is ready
    const timeout = setTimeout(checkTruncation, 100);
    window.addEventListener("resize", checkTruncation);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkTruncation);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [title, maxLines]);

  const handleExpandClick = (e: React.MouseEvent) => {
    if (showExpand && needsTruncation) {
      e.preventDefault();
      e.stopPropagation();
      setExpanded(!expanded);
      setShowTooltipState(false);
    }
  };

  const handleMouseEnter = () => {
    if (showTooltip && needsTruncation && !expanded) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltipState(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltipState(false);
  };

  const WrapperComponent = as as keyof JSX.IntrinsicElements;
  const lineClampClass = expanded ? "" : `line-clamp-${maxLines}`;
  const baseClasses = `transition-all duration-300 ${lineClampClass} ${className}`.trim();

  const titleContent = (
    <>
      <WrapperComponent
        ref={titleRef as any}
        className={baseClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: showExpand && needsTruncation ? "pointer" : linkHref ? "pointer" : "default",
        }}
        aria-expanded={expanded}
        aria-label={
          needsTruncation
            ? expanded
              ? "Click to collapse title"
              : "Click to expand title"
            : undefined
        }
        onClick={linkHref ? undefined : handleExpandClick}
      >
        {title}
      </WrapperComponent>
      {showExpand && needsTruncation && (
        <button
          onClick={handleExpandClick}
          className="ml-2 text-xs text-gray-500 hover:text-afro-primary transition-colors focus:outline-none focus:ring-2 focus:ring-afro-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
          aria-label={expanded ? "Show less" : "Show more"}
          type="button"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      {showTooltip && showTooltipState && needsTruncation && !expanded && (
        <div
          className="absolute z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm max-w-xs border border-gray-700 pointer-events-none mb-2"
          style={{
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {title}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #1f2937",
            }}
          />
        </div>
      )}
    </>
  );

  if (linkHref) {
    return (
      <div className="relative">
        <Link href={linkHref} className="block">
          {titleContent}
        </Link>
      </div>
    );
  }

  return <div className="relative">{titleContent}</div>;
}
