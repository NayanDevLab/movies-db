import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { Movie, CartBookingItem, BillInvoice } from '../../types/movie';

const mockMovie: Movie = {
  id: 1,
  name: 'Avengers: Secret Wars',
  type: 'Movie',
  language: 'English',
  genres: ['Action', 'Sci-Fi'],
  status: 'Running',
  runtime: 150,
  rating: { average: 9.2 },
  image: {
    medium: 'https://example.com/poster.jpg',
    original: 'https://example.com/poster-large.jpg',
  },
  summary: 'Earth heroes unite in the ultimate multiversal battle.',
  industry: 'Hollywood',
  mediaType: 'Movie',
  ticketPrice: 15,
};

const mockBookingItem: CartBookingItem = {
  id: 'cart-item-1',
  movie: mockMovie,
  showDate: 'Today, Aug 30',
  showTime: '07:30 PM',
  cinemaHall: 'Grand IMAX Laser 4K',
  seats: [
    { id: 'E-5', row: 'E', number: 5, tier: 'vip', price: 18 },
    { id: 'E-6', row: 'E', number: 6, tier: 'vip', price: 18 },
  ],
  snacks: [
    {
      snack: {
        id: 'snack-1',
        name: 'Caramel Popcorn',
        description: 'Large',
        price: 8.5,
        category: 'popcorn',
        image: '🍿',
      },
      quantity: 2,
    },
  ],
  seatSubtotal: 36,
  snacksSubtotal: 17,
  totalItemPrice: 53, // 36 + 17 = 53
};

describe('CartContext Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty cart and default zero values', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.grandTotal).toBe(0);
    expect(result.current.totalSeatsCount).toBe(0);
  });

  it('adds booking item to cart and calculates financial totals accurately', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addBookingToCart(mockBookingItem);
    });

    expect(result.current.cartItems.length).toBe(1);
    expect(result.current.totalSeatsCount).toBe(2);

    // Subtotal = $53
    expect(result.current.subtotal).toBe(53);

    // Convenience fee = $1.50 per seat * 2 seats = $3.00
    expect(result.current.convenienceFee).toBe(3);

    // Tax = 10% of (subtotal + fee) = 10% of 56 = $5.60
    expect(result.current.taxAmount).toBe(5.6);

    // Grand total = subtotal + fee + tax = 53 + 3 + 5.6 = 61.60
    expect(result.current.grandTotal).toBe(61.6);
  });

  it('updates snack quantities and dynamically recalculates total', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addBookingToCart(mockBookingItem);
    });

    // Increase popcorn quantity from 2 to 3 (+1)
    act(() => {
      result.current.updateSnackQuantity('cart-item-1', 'snack-1', 1);
    });

    const updatedItem = result.current.cartItems[0];
    const popcorn = updatedItem.snacks.find((s) => s.snack.id === 'snack-1');
    expect(popcorn?.quantity).toBe(3);
    // New total: 36 (seats) + 25.5 (3 * 8.5) = 61.5
    expect(result.current.subtotal).toBe(61.5);
  });

  it('applies promotional coupons and calculates discount accurately', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addBookingToCart(mockBookingItem);
    });

    // Test SUPERSTAR coupon ($10 flat discount)
    act(() => {
      const res = result.current.applyCoupon('SUPERSTAR');
      expect(res.success).toBe(true);
    });

    expect(result.current.activeCoupon).toBe('SUPERSTAR');
    expect(result.current.discountAmount).toBe(10);

    // Test CINEMA20 coupon (20% percentage discount on $53 subtotal = $10.60)
    act(() => {
      const res = result.current.applyCoupon('CINEMA20');
      expect(res.success).toBe(true);
    });

    expect(result.current.activeCoupon).toBe('CINEMA20');
    expect(result.current.discountAmount).toBe(10.6);

    // Test invalid coupon
    act(() => {
      const res = result.current.applyCoupon('INVALID_PROMO');
      expect(res.success).toBe(false);
    });
  });

  it('toggles movie into and out of watchlist', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    expect(result.current.isInWatchlist(mockMovie.id)).toBe(false);

    // Add to watchlist
    act(() => {
      result.current.toggleWatchlist(mockMovie);
    });

    expect(result.current.isInWatchlist(mockMovie.id)).toBe(true);
    expect(result.current.watchlist.length).toBe(1);

    // Remove from watchlist
    act(() => {
      result.current.toggleWatchlist(mockMovie);
    });

    expect(result.current.isInWatchlist(mockMovie.id)).toBe(false);
    expect(result.current.watchlist.length).toBe(0);
  });

  it('completes booking, empties cart, and generates confirmed invoice', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addBookingToCart(mockBookingItem);
    });

    let invoice: BillInvoice | undefined;
    act(() => {
      invoice = result.current.completeBooking({
        name: 'Jordan Smith',
        email: 'jordan@example.com',
        phone: '+1 555-0199',
        paymentMethod: 'Credit/Debit Card',
      });
    });

    expect(invoice).toBeDefined();
    expect(invoice?.bookingId).toContain('CINE-');
    expect(invoice?.customerName).toBe('Jordan Smith');
    expect(invoice?.items.length).toBe(1);

    // Cart is cleared after booking completion
    expect(result.current.cartItems.length).toBe(0);
    expect(result.current.bookingHistory.length).toBe(1);
  });
});
