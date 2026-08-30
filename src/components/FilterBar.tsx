'use client';

import React from 'react';
import { useFilters } from '../context/FilterContext';
import ActorSearchDropdown from './ActorSearchDropdown';
import { ActorProfile } from '../types/movie';
import {
  SlidersHorizontal,
  Star,
  User,
  Sparkles,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Film,
  X,
  Tv,
  Globe,
  Flame,
} from 'lucide-react';

interface FilterBarProps {
  availableGenres: string[];
  availableLanguages: string[];
  availableActors: ActorProfile[];
  totalResults: number;
}

const INDUSTRIES = [
  { id: 'all', label: 'All Industries', icon: Globe },
  { id: 'hollywood', label: '🎬 Hollywood', icon: Film },
  { id: 'bollywood', label: '🌟 Bollywood (Hindi)', icon: Sparkles },
  { id: 'tollywood', label: '🔥 Tollywood (South)', icon: Flame },
  { id: 'web-series', label: '📺 Web Series & OTT', icon: Tv },
];

const CATEGORIES = [
  { id: 'all', label: 'All Releases' },
  { id: 'now-showing', label: 'In Theaters' },
  { id: 'top-rated', label: 'Top Rated (8.0+)' },
  { id: 'trending', label: 'Trending Hits' },
  { id: 'premieres', label: 'New Premieres' },
];

export default function FilterBar({
  availableGenres,
  availableLanguages,
  availableActors,
  totalResults,
}: FilterBarProps) {
  const {
    filters,
    selectedActorProfile,
    setSelectedIndustry,
    setSelectedLanguage,
    setSelectedGenre,
    setSelectedCategory,
    setMinRating,
    setSelectedActor,
    setSelectedActorProfile,
    setSortBy,
    resetFilters,
  } = useFilters();

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.selectedIndustry !== 'all' ||
    filters.selectedLanguage !== 'all' ||
    filters.selectedGenre !== 'all' ||
    filters.selectedCategory !== 'all' ||
    filters.minRating > 0 ||
    filters.selectedActor !== 'all' ||
    filters.sortBy !== 'featured';

  const [starGender, setStarGender] = React.useState<'all' | 'Female' | 'Male'>('all');

  const handleStarPillClick = (star: ActorProfile) => {
    setSelectedActorProfile(star);
  };

  const filteredStars = availableActors.filter((star) => {
    if (starGender === 'all') return true;
    return star.gender === starGender;
  });

  return (
    <div className="w-full space-y-5 mb-8">
      {/* 1. Industry Quick Tabs (Hollywood / Bollywood / Tollywood / Web Series) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {INDUSTRIES.map((ind) => {
          const isActive = filters.selectedIndustry === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 text-white shadow-lg shadow-violet-600/30 scale-105'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {ind.label}
            </button>
          );
        })}
      </div>

      {/* 2. Popular Actresses & Actors 1-Click Quick Bar with Gender Filter */}
      {availableActors.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Real Live Cast & Celebrities</span>
            </div>

            {/* Gender Filter for Actresses / Actors */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setStarGender('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  starGender === 'all'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Stars
              </button>
              <button
                onClick={() => setStarGender('Female')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  starGender === 'Female'
                    ? 'bg-pink-600 text-white shadow'
                    : 'text-pink-400 hover:text-pink-300'
                }`}
              >
                💃 Actresses
              </button>
              <button
                onClick={() => setStarGender('Male')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  starGender === 'Male'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                🕺 Actors
              </button>
            </div>
          </div>

          {/* Stars Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filteredStars.slice(0, 15).map((star) => {
              const isSelected = selectedActorProfile?.name === star.name;
              return (
                <button
                  key={star.id}
                  onClick={() => handleStarPillClick(star)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                    isSelected
                      ? star.gender === 'Female'
                        ? 'bg-pink-600 border-pink-400 text-white shadow-md'
                        : 'bg-cyan-600 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {star.image?.medium ? (
                    <img
                      src={star.image.medium}
                      alt={star.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">
                      👤
                    </span>
                  )}
                  <span>{star.name}</span>
                  {star.gender === 'Female' && <span className="text-[10px] text-pink-300">★</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Category & Release Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = filters.selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Dropdowns & Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Filter Dropdowns & Actor Live Search */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Genre Dropdown */}
          <div className="relative">
            <select
              value={filters.selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value="all">🎬 All Genres</option>
              {availableGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <select
              value={filters.selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value="all">🌐 All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  🗣️ {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Rating Filter Dropdown */}
          <div className="relative">
            <select
              value={filters.minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value={0}>⭐ Any Rating</option>
              <option value={7}>⭐ 7.0+ Rated</option>
              <option value={8}>⭐ 8.0+ Highly Rated</option>
              <option value={8.5}>⭐ 8.5+ Masterpiece</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Live Actor / Actress Autocomplete Search */}
          <ActorSearchDropdown />
        </div>

        {/* Right Side: Sorting & Reset */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2 hidden sm:inline" />
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value="featured">✨ Featured Order</option>
              <option value="rating-desc">⭐ Highest Rating</option>
              <option value="rating-asc">⭐ Lowest Rating</option>
              <option value="title-asc">🔤 Title (A - Z)</option>
              <option value="year-desc">📅 Newest Premiere</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Actor Spotlight Banner */}
      {selectedActorProfile && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-cyan-400 shadow-md flex-shrink-0">
              <img
                src={
                  selectedActorProfile.image?.medium ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={selectedActorProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Featured Live Filmography
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {selectedActorProfile.name}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedActorProfile.country?.name ? `${selectedActorProfile.country.name}` : ''}
                {selectedActorProfile.birthday ? ` • Born ${selectedActorProfile.birthday}` : ''} •
                Showing {totalResults} live {totalResults === 1 ? 'title' : 'titles'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedActorProfile(null);
              setSelectedActor('all');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear Actor Filter
          </button>
        </div>
      )}

      {/* Active Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-white">{totalResults}</strong> real live titles
          </span>

          {filters.selectedIndustry !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-900/40 text-violet-300 border border-violet-700/50 capitalize">
              Industry: {filters.selectedIndustry}
              <button
                onClick={() => setSelectedIndustry('all')}
                className="hover:text-white font-bold ml-1"
              >
                ✕
              </button>
            </span>
          )}

          {filters.selectedLanguage !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
              Language: {filters.selectedLanguage}
              <button
                onClick={() => setSelectedLanguage('all')}
                className="hover:text-white font-bold ml-1"
              >
                ✕
              </button>
            </span>
          )}

          {filters.selectedGenre !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-900/40 text-violet-300 border border-violet-700/50">
              Genre: {filters.selectedGenre}
              <button
                onClick={() => setSelectedGenre('all')}
                className="hover:text-white font-bold ml-1"
              >
                ✕
              </button>
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/40 text-amber-300 border border-amber-700/50">
              Rating: {filters.minRating}+ ★
              <button onClick={() => setMinRating(0)} className="hover:text-white font-bold ml-1">
                ✕
              </button>
            </span>
          )}

          {filters.selectedActor !== 'all' && !selectedActorProfile && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">
              Actor: {filters.selectedActor}
              <button
                onClick={() => setSelectedActor('all')}
                className="hover:text-white font-bold ml-1"
              >
                ✕
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
              Search: &quot;{filters.searchQuery}&quot;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
