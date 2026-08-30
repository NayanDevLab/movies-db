'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Heart, Ticket, Trash2, Star } from 'lucide-react';
import { FALLBACK_POSTER_IMAGE, WATCHLIST_STYLES } from '../constants/ui';

export default function WatchlistModal() {
  const {
    watchlist,
    isWatchlistOpen,
    closeWatchlist,
    toggleWatchlist,
    openBookingModal,
    openDetailsModal,
  } = useCart();

  if (!isWatchlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/15 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30">
              <Heart className="w-4 h-4 fill-pink-500 dark:fill-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Movie Watchlist
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved for later
              </p>
            </div>
          </div>
          <button
            onClick={closeWatchlist}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {watchlist.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 opacity-40" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Your watchlist is empty.
              </p>
              <p className="text-xs text-slate-500">
                Click the heart icon on any movie card to add it to your personal watchlist!
              </p>
            </div>
          ) : (
            watchlist.map((movie) => {
              const posterImage =
                movie.image?.medium || movie.image?.original || FALLBACK_POSTER_IMAGE;

              return (
                <div key={movie.id} className={WATCHLIST_STYLES.card}>
                  <div
                    onClick={() => {
                      closeWatchlist();
                      openDetailsModal(movie);
                    }}
                    className="flex items-center gap-3 cursor-pointer w-full sm:w-auto"
                  >
                    <div className={WATCHLIST_STYLES.posterContainer}>
                      <img
                        src={posterImage}
                        alt={movie.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                        {movie.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {movie.rating?.average ? movie.rating.average.toFixed(1) : '8.5'}
                        </span>
                        <span>•</span>
                        <span>{movie.genres?.slice(0, 2).join(', ')}</span>
                        <span>•</span>
                        <span>{movie.runtime || 110}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => toggleWatchlist(movie)}
                      className={WATCHLIST_STYLES.removeButton}
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        closeWatchlist();
                        openBookingModal(movie);
                      }}
                      className={WATCHLIST_STYLES.bookButton}
                    >
                      <Ticket className="w-3.5 h-3.5" /> Book Ticket
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
