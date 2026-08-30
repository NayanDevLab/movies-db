'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useFilters } from '../context/FilterContext';
import { fetchMovieDetailsWithCast } from '../services/movieApi';
import { Movie, CastMember } from '../types/movie';
import {
  X,
  Star,
  Film,
  Ticket,
  Play,
  Users,
  Globe,
  Sparkles,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function MovieDetailsModal() {
  const {
    selectedMovieForDetails,
    closeDetailsModal,
    openBookingModal,
    openTrailerModal,
    watchlist,
    toggleWatchlist,
    reviews,
    addReview,
  } = useCart();
  const { setSelectedActorProfile } = useFilters();

  const [movieWithCast, setMovieWithCast] = useState<Movie | null>(null);
  const [isLoadingCast, setIsLoadingCast] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  // Review Form state
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(9.0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!selectedMovieForDetails) {
      setMovieWithCast(null);
      setActiveTab('info');
      setReviewSubmitted(false);
      return;
    }

    let isMounted = true;
    setIsLoadingCast(true);

    fetchMovieDetailsWithCast(selectedMovieForDetails.id)
      .then((fullData) => {
        if (isMounted) {
          setMovieWithCast(fullData);
          setIsLoadingCast(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setMovieWithCast(selectedMovieForDetails);
          setIsLoadingCast(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMovieForDetails]);

  if (!selectedMovieForDetails) return null;

  const activeMovie = movieWithCast || selectedMovieForDetails;
  const castList: CastMember[] = activeMovie._embedded?.cast || [];
  const movieReviews = reviews[activeMovie.id] || [];
  const isFavorite = watchlist.some((m) => m.id === activeMovie.id);

  const posterImage =
    activeMovie.image?.original ||
    activeMovie.image?.medium ||
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80';

  const cleanSummary = activeMovie.summary
    ? activeMovie.summary.replace(/<[^>]*>?/gm, '')
    : 'No detailed synopsis available for this title.';

  const handleActorClick = (cast: CastMember) => {
    setSelectedActorProfile({
      id: cast.person.id,
      name: cast.person.name,
      image: cast.person.image,
      gender: cast.person.gender,
      birthday: cast.person.birthday,
      country: cast.person.country,
    });
    closeDetailsModal();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    addReview(activeMovie.id, {
      author: reviewerName.trim() || 'Movie Lover',
      rating: reviewRating,
      content: reviewText.trim(),
    });

    setReviewText('');
    setReviewerName('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Backdrop Banner */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-950 flex-shrink-0">
          <img
            src={posterImage}
            alt={activeMovie.name}
            className="w-full h-full object-cover filter blur-xs opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/40 dark:via-slate-900/60 to-transparent" />

          {/* Top Right Controls: Watchlist & Close */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(activeMovie)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all shadow-lg ${
                isFavorite
                  ? 'bg-pink-600 border-pink-400 text-white'
                  : 'bg-white/80 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
              title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={closeDetailsModal}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Details Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-violet-600/20 dark:bg-violet-600/60 text-violet-800 dark:text-violet-200 border border-violet-500/40 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {activeMovie.type || 'Cinema Feature'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 drop-shadow-md">
                {activeMovie.name}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => openTrailerModal(activeMovie)}
                className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-violet-600 text-slate-800 dark:text-white hover:text-white border border-slate-200 dark:border-slate-700 hover:border-violet-500 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Watch Trailer
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-slate-950 font-black text-sm shadow-lg">
                <Star className="w-4 h-4 fill-slate-950" />
                {activeMovie.rating?.average ? activeMovie.rating.average.toFixed(1) : '8.5'} / 10
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-8 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-violet-500 text-violet-700 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Movie Details & Cast
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-violet-500 text-violet-700 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Audience
            Reviews ({movieReviews.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {activeTab === 'info' ? (
            <>
              {/* Main Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Poster */}
                <div className="hidden md:block">
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    <img
                      src={posterImage}
                      alt={activeMovie.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right: Synopsis & Metadata */}
                <div className="md:col-span-2 space-y-4">
                  {/* Genre Pills */}
                  <div className="flex flex-wrap gap-2">
                    {activeMovie.genres?.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700/60"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Synopsis */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />{' '}
                      Storyline & Overview
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {cleanSummary}
                    </p>
                  </div>

                  {/* Spec Details Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-500 block">Premiered</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {activeMovie.premiered || '2024'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Runtime</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {activeMovie.runtime || 120} Minutes
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Language</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {activeMovie.language || 'English'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {activeMovie.status || 'Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Age Advisory</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {activeMovie.ageRating || 'PG-13'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ticket Base Price</span>
                      <span className="text-violet-600 dark:text-violet-400 font-bold">
                        ${activeMovie.ticketPrice || 14} / seat
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cast & Crew Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    Featured Cast & Characters
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Click any actor to filter movies featuring them
                  </span>
                </div>

                {isLoadingCast ? (
                  <div className="py-8 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-spin mr-2" />
                    Loading cast members...
                  </div>
                ) : castList.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
                    Cast information is currently being updated for this title.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {castList.slice(0, 8).map((cast) => {
                      const actorPhoto =
                        cast.person.image?.medium ||
                        cast.character.image?.medium ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

                      return (
                        <div
                          key={cast.person.id || cast.id}
                          onClick={() => handleActorClick(cast)}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-violet-500/60 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-all flex items-center gap-3 group shadow-sm"
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                            <img
                              src={actorPhoto}
                              alt={cast.person.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors truncate">
                              {cast.person.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              as {cast.character.name || 'Star'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Reviews & Ratings Tab */
            <div className="space-y-6">
              {/* Write a Review Card */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Write an Audience
                  Review
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cinema Fan"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Your Rating ({reviewRating}/10 ⭐)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your thoughts about the acting, cinematography, story..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {reviewSubmitted && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Review posted successfully!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="ml-auto px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Review
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Community Reviews
                </h3>
                {movieReviews.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
                    No reviews yet. Be the first to review this title!
                  </div>
                ) : (
                  movieReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {rev.author}
                            </h4>
                            <span className="text-[10px] text-slate-500">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs">
                          <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                          <span>{rev.rating.toFixed(1)} / 10</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Modal Footer CTA */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              onClick={() => openTrailerModal(activeMovie)}
              className="sm:hidden text-xs text-violet-600 dark:text-violet-400 font-bold flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-violet-600 dark:fill-violet-400" /> Trailer
            </button>

            {activeMovie.officialSite && (
              <a
                href={activeMovie.officialSite}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hidden sm:flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> Official Page
              </a>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeDetailsModal();
                  openBookingModal(activeMovie);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4" />
                Select Seats & Book Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
