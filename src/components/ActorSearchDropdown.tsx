'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ActorProfile } from '../types/movie';
import { searchActors } from '../services/movieApi';
import { useFilters } from '../context/FilterContext';
import { User, Search, X, Sparkles, Film } from 'lucide-react';

interface ActorSearchDropdownProps {
  onActorSelected?: (actor: ActorProfile) => void;
}

export default function ActorSearchDropdown({ onActorSelected }: ActorSearchDropdownProps) {
  const { filters, selectedActorProfile, setSelectedActorProfile, setSelectedActor } = useFilters();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ActorProfile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchActors(query);
        setResults(data.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectActor = (actor: ActorProfile) => {
    setSelectedActorProfile(actor);
    setIsOpen(false);
    setQuery('');
    if (onActorSelected) onActorSelected(actor);
  };

  const handleClear = () => {
    setSelectedActorProfile(null);
    setSelectedActor('all');
    setQuery('');
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-64">
      {selectedActorProfile ? (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs shadow-sm">
          <div className="flex items-center gap-2 truncate">
            {selectedActorProfile.image?.medium ? (
              <img
                src={selectedActorProfile.image.medium}
                alt={selectedActorProfile.name}
                className="w-5 h-5 rounded-full object-cover border border-cyan-400"
              />
            ) : (
              <User className="w-4 h-4 text-cyan-400" />
            )}
            <span className="font-bold truncate">{selectedActorProfile.name}</span>
          </div>
          <button
            onClick={handleClear}
            className="w-4 h-4 rounded-full bg-cyan-900/60 hover:bg-cyan-800 text-white flex items-center justify-center text-[10px]"
            title="Clear actor"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="relative">
          <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search Actor / Actress..."
            className="w-full pl-8 pr-7 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Autocomplete Dropdown List */}
      {isOpen && (query.trim().length > 0 || results.length > 0) && (
        <div className="absolute top-full mt-2 left-0 w-full sm:w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn max-h-72 overflow-y-auto">
          {isSearching ? (
            <div className="py-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Searching actors & actresses...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">
              No matching actors found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 flex items-center gap-1">
                <Film className="w-3 h-3 text-cyan-400" /> Cast & Celebrities
              </div>
              {results.map((actor) => {
                const photo =
                  actor.image?.medium ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

                return (
                  <button
                    key={actor.id}
                    onClick={() => handleSelectActor(actor)}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-800 flex items-center gap-2.5 transition-colors group"
                  >
                    <img
                      src={photo}
                      alt={actor.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 group-hover:border-cyan-400 transition-colors"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {actor.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {actor.country?.name ? `${actor.country.name}` : 'Actor'}
                        {actor.birthday ? ` • Born ${actor.birthday.slice(0, 4)}` : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
