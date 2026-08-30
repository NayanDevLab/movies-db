'use client';

import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { useCart } from '../context/CartContext';
import {
  Star,
  Clock,
  Ticket,
  Info,
  Play,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';

interface HeroSpotlightProps {
  movies: Movie[];
}

export default function HeroSpotlight({ movies }: HeroSpotlightProps) {
  const { openBookingModal, openDetailsModal, openTrailerModal, watchlist, toggleWatchlist } =
    useCart();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pick top 5 featured movies
  const spotlightMovies = movies.slice(0, 5);

  useEffect(() => {
    if (spotlightMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [spotlightMovies.length]);

  if (!spotlightMovies.length) return null;

  const currentMovie = spotlightMovies[currentIndex] || spotlightMovies[0];
  const isFavorite = watchlist.some((m) => m.id === currentMovie.id);

  const cleanSummary = currentMovie.summary
    ? currentMovie.summary.replace(/<[^>]*>?/gm, '')
    : 'An extraordinary cinematic spectacle on the big screen with thrilling storytelling and grand visuals.';

  const posterImage =
    currentMovie.image?.original ||
    currentMovie.image?.medium ||
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 mb-10 shadow-2xl shadow-violet-950/20">
      {/* Background Banner with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={posterImage}
          alt={currentMovie.name}
          className="w-full h-full object-cover object-center opacity-30 filter blur-sm scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        {/* Left: Movie Poster with Glass Card Effect */}
        <div className="relative flex-shrink-0 group">
          <div className="w-52 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/40 border border-slate-700/60 transition-transform duration-500 group-hover:scale-105">
            <img src={posterImage} alt={currentMovie.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-xs flex items-center gap-1 shadow-lg backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            {currentMovie.rating?.average ? currentMovie.rating.average.toFixed(1) : '8.8'}
          </div>

          <button
            onClick={() => toggleWatchlist(currentMovie)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md ${
              isFavorite
                ? 'bg-pink-600 text-white'
                : 'bg-slate-950/80 text-slate-300 hover:text-pink-400 border border-slate-700'
            }`}
            title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Center/Right: Synopsis & Actions */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {/* Status & Genre Tags */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Featured Premiere
            </span>
            {currentMovie.genres?.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50 text-xs font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {currentMovie.name}
          </h1>

          {/* Meta specs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
            {currentMovie.premiered && (
              <span>
                Year:{' '}
                <strong className="text-slate-200">{currentMovie.premiered.slice(0, 4)}</strong>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <strong className="text-slate-200">{currentMovie.runtime || 120} mins</strong>
            </span>
            <span>
              Language:{' '}
              <strong className="text-slate-200">{currentMovie.language || 'English'}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-xs font-bold">
              {currentMovie.ageRating || 'PG-13'}
            </span>
          </div>

          {/* Overview */}
          <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-2xl">
            {cleanSummary}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
            <button
              onClick={() => openBookingModal(currentMovie)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4 fill-slate-950" />
              Book Tickets Now • ${currentMovie.ticketPrice || 14}
            </button>

            <button
              onClick={() => openTrailerModal(currentMovie)}
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-violet-600 text-white font-bold text-sm border border-slate-700 hover:border-violet-500 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Trailer
            </button>

            <button
              onClick={() => openDetailsModal(currentMovie)}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Info className="w-4 h-4 text-violet-400" />
              Cast & Details
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigator Dots */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev === 0 ? spotlightMovies.length - 1 : prev - 1))
          }
          className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 text-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {spotlightMovies.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % spotlightMovies.length)}
          className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 text-xs transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
