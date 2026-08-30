'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import HeroSpotlight from '../components/HeroSpotlight';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { Movie } from '../types/movie';
import {
  fetchMoviesList,
  searchMovies,
  extractUniqueGenres,
  extractUniqueLanguages,
  extractLiveActors,
  fetchMoviesByActorId,
} from '../services/movieApi';
import { useFilters } from '../context/FilterContext';
import { Clapperboard, SearchX, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const { filters, selectedActorProfile, resetFilters } = useFilters();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchMoviesList()
      .then((data) => {
        if (isMounted) {
          setAllMovies(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load initial movie dataset:', err);
        if (isMounted) {
          setError('Failed to load movie catalog. Please check your connection.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Live Search
  useEffect(() => {
    if (!filters.searchQuery.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const searchResults = await searchMovies(filters.searchQuery);
        setAllMovies(searchResults);
      } catch (e) {
        console.error(e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // When an actor is searched & selected, fetch their full filmography list
  useEffect(() => {
    if (!selectedActorProfile) return;

    let isMounted = true;
    setIsLoading(true);

    fetchMoviesByActorId(selectedActorProfile.id, selectedActorProfile.name)
      .then((actorMovies) => {
        if (isMounted) {
          if (actorMovies.length > 0) {
            setAllMovies(actorMovies);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching actor movies:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedActorProfile]);

  // Extract Genres, Languages & Actors dynamically from live fetched movies
  const availableGenres = useMemo(() => extractUniqueGenres(allMovies), [allMovies]);
  const availableLanguages = useMemo(() => extractUniqueLanguages(allMovies), [allMovies]);
  const availableActors = useMemo(() => extractLiveActors(allMovies), [allMovies]);

  // Filter & Sort Pipeline
  const filteredMovies = useMemo(() => {
    let result = [...allMovies];

    // 1. Industry / Media Type Filter
    if (filters.selectedIndustry === 'hollywood') {
      result = result.filter(
        (m) =>
          m.industry === 'Hollywood' || (m.language === 'English' && m.mediaType !== 'Web Series')
      );
    } else if (filters.selectedIndustry === 'bollywood') {
      result = result.filter(
        (m) =>
          m.industry === 'Bollywood' ||
          (m.language?.toLowerCase() === 'hindi' && m.mediaType !== 'Web Series')
      );
    } else if (filters.selectedIndustry === 'tollywood') {
      result = result.filter(
        (m) =>
          m.industry === 'Tollywood' ||
          m.language?.toLowerCase() === 'telugu' ||
          m.language?.toLowerCase() === 'tamil'
      );
    } else if (filters.selectedIndustry === 'web-series') {
      result = result.filter(
        (m) =>
          m.industry === 'Web Series' ||
          m.mediaType === 'Web Series' ||
          m.type === 'Web Series' ||
          m.type === 'Scripted' ||
          (m.runtime && m.runtime <= 65)
      );
    }

    // 2. Language Filter
    if (filters.selectedLanguage !== 'all') {
      result = result.filter(
        (m) => m.language?.toLowerCase() === filters.selectedLanguage.toLowerCase()
      );
    }

    // 3. Category Filter
    if (filters.selectedCategory === 'now-showing') {
      result = result.filter(
        (m) =>
          m.status === 'Running' ||
          m.status === 'Now Showing' ||
          (m.rating?.average && m.rating.average >= 7.2)
      );
    } else if (filters.selectedCategory === 'top-rated') {
      result = result.filter((m) => m.rating?.average && m.rating.average >= 8.0);
    } else if (filters.selectedCategory === 'trending') {
      result = result.filter(
        (m) => (m.weight && m.weight > 60) || (m.rating?.average && m.rating.average >= 7.8)
      );
    } else if (filters.selectedCategory === 'premieres') {
      result = result.filter((m) => m.premiered && parseInt(m.premiered.slice(0, 4), 10) >= 2020);
    }

    // 4. Genre Filter
    if (filters.selectedGenre !== 'all') {
      result = result.filter((m) =>
        m.genres?.some((g) => g.toLowerCase() === filters.selectedGenre.toLowerCase())
      );
    }

    // 5. Minimum Rating Filter
    if (filters.minRating > 0) {
      result = result.filter((m) => m.rating?.average && m.rating.average >= filters.minRating);
    }

    // 6. Actor Filter
    if (filters.selectedActor !== 'all') {
      result = result.filter((m) => {
        const hasCast = m._embedded?.cast?.some((c) =>
          c.person?.name.toLowerCase().includes(filters.selectedActor.toLowerCase())
        );
        const hasSummary = m.summary?.toLowerCase().includes(filters.selectedActor.toLowerCase());
        return hasCast || hasSummary;
      });
    }

    // 7. Sorting
    if (filters.sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    } else if (filters.sortBy === 'rating-asc') {
      result.sort((a, b) => (a.rating?.average || 0) - (b.rating?.average || 0));
    } else if (filters.sortBy === 'title-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'year-desc') {
      result.sort((a, b) => {
        const yearA = a.premiered ? parseInt(a.premiered.slice(0, 4), 10) : 0;
        const yearB = b.premiered ? parseInt(b.premiered.slice(0, 4), 10) : 0;
        return yearB - yearA;
      });
    }

    return result;
  }, [allMovies, filters]);

  // Paginated Slice
  const paginatedMovies = useMemo(() => {
    const start = (filters.page - 1) * filters.itemsPerPage;
    return filteredMovies.slice(start, start + filters.itemsPerPage);
  }, [filteredMovies, filters.page, filters.itemsPerPage]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-violet-600 selection:text-white transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Spotlight Featured Header */}
        {!isLoading && allMovies.length > 0 && !filters.searchQuery && (
          <HeroSpotlight movies={allMovies} />
        )}

        {/* Filter Toolbar */}
        <FilterBar
          availableGenres={availableGenres}
          availableLanguages={availableLanguages}
          availableActors={availableActors}
          totalResults={filteredMovies.length}
        />

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 space-y-3 animate-pulse shadow-sm"
              >
                <div className="w-full aspect-[2/3] bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="my-12 p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <p className="text-sm text-red-600 dark:text-red-300 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload Application
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && !error && (
          <>
            {paginatedMovies.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <SearchX className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    No matching movies found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Try adjusting your search query, genre, rating threshold, or selected actor.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors shadow-lg shadow-violet-600/30"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {paginatedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredMovies.length > 0 && <Pagination totalItems={filteredMovies.length} />}
          </>
        )}
      </main>

      {/* Cinematic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/90 dark:bg-slate-950/80 mt-16 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-wider">
                  CINE<span className="text-amber-500 dark:text-amber-400">PULSE</span>
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
                Next-generation movie exploration & ticketing experience. Browse thousands of movies
                with verified cast members, real-time filters, interactive cinema seating, and
                instant billing.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Public API
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-violet-700 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40 px-2.5 py-1 rounded-full border border-violet-200 dark:border-violet-800/40 font-medium">
                  <Zap className="w-3.5 h-3.5" /> Real-time Interactive Booking
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
                Cinema Highlights
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Live TVMaze API + Cast Details</li>
                <li>• Genre, Actor & Rating Filters</li>
                <li>• Interactive Hall Seat Selection</li>
                <li>• Itemized Bill & Tax Invoice</li>
                <li>• Digital Boarding Pass QR Ticket</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
                Active Promo Codes
              </h4>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between shadow-sm">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">CINEMA20</span>
                  <span className="text-slate-500 dark:text-slate-400">20% Off</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between shadow-sm">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">SUPERSTAR</span>
                  <span className="text-slate-500 dark:text-slate-400">$10 Off</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between shadow-sm">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">FIRSTSHOW</span>
                  <span className="text-slate-500 dark:text-slate-400">15% Off</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} CinePulse Entertainment Inc. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with Next.js, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
