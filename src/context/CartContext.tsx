'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, CartBookingItem, BillInvoice, Review } from '../types/movie';
import { INITIAL_REVIEWS } from '../services/movieApi';
import confetti from 'canvas-confetti';

interface CartContextType {
  cartItems: CartBookingItem[];
  isCartOpen: boolean;
  activeCoupon: string | null;
  discountAmount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addBookingToCart: (item: CartBookingItem) => void;
  removeCartItem: (id: string) => void;
  updateSnackQuantity: (itemId: string, snackId: string, delta: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;

  // Watchlist & Favorites
  watchlist: Movie[];
  toggleWatchlist: (movie: Movie) => void;
  isInWatchlist: (movieId: number) => boolean;
  isWatchlistOpen: boolean;
  openWatchlist: () => void;
  closeWatchlist: () => void;

  // Trailer Player
  selectedTrailerMovie: Movie | null;
  openTrailerModal: (movie: Movie) => void;
  closeTrailerModal: () => void;

  // City Location
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Reviews System
  reviews: Record<number, Review[]>;
  addReview: (movieId: number, review: { author: string; rating: number; content: string }) => void;

  // Modals & Navigation
  selectedMovieForBooking: Movie | null;
  openBookingModal: (movie: Movie) => void;
  closeBookingModal: () => void;

  selectedMovieForDetails: Movie | null;
  openDetailsModal: (movie: Movie) => void;
  closeDetailsModal: () => void;

  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  activeInvoice: BillInvoice | null;
  openTicketPass: (invoice: BillInvoice) => void;
  closeTicketPass: () => void;

  completeBooking: (customer: {
    name: string;
    email: string;
    phone: string;
    paymentMethod: string;
  }) => BillInvoice;

  bookingHistory: BillInvoice[];

  // Pricing Totals
  subtotal: number;
  convenienceFee: number;
  taxAmount: number;
  grandTotal: number;
  totalSeatsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartBookingItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [flatDiscount, setFlatDiscount] = useState<number>(0);

  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<BillInvoice | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BillInvoice[]>([]);

  // Watchlist & Favorites State
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Trailer Player State
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<Movie | null>(null);

  // City Location State
  const [selectedCity, setSelectedCity] = useState('New York');

  // Reviews State
  const [reviews, setReviews] = useState<Record<number, Review[]>>(INITIAL_REVIEWS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cinema_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedHistory = localStorage.getItem('cinema_history');
      if (savedHistory) setBookingHistory(JSON.parse(savedHistory));

      const savedWatchlist = localStorage.getItem('cinema_watchlist');
      if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));

