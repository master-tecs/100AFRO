import Link from "next/link";
import { ArrowLeft, Home, Search, BookOpen, Video, BarChart3 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] bg-gray-900">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.06]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-afro-primary/30 bg-afro-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-afro-primary">
            <span className="inline-block h-2 w-2 rounded-full bg-afro-primary" />
            404 — Page not found
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            This page went off the grid.
          </h1>
          <p className="mt-4 text-base text-gray-300 sm:text-lg">
            The link may be broken, the page may have moved, or it never existed. Let’s get you back
            to the culture.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-afro-primary px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 bg-gray-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-afro-primary/60"
            >
              <Search size={18} />
              Search
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 bg-gray-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-afro-primary/60"
            >
              <BookOpen size={18} />
              Read the Blog
            </Link>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
            >
              <ArrowLeft size={16} />
              Or go back
            </Link>
          </div>
        </div>

        {/* Popular shortcuts */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/blog"
            className="group rounded-2xl border border-gray-800 bg-gray-950/60 p-5 transition-colors hover:border-afro-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-afro-primary/10 p-2 text-afro-primary">
                <BookOpen size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white group-hover:text-afro-primary">Latest Articles</div>
                <div className="text-xs text-gray-500">News, culture, industry</div>
              </div>
            </div>
          </Link>

          <Link
            href="/videos"
            className="group rounded-2xl border border-gray-800 bg-gray-950/60 p-5 transition-colors hover:border-afro-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-afro-primary/10 p-2 text-afro-primary">
                <Video size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white group-hover:text-afro-primary">Watch Videos</div>
                <div className="text-xs text-gray-500">Clips, interviews, trends</div>
              </div>
            </div>
          </Link>

          <Link
            href="/charts"
            className="group rounded-2xl border border-gray-800 bg-gray-950/60 p-5 transition-colors hover:border-afro-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-afro-primary/10 p-2 text-afro-primary">
                <BarChart3 size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white group-hover:text-afro-primary">Charts</div>
                <div className="text-xs text-gray-500">Top songs & albums</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

