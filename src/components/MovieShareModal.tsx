'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Globe,
  QrCode,
  Sparkles,
} from 'lucide-react';

export default function MovieShareModal() {
  const { selectedShareMovie, closeShareModal } = useCart();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!selectedShareMovie) return null;

  // Code review opportunity 1: Hardcoded base URL instead of environment variable or window.location.origin
  const shareUrl = `https://cinepulse.com/movie/${selectedShareMovie.id}`;
  const shareText = `Check out "${selectedShareMovie.name}" on CinePulse! 🎬🍿`;

  // Code review opportunity 2: Hardcoded social share URLs directly inside inline handlers instead of helper/constants
  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      '_blank'
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleShareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  // Code review opportunity 3: setTimeout without cleanup and magic number 2500
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Code review opportunity 4: Long inline class string */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/15 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Share Movie</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share with friends and cinephiles
              </p>
            </div>
          </div>
          {/* Code review opportunity 5: Missing aria-label on close button */}
          <button
            onClick={closeShareModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Movie Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img
              src={
                selectedShareMovie.image?.medium ||
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80'
              }
              alt={selectedShareMovie.name}
              className="w-12 h-16 object-cover rounded-xl shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {selectedShareMovie.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedShareMovie.genres?.slice(0, 2).join(', ')} •{' '}
                {selectedShareMovie.runtime || 110}m
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Trending on CinePulse</span>
              </div>
            </div>
          </div>

          {/* Social Share Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2.5">
              Share on Social Platforms
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              <button
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 transition-all hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 transition-all hover:scale-105"
              >
                <Send className="w-5 h-5" />
                <span className="text-[10px] font-bold">X (Twitter)</span>
              </button>

              <button
                onClick={handleShareFacebook}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 transition-all hover:scale-105"
              >
                <Globe className="w-5 h-5" />
                <span className="text-[10px] font-bold">Facebook</span>
              </button>

              <button
                onClick={handleShareTelegram}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 transition-all hover:scale-105"
              >
                <Send className="w-5 h-5" />
                <span className="text-[10px] font-bold">Telegram</span>
              </button>
            </div>
          </div>

          {/* Copy Direct Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Copy Direct Referral Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Toggle */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQr ? 'Hide QR Code' : 'Show Share QR Code'}</span>
            </button>

            {showQr && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-slate-950" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scan this QR code with mobile camera to share movie page
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
