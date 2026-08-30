'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Trash2,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Popcorn,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Tag,
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeCartItem,
    updateSnackQuantity,
    subtotal,
    convenienceFee,
    taxAmount,
    discountAmount,
    grandTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    openCheckout,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ success?: boolean; message?: string } | null>(
    null
  );

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponStatus(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-bold text-white">Booking Cart & Summary</h2>
              <span className="px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 text-xs font-bold border border-violet-800">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Ticket className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
                <p className="text-sm font-medium">Your booking cart is currently empty.</p>
                <p className="text-xs text-slate-500">
                  Select your favorite movie and reserve your cinema seats!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-md"
                >
                  {/* Movie Info & Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                        <img
                          src={
                            item.movie.image?.medium ||
                            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80'
                          }
                          alt={item.movie.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-1">
                          {item.movie.name}
                        </h3>
                        <div className="flex flex-col text-[11px] text-slate-400 space-y-0.5 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-violet-400" /> {item.showDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> {item.showTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" /> {item.cinemaHall}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Reserved Seats List */}
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Seats:{' '}
                      <strong className="text-amber-400">
                        {item.seats.map((s) => `${s.row}${s.number}`).join(', ')}
                      </strong>
                    </span>
                    <span className="font-bold text-white">${item.seatSubtotal.toFixed(2)}</span>
                  </div>

                  {/* Snacks List in Item */}
                  {item.snacks.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-900">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Popcorn className="w-3 h-3 text-amber-400" /> Snacks & Combos:
                      </span>
                      {item.snacks.map(({ snack, quantity }) => (
                        <div
                          key={snack.id}
                          className="flex items-center justify-between text-xs bg-slate-900/60 p-1.5 rounded-lg"
                        >
                          <span className="text-slate-300">
                            {snack.name} (x{quantity})
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium">
                              ${(snack.price * quantity).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateSnackQuantity(item.id, snack.id, -1)}
                                className="w-5 h-5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center text-[10px]"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateSnackQuantity(item.id, snack.id, 1)}
                                className="w-5 h-5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center text-[10px]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Item Subtotal */}
                  <div className="pt-2 flex justify-between items-center text-xs font-bold text-slate-300">
                    <span>Item Total</span>
                    <span className="text-emerald-400 text-sm">
                      ${item.totalItemPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Bill Calculator */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. CINEMA20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {activeCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                    <span>Active: {activeCoupon}</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-white text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponStatus && !activeCoupon && (
                  <p className="text-[11px] text-red-400">{couponStatus.message}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-900">
                <div className="flex justify-between">
                  <span>Tickets & Snacks Subtotal</span>
                  <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience & Booking Fee</span>
                  <span className="text-slate-200">${convenienceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Integrated Taxes (10% GST/VAT)</span>
                  <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount Applied</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-black text-white">
                  <span>Grand Total</span>
                  <span className="text-lg text-emerald-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={openCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-600/30 active:scale-95 transition-all"
              >
                <span>Proceed to Bill & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
