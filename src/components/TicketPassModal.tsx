'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  QrCode,
  Sparkles,
  Popcorn,
  Film,
} from 'lucide-react';

export default function TicketPassModal() {
  const { activeInvoice, closeTicketPass } = useCart();

  if (!activeInvoice) return null;

  const firstItem = activeInvoice.items[0];
  const movie = firstItem?.movie;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Controls */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Booking Confirmed & Ticket Generated!</span>
          </div>
          <button
            onClick={closeTicketPass}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 overflow-y-auto print-container">
          {/* Futuristic Cinema Ticket Boarding Pass */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/80 border border-violet-500/40 p-6 sm:p-8 shadow-2xl shadow-violet-950/50 overflow-hidden">
            {/* Holographic Watermark glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Ticket Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-amber-500 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                    <Film className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <span className="font-black text-sm tracking-wider text-white">
                    CINE<span className="text-amber-400">PULSE</span> PASS
                  </span>
                  <span className="block text-[9px] uppercase tracking-widest text-violet-400 font-bold">
                    Official Digital Admission
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Booking ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-amber-400 tracking-wider">
                  {activeInvoice.bookingId}
                </span>
              </div>
            </div>

            {/* Main Movie & Seat Showcase */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Poster Thumbnail */}
              {movie?.image?.medium && (
                <div className="sm:col-span-3 w-24 sm:w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-slate-700 hidden sm:block">
                  <img
                    src={movie.image.medium}
                    alt={movie.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Movie Title & Logistics */}
              <div
                className={
                  movie?.image?.medium ? 'sm:col-span-9 space-y-3' : 'sm:col-span-12 space-y-3'
                }
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-400 tracking-widest">
                    Admit Ticket Holder
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {activeInvoice.items.map((i) => i.movie.name).join(' & ')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Guest: <strong className="text-slate-200">{activeInvoice.customerName}</strong>
                  </p>
                </div>

                {/* Specs Pill Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Date
                    </span>
                    <span className="font-bold text-slate-200">{firstItem?.showDate}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Showtime
                    </span>
                    <span className="font-bold text-amber-300">{firstItem?.showTime}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" /> Cinema Hall
                    </span>
                    <span className="font-bold text-slate-200 line-clamp-1">
                      {firstItem?.cinemaHall}
                    </span>
                  </div>
                </div>

                {/* Seat Numbers Highlight */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
                      Confirmed Seats
                    </span>
                    <span className="text-lg sm:text-xl font-black text-amber-300 font-mono tracking-wider">
                      {activeInvoice.items
                        .flatMap((i) => i.seats.map((s) => `${s.row}${s.number}`))
                        .join(', ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Total Paid
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      ${activeInvoice.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Snacks Included */}
                {activeInvoice.baseSnacksTotal > 0 && (
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <Popcorn className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Snacks:{' '}
                      {activeInvoice.items
                        .flatMap((i) => i.snacks.map((s) => `${s.snack.name} (x${s.quantity})`))
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Perforated Divider line */}
            <div className="relative my-4 flex items-center justify-between">
              <div className="w-4 h-8 rounded-r-full bg-slate-900 -ml-8 border-r border-slate-800" />
              <div className="w-full border-t-2 border-dashed border-slate-800 mx-2" />
              <div className="w-4 h-8 rounded-l-full bg-slate-900 -mr-8 border-l border-slate-800" />
            </div>

            {/* Ticket Footer & QR Code */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-1.5 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-full h-full text-slate-950" />
                </div>
                <div className="text-xs space-y-0.5 text-center sm:text-left">
                  <span className="font-bold text-white block">Scan at Cinema Entrance</span>
                  <span className="text-[10px] text-slate-500 block">
                    Valid for 1-time entrance • Doors open 15m prior
                  </span>
                  <span className="font-mono text-[10px] text-violet-400">
                    GATE-A • VIP FAST TRACK
                  </span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="font-mono text-slate-600 text-xs tracking-widest select-none hidden sm:block text-right">
                <div className="h-6 flex items-center gap-0.5 justify-end">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-slate-400"
                      style={{
                        width: (i % 3 === 0 ? 3 : 1.5) + 'px',
                        height: '100%',
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-slate-500">{activeInvoice.bookingId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4 text-violet-400" />
            Print / Save PDF
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `CinePulse Booking Confirmed: ${activeInvoice.bookingId} for ${firstItem?.movie.name}`
                );
                alert('Ticket booking reference copied to clipboard!');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>

            <button
              onClick={closeTicketPass}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all"
            >
              Book Another Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
