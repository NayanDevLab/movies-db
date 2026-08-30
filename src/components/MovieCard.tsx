'use client';

import React from 'react';
import { Movie } from '../types/movie';
import { useCart } from '../context/CartContext';
import { Star, Clock, Ticket, Info, Film, Play, Heart } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { openBookingModal, openDetailsModal, openTrailerModal, watchlist, toggleWatchlist } =
    useCart();

  const isFavorite = watchlist.some((m) => m.id === movie.id);

  const posterImage =
    movie.image?.medium ||
    movie.image?.original ||
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80';

  const ratingVal = movie.rating?.average ? movie.rating.average.toFixed(1) : '8.2';
  const premierYear = movie.premiered ? movie.premiered.slice(0, 4) : '2024';
  const price = movie.ticketPrice || 14;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-violet-500/50 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-violet-950/40 transition-all duration-300 transform hover:-translate-y-1">
      {/* Poster Image Container */}
      <div
        onClick={() => openDetailsModal(movie)}
        className="relative w-full aspect-[2/3] overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={posterImage}
          alt={movie.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Rating Badge */}
          <div className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 font-black text-xs flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{ratingVal}</span>
          </div>

          {/* Watchlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md ${
              isFavorite
                ? 'bg-pink-600 text-white shadow-pink-600/40'
                : 'bg-slate-950/80 text-slate-300 hover:text-pink-400 border border-slate-700'
            }`}
            title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Center Hover Buttons: Trailer & Details */}
        <div className="absolute inset-0 m-auto flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openTrailerModal(movie);
            }}
            className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openDetailsModal(movie);
            }}
            className="w-11 h-11 rounded-full bg-violet-600/90 hover:bg-violet-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all backdrop-blur-sm"
            title="View Cast & Details"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Genre Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {movie.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 text-[11px] font-medium border border-slate-700/50"
              >
                {genre}
              </span>
            ))}
            {movie.genres?.length > 2 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => openDetailsModal(movie)}
            className="text-base font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1 cursor-pointer"
            title={movie.name}
          >
            {movie.name}
          </h3>

          {/* Runtime & Year */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>{premierYear}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {movie.runtime || 110}m
            </span>
            <span>•</span>
            <span className="text-slate-300">{movie.language || 'English'}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => openTrailerModal(movie)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs transition-colors"
            title="Watch Trailer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            onClick={() => openBookingModal(movie)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20 hover:shadow-violet-600/40 active:scale-95 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Seats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