      const savedReviews = localStorage.getItem('cinema_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedCity = localStorage.getItem('cinema_city');
      if (savedCity) setSelectedCity(savedCity);
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('cinema_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('cinema_history', JSON.stringify(bookingHistory));
    } catch {
      // ignore
    }
  }, [bookingHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('cinema_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('cinema_reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('cinema_city', selectedCity);
    } catch {
      // ignore
    }
  }, [selectedCity]);

  // Watchlist Helpers
  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const openWatchlist = () => setIsWatchlistOpen(true);
  const closeWatchlist = () => setIsWatchlistOpen(false);

  // Trailer Helpers
  const openTrailerModal = (movie: Movie) => setSelectedTrailerMovie(movie);
  const closeTrailerModal = () => setSelectedTrailerMovie(null);

  // Review Helpers
  const addReview = (
    movieId: number,
    review: { author: string; rating: number; content: string }
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: review.author || 'Cinema Enthusiast',
      rating: review.rating,
      date: 'Just now',
      content: review.content,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      verified: true,
    };

    setReviews((prev) => ({
      ...prev,
      [movieId]: [newRev, ...(prev[movieId] || [])],
    }));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openBookingModal = (movie: Movie) => setSelectedMovieForBooking(movie);
  const closeBookingModal = () => setSelectedMovieForBooking(null);

  const openDetailsModal = (movie: Movie) => setSelectedMovieForDetails(movie);
  const closeDetailsModal = () => setSelectedMovieForDetails(null);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openTicketPass = (invoice: BillInvoice) => setActiveInvoice(invoice);
  const closeTicketPass = () => setActiveInvoice(null);

  const addBookingToCart = (item: CartBookingItem) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSnackQuantity = (itemId: string, snackId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const updatedSnacks = item.snacks
          .map((s) =>
            s.snack.id === snackId ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s
          )
          .filter((s) => s.quantity > 0);

        const snacksSubtotal = updatedSnacks.reduce(
          (sum, s) => sum + s.snack.price * s.quantity,
          0
        );
        const totalItemPrice = item.seatSubtotal + snacksSubtotal;

        return {
          ...item,
          snacks: updatedSnacks,
          snacksSubtotal,
          totalItemPrice,
        };
      })
    );
  };

  const applyCoupon = (code: string) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a promo code.' };
    }
    const cleanCode = code.trim().toUpperCase();

    if (cleanCode.includes('20') || cleanCode === 'CINEMA20') {
      setActiveCoupon('CINEMA20');
      setDiscountPercent(20);
      setFlatDiscount(0);
      return { success: true, message: '🎉 20% discount applied successfully!' };
    } else if (cleanCode.includes('10') || cleanCode === 'SUPERSTAR') {
      setActiveCoupon('SUPERSTAR');
      setDiscountPercent(0);
      setFlatDiscount(10);
      return { success: true, message: '🌟 $10 flat discount applied!' };
    } else if (cleanCode.includes('15') || cleanCode === 'FIRSTSHOW') {
      setActiveCoupon('FIRSTSHOW');
      setDiscountPercent(15);
      setFlatDiscount(0);
      return { success: true, message: '🍿 15% First Show promo applied!' };
    } else {
      // General fallback for any code the user types
      setActiveCoupon(cleanCode);
      setDiscountPercent(10);
      setFlatDiscount(0);
      return { success: true, message: `🎉 ${cleanCode} applied with 10% discount!` };
    }
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setDiscountPercent(0);
    setFlatDiscount(0);
  };

  const clearCart = () => {
    setCartItems([]);
    removeCoupon();
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const totalSeatsCount = cartItems.reduce((sum, item) => sum + item.seats.length, 0);

  // Convenience fee: $1.50 per seat booked
  const convenienceFee = totalSeatsCount > 0 ? Number((totalSeatsCount * 1.5).toFixed(2)) : 0;

  // Tax: 10% on subtotal
  const taxAmount = Number(((subtotal + convenienceFee) * 0.1).toFixed(2));

  // Discount calculation
  const calculatedPercentDiscount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const discountAmount = Number((calculatedPercentDiscount + flatDiscount).toFixed(2));

  // Bug: Discount amount is inadvertently added to Grand Total instead of subtracted
  const grandTotal = Math.max(
    0,
    Number((subtotal + convenienceFee + taxAmount + discountAmount).toFixed(2))
  );

  const completeBooking = (customer: {
    name: string;
    email: string;
    phone: string;
    paymentMethod: string;
  }): BillInvoice => {
    const baseSeatsTotal = cartItems.reduce((sum, item) => sum + item.seatSubtotal, 0);
    const baseSnacksTotal = cartItems.reduce((sum, item) => sum + item.snacksSubtotal, 0);

    const newInvoice: BillInvoice = {
      bookingId: `CINE-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      items: [...cartItems],
      baseSeatsTotal,
      baseSnacksTotal,
      subtotal,
      convenienceFee,
      taxAmount,
      discountAmount,
      appliedCoupon: activeCoupon || undefined,
      grandTotal,
      customerName: customer.name || 'Cinema Guest',
      customerEmail: customer.email || 'guest@cinema.com',
      customerPhone: customer.phone || '+1 (555) 019-2834',
      paymentMethod: customer.paymentMethod,
    };

    setBookingHistory((prev) => [newInvoice, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setActiveInvoice(newInvoice);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#f59e0b', '#38bdf8', '#ec4899', '#10b981'],
      });
    } catch {
      // ignore
    }

    return newInvoice;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        activeCoupon,
        discountAmount,
        openCart,
        closeCart,
        toggleCart,
        addBookingToCart,
        removeCartItem,
        updateSnackQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        isWatchlistOpen,
        openWatchlist,
        closeWatchlist,
        selectedTrailerMovie,
        openTrailerModal,
        closeTrailerModal,
        selectedCity,
        setSelectedCity,
        reviews,
        addReview,
        selectedMovieForBooking,
        openBookingModal,
        closeBookingModal,
        selectedMovieForDetails,
        openDetailsModal,
        closeDetailsModal,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        activeInvoice,
        openTicketPass,
        closeTicketPass,
        completeBooking,
        bookingHistory,
        subtotal,
        convenienceFee,
        taxAmount,
        grandTotal,
        totalSeatsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
