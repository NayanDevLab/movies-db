'use client';

import React, { useState } from 'react';
import { Movie, Seat, CartBookingItem, SnackItem } from '../types/movie';
import { CINEMA_SNACKS } from '../services/movieApi';
import { useCart } from '../context/CartContext';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Popcorn,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

const DATES = [
  { id: 'today', label: 'Today', sub: 'Aug 30' },
  { id: 'tomorrow', label: 'Tomorrow', sub: 'Aug 31' },
  { id: 'day3', label: 'Sun', sub: 'Sep 01' },
  { id: 'day4', label: 'Mon', sub: 'Sep 02' },
  { id: 'day5', label: 'Tue', sub: 'Sep 03' },
];

const SCREENS = [
  { id: 'screen-1', name: 'Screen 1: IMAX Laser 3D', surcharge: 4 },
  { id: 'screen-2', name: 'Screen 2: Dolby Atmos 4K', surcharge: 2 },
  { id: 'screen-3', name: 'Screen 3: Gold VIP Lounge', surcharge: 6 },
];

const SHOWTIMES = ['10:30 AM', '01:45 PM', '05:00 PM', '08:30 PM', '11:15 PM'];

// Generate Cinema Hall Seat Grid (Rows A to F, 10 columns each)
const ROWS = [
  { row: 'A', tier: 'standard' as const, basePrice: 12 },
  { row: 'B', tier: 'standard' as const, basePrice: 12 },
  { row: 'C', tier: 'gold' as const, basePrice: 16 },
  { row: 'D', tier: 'gold' as const, basePrice: 16 },
  { row: 'E', tier: 'gold' as const, basePrice: 16 },
  { row: 'F', tier: 'vip' as const, basePrice: 22 },
];

// Pre-reserved seats for realistic cinema feel
const INITIAL_BOOKED_SEATS = ['A-3', 'A-4', 'C-5', 'C-6', 'D-2', 'D-3', 'E-7', 'F-4', 'F-5'];

