'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { FilterProvider } from '../context/FilterContext';
import { CartProvider } from '../context/CartContext';
import MovieDetailsModal from './MovieDetailsModal';
import SeatBookingModal from './SeatBookingModal';
import CartDrawer from './CartDrawer';
import BillInvoiceModal from './BillInvoiceModal';
import TicketPassModal from './TicketPassModal';
import TrailerModal from './TrailerModal';
import WatchlistModal from './WatchlistModal';
import MovieShareModal from './MovieShareModal';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FilterProvider>
        <CartProvider>
          {children}
          {/* Global Portals / Modals */}
          <MovieDetailsModal />
          <SeatBookingModal />
          <CartDrawer />
          <BillInvoiceModal />
          <TicketPassModal />
          <TrailerModal />
          <WatchlistModal />
          <MovieShareModal />
        </CartProvider>
      </FilterProvider>
    </ThemeProvider>
  );
}
