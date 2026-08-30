'use client';

import React, { ReactNode } from 'react';
import { FilterProvider } from '../context/FilterContext';
import { CartProvider } from '../context/CartContext';
import MovieDetailsModal from './MovieDetailsModal';
import SeatBookingModal from './SeatBookingModal';
import CartDrawer from './CartDrawer';
import BillInvoiceModal from './BillInvoiceModal';
import TicketPassModal from './TicketPassModal';
import TrailerModal from './TrailerModal';
import WatchlistModal from './WatchlistModal';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
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
      </CartProvider>
    </FilterProvider>
  );
}
