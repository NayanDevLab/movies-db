'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { getMovieTrailer } from '../services/movieApi';
import { X, Ticket, Play, Sparkles, Film, Star } from 'lucide-react';

export default function TrailerModal() {
  const { selectedTrailerMovie, closeTrailerModal, openBookingModal } = useCart();

  if (!selectedTrailerMovie) return null;

  const trailerEmbedUrl = getMovieTrailer(selectedTrailerMovie);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-violet-900/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto shadow-violet-950/60">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Play className="w-4 h-4 fill-violet-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">
                Official Cinema Trailer
              </span>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {selectedTrailerMovie.name}
              </h2>
            </div>
          </div>

          <button
            onClick={closeTrailerModal}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Box with Ambient Glow */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <iframe
            src={`${trailerEmbedUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={`${selectedTrailerMovie.name} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{selectedTrailerMovie.rating?.average ? selectedTrailerMovie.rating.average.toFixed(1) : '8.8'}</span>
            </div>
            <span>•</span>
            <span>{selectedTrailerMovie.genres?.join(', ')}</span>
            <span>•</span>
            <span>{selectedTrailerMovie.runtime || 120} mins</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={closeTrailerModal}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close Trailer
            </button>
            <button
              onClick={() => {
                closeTrailerModal();
                openBookingModal(selectedTrailerMovie);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" />
              Book Tickets for this Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