export default function SeatBookingModal() {
  const { selectedMovieForBooking, closeBookingModal, addBookingToCart, openCheckout } = useCart();

  const [selectedDate, setSelectedDate] = useState(DATES[0].label + ', ' + DATES[0].sub);
  const [selectedScreen, setSelectedScreen] = useState(SCREENS[0]);
  const [selectedTime, setSelectedTime] = useState(SHOWTIMES[2]); // 05:00 PM
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [snackQuantities, setSnackQuantities] = useState<Record<string, number>>({});

  if (!selectedMovieForBooking) return null;

  const movie = selectedMovieForBooking;

  const toggleSeat = (row: string, number: number, tier: Seat['tier'], price: number) => {
    const seatId = `${row}-${number}`;
    const alreadySelected = selectedSeats.some((s) => s.id === seatId);

    if (alreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
    } else {
      // Calculate final price with screen surcharge
      const finalSeatPrice = price + selectedScreen.surcharge;
      setSelectedSeats((prev) => [
        ...prev,
        { id: seatId, row, number, tier, price: finalSeatPrice },
      ]);
    }
  };

  const handleSnackChange = (snackId: string, delta: number) => {
    setSnackQuantities((prev) => ({
      ...prev,
      [snackId]: Math.max(0, (prev[snackId] || 0) + delta),
    }));
  };

  const seatSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const selectedSnacksList = CINEMA_SNACKS.filter((s) => (snackQuantities[s.id] || 0) > 0).map(
    (snack) => ({
      snack,
      quantity: snackQuantities[snack.id],
    })
  );

  const snacksSubtotal = selectedSnacksList.reduce(
    (sum, item) => sum + item.snack.price * item.quantity,
    0
  );

  const totalBookingPrice = seatSubtotal + snacksSubtotal;

  const handleAddToCart = (proceedDirectlyToCheckout = false) => {
    if (selectedSeats.length === 0) return;

    const newBookingItem: CartBookingItem = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      movie,
      showDate: selectedDate,
      showTime: selectedTime,
      cinemaHall: selectedScreen.name,
      seats: selectedSeats,
      seatSubtotal,
      snacks: selectedSnacksList,
      snacksSubtotal,
      totalItemPrice: totalBookingPrice,
    };

    addBookingToCart(newBookingItem);
    closeBookingModal();

    if (proceedDirectlyToCheckout) {
      openCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{movie.name}</h2>
              <p className="text-xs text-slate-400">
                {movie.genres?.join(', ')} • {movie.runtime || 120} mins • {movie.ageRating || 'PG-13'}
              </p>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Booking Steps */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Select Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-400" /> 1. Select Date
            </label>
            <div className="grid grid-cols-5 gap-2">
              {DATES.map((d) => {
                const labelFull = `${d.label}, ${d.sub}`;
                const isSelected = selectedDate === labelFull;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDate(labelFull)}
                    className={`py-2.5 px-2 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30 font-bold'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{d.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{d.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Screen & Showtime */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Screen selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-violet-400" /> 2. Cinema Screen
              </label>
              <div className="space-y-1.5">
                {SCREENS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScreen(sc)}
                    className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between text-xs font-semibold transition-all ${
                      selectedScreen.id === sc.id
                        ? 'bg-purple-950/50 border-violet-500 text-white'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{sc.name}</span>
                    <span className="text-[11px] text-amber-400">+${sc.surcharge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" /> 3. Select Showtime
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SHOWTIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === time
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/25'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Interactive Cinema Hall Seat Layout */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-violet-400" /> 4. Select Your Seats
              </label>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800 opacity-40" />
                  <span>Booked</span>
                </div>
              </div>
            </div>

            {/* Cinema Screen Curve */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
              <div className="w-4/5 h-2 rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-[0_0_20px_rgba(139,92,246,0.6)] mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-6">
                Cinema Screen Direction
              </span>

              {/* Seat Matrix */}
              <div className="space-y-2.5 w-full max-w-lg overflow-x-auto pb-2">
                {ROWS.map((rowInfo) => (
                  <div key={rowInfo.row} className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="w-5 text-center text-xs font-bold text-slate-500">
                      {rowInfo.row}
                    </span>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {Array.from({ length: 8 }, (_, i) => i + 1).map((seatNum) => {
                        const seatId = `${rowInfo.row}-${seatNum}`;
                        const isBooked = INITIAL_BOOKED_SEATS.includes(seatId);
                        const isSelected = selectedSeats.some((s) => s.id === seatId);

                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() =>
                              toggleSeat(
                                rowInfo.row,
                                seatNum,
                                rowInfo.tier,
                                rowInfo.basePrice
                              )
                            }
                            className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all ${
                              isBooked
                                ? 'bg-slate-900/40 text-slate-700 cursor-not-allowed border border-slate-800/30'
                                : isSelected
                                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/40 scale-110'
                                : rowInfo.tier === 'vip'
                                ? 'bg-violet-950/60 hover:bg-violet-900 border border-violet-800/50 text-violet-300'
                                : rowInfo.tier === 'gold'
                                ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
                                : 'bg-slate-800/60 hover:bg-slate-700 border border-slate-800 text-slate-400'
                            }`}
                            title={`${rowInfo.row}${seatNum} (${rowInfo.tier.toUpperCase()}) - $${
                              rowInfo.basePrice + selectedScreen.surcharge
                            }`}
                          >
                            {seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tier Price Label */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-900 w-full">
                <span>
                  Rows A-B: Standard <strong className="text-white">${12 + selectedScreen.surcharge}</strong>
                </span>
                <span>
                  Rows C-E: Gold Prime <strong className="text-amber-400">${16 + selectedScreen.surcharge}</strong>
                </span>
                <span>
                  Row F: VIP Recliner <strong className="text-violet-400">${22 + selectedScreen.surcharge}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Step 4: Snacks & Beverages Combos */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Popcorn className="w-3.5 h-3.5 text-violet-400" /> 5. Add Gourmet Cinema Snacks
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CINEMA_SNACKS.map((snack) => {
                const qty = snackQuantities[snack.id] || 0;
                return (
                  <div
                    key={snack.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{snack.image}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{snack.name}</h4>
                        <span className="text-[11px] text-amber-400 font-semibold">
                          ${snack.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSnackChange(snack.id, -1)}
                        disabled={qty === 0}
                        className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                      <button
                        onClick={() => handleSnackChange(snack.id, 1)}
                        className="w-6 h-6 rounded-md bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Booking Action Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              Selected:{' '}
              {selectedSeats.length > 0 ? (
                <strong className="text-amber-400">
                  {selectedSeats.map((s) => `${s.row}${s.number}`).join(', ')} (
                  {selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'})
                </strong>
              ) : (
                <span className="text-slate-500">Please choose at least 1 seat</span>
              )}
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              Total: <span className="text-emerald-400">${totalBookingPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => handleAddToCart(false)}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-violet-400" />
              Add to Cart
            </button>

            <button
              disabled={selectedSeats.length === 0}
              onClick={() => handleAddToCart(true)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 fill-slate-950" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
