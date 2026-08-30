'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFilters } from '../context/FilterContext';
import { useCart } from '../context/CartContext';
import { CINEMA_CITIES, searchActors } from '../services/movieApi';
import { ActorProfile } from '../types/movie';
import {
  Search,
  Ticket,
  Clapperboard,
  Sparkles,
  History,
  Heart,
  MapPin,
  ChevronDown,
  User,
  Film,
} from 'lucide-react';
import BookingHistoryModal from './BookingHistoryModal';

export default function Navbar() {
  const {
    filters,
    setSearchQuery,
    setSelectedActorProfile,
    setSelectedIndustry,
    resetFilters,
  } = useFilters();
  const {
    totalSeatsCount,
    openCart,
    bookingHistory,
    watchlist,
    openWatchlist,
    selectedCity,
    setSelectedCity,
  } = useCart();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [suggestedActors, setSuggestedActors] = useState<ActorProfile[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live suggest matching actors when typing
  useEffect(() => {
    if (!filters.searchQuery.trim()) {
      setSuggestedActors([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const actors = await searchActors(filters.searchQuery);
        setSuggestedActors(actors.slice(0, 5));
      } catch {
        // ignore
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectActorFromSearch = (actor: ActorProfile) => {
    setSelectedActorProfile(actor);
    setSearchQuery('');
    setIsSearchDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f19]/85 border-b border-violet-900/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={resetFilters}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-violet-600/30 group-hover:shadow-violet-600/50 transition-all duration-300">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Clapperboard className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-violet-400 bg-clip-text text-transparent">
                CINE<span className="text-amber-400">PULSE</span>
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold tracking-widest text-violet-400/80 uppercase">
                <Sparkles className="w-3 h-3 text-amber-400" /> Cinema Experience
              </span>
            </div>
          </div>

          {/* City Location Selector Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsCityDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
                  Select Cinema City
                </div>
                {CINEMA_CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCity(c.name);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCity === c.name
                        ? 'bg-violet-600/30 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>
                      {c.flag} {c.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{c.state.slice(0, 2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Bar with Instant Actor & Movie Autocomplete */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="text"
                value={filters.searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                placeholder="Search Hollywood, Bollywood, Tollywood, Actors, Web Series..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 focus:border-violet-500/80 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-xs sm:text-sm text-slate-200 placeholder-slate-500 transition-all shadow-inner"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded-full bg-slate-800"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions (Actors & Titles) */}
            {isSearchDropdownOpen && filters.searchQuery.trim().length > 0 && suggestedActors.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2.5 z-50 animate-fadeIn space-y-2">
                <div className="text-[10px] uppercase font-bold text-cyan-400 px-2 py-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Matching Celebrities & Actors (Click to View Filmography)
                </div>

                <div className="space-y-1">
                  {suggestedActors.map((actor) => (
                    <button
                      key={actor.id}
                      onClick={() => handleSelectActorFromSearch(actor)}
                      className="w-full p-2 rounded-xl text-left hover:bg-slate-800 flex items-center gap-2.5 transition-colors group"
                    >
                      <img
                        src={
                          actor.image?.medium ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={actor.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 group-hover:border-cyan-400"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                          {actor.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {actor.country?.name ? `${actor.country.name}` : 'Star'}
                          {actor.birthday ? ` • Born ${actor.birthday.slice(0, 4)}` : ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Watchlist Button */}
            <button
              onClick={openWatchlist}
              className="relative p-2.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Watchlist & Favorites"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="hidden xl:inline">Watchlist</span>
              {watchlist.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>

            {/* My Bookings History Button */}
            {bookingHistory.length > 0 && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                title="View Booked Tickets"
              >
                <History className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">My Tickets</span>
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">
                  {bookingHistory.length}
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Cart & Booking</span>
              {totalSeatsCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs animate-pulse">
                  {totalSeatsCount}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Booking History Modal */}
      {isHistoryOpen && <BookingHistoryModal onClose={() => setIsHistoryOpen(false)} />}
    </>
  );
}
