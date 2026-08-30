'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { Ticket, X, Calendar, Clock, MapPin, Eye } from 'lucide-react';

export default function BookingHistoryModal({ onClose }: { onClose: () => void }) {
  const { bookingHistory, openTicketPass } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Booked Tickets History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {bookingHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Ticket className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600 opacity-50" />
              <p>No booked tickets found yet. Select a movie to book seats!</p>
            </div>
          ) : (
            bookingHistory.map((invoice) => (
              <div
                key={invoice.bookingId}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-violet-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/40">
                      {invoice.bookingId}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {invoice.timestamp}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {invoice.items.map((i) => i.movie.name).join(', ')}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {invoice.items[0]?.showDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {invoice.items[0]?.showTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {invoice.items[0]?.cinemaHall}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Seats:{' '}
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {invoice.items
                        .flatMap((i) => i.seats.map((s) => `${s.row}${s.number}`))
                        .join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Total Paid
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ${invoice.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      openTicketPass(invoice);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 hover:bg-violet-600 dark:bg-violet-600/20 dark:hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-300 dark:hover:text-white border border-violet-200 dark:border-violet-500/30 text-xs font-semibold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Ticket
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
