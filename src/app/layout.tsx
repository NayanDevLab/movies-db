import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '../components/ClientProviders';

export const metadata: Metadata = {
  title: 'CinePulse | Movie Explorer & Cinema Ticket Booking',
  description:
    'Discover trending movies, explore actor/actress cast details, apply advanced filters, select cinema seats, generate itemized bills, and book digital movie passes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased flex flex-col transition-colors duration-200">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
