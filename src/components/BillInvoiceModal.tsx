'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  CreditCard,
  QrCode,
  Wallet,
  Receipt,
  Lock,
  Sparkles,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export default function BillInvoiceModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    cartItems,
    subtotal,
    convenienceFee,
    taxAmount,
    discountAmount,
    activeCoupon,
    grandTotal,
    completeBooking,
    openTicketPass,
  } = useCart();

  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [customerEmail, setCustomerEmail] = useState('alex.morgan@cinema.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 438-9201');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen || cartItems.length === 0) return null;

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const invoice = completeBooking({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : paymentMethod === 'upi'
              ? 'Digital UPI / Wallet'
              : 'Pay at Counter',
      });
      openTicketPass(invoice);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Invoice & Ticket Checkout
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review your bill breakdown and complete booking
              </p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmPayment} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Customer & Payment details (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Customer Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-600 dark:text-violet-400" /> 1. Customer
                  Information
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input
                        required
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input
                          required
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input
                          required
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" /> 2. Payment
                  Method
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'card'
                        ? 'bg-violet-100 dark:bg-violet-950/60 border-violet-500 text-violet-900 dark:text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span>Card / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'upi'
                        ? 'bg-violet-100 dark:bg-violet-950/60 border-violet-500 text-violet-900 dark:text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>UPI / QR Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'cash'
                        ? 'bg-violet-100 dark:bg-violet-950/60 border-violet-500 text-violet-900 dark:text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Box Office</span>
                  </button>
                </div>

                {/* Simulated payment inputs */}
                {paymentMethod === 'card' && (
                  <div className="space-y-2.5 pt-2 text-xs">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          defaultValue="888"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <div className="w-24 h-24 mx-auto bg-white rounded-lg p-2 flex items-center justify-center shadow-md border border-slate-200">
                      <QrCode className="w-full h-full text-slate-950" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Scan QR code via Google Pay, Apple Pay, PhonePe, or Paytm
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    💡 Pay in cash or card directly at the cinema counter by showing your digital
                    booking ID pass.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Itemized Invoice Breakdown (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <Receipt className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Itemized
                  Bill Breakdown
                </h3>

                {/* Items preview */}
                <div className="py-3 space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span className="line-clamp-1">{item.movie.name}</span>
                        <span>${item.totalItemPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.seats.length} Tickets (
                        {item.seats.map((s) => s.row + s.number).join(', ')})
                      </div>
                      {item.snacks.length > 0 && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          + {item.snacks.map((s) => `${s.snack.name} (x${s.quantity})`).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Calculation lines */}
                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Base Subtotal</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cinema Convenience Fee</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      ${convenienceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Integrated Entertainment Tax (10%)</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount ({activeCoupon})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-base font-black text-slate-900 dark:text-white">
                    <span>Grand Net Amount</span>
                    <span className="text-xl text-emerald-600 dark:text-emerald-400">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generating Invoice & Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay & Generate Ticket (${grandTotal.toFixed(2)})</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure 256-bit Simulated Payment Gateway
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
