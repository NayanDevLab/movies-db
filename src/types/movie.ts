export interface CastMember {
  id: number;
  person: {
    id: number;
    name: string;
    image?: {
      medium?: string;
      original?: string;
    } | null;
    gender?: string;
    birthday?: string;
    country?: {
      name: string;
      code: string;
    } | null;
  };
  character: {
    id: number;
    name: string;
    image?: {
      medium?: string;
      original?: string;
    } | null;
  };
}

export interface ActorProfile {
  id: number;
  name: string;
  image?: {
    medium?: string;
    original?: string;
  } | null;
  gender?: string;
  birthday?: string;
  country?: {
    name: string;
    code: string;
  } | null;
}

export interface Movie {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime?: number | null;
  averageRuntime?: number | null;
  premiered?: string | null;
  ended?: string | null;
  officialSite?: string | null;
  schedule?: {
    time: string;
    days: string[];
  };
  rating?: {
    average?: number | null;
  };
  weight?: number;
  network?: {
    name: string;
    country?: {
      name: string;
    };
  } | null;
  image?: {
    medium?: string;
    original?: string;
  } | null;
  summary?: string | null;
  updated?: number;
  _embedded?: {
    cast?: CastMember[];
  };
  // Extended cinema metadata
  ticketPrice?: number;
  tagline?: string;
  backdrop?: string;
  ageRating?: string;
  director?: string;
  trailerUrl?: string;
  industry?: 'Hollywood' | 'Bollywood' | 'Tollywood' | 'Web Series';
  mediaType?: 'Movie' | 'Web Series';
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar: string;
  verified: boolean;
}

export interface FilterState {
  searchQuery: string;
  searchType: 'all' | 'movies' | 'actors';
  selectedIndustry: 'all' | 'hollywood' | 'bollywood' | 'tollywood' | 'web-series';
  selectedLanguage: string;
  selectedGenre: string;
  selectedCategory: string; // 'all' | 'now-showing' | 'top-rated' | 'trending' | 'premieres'
  minRating: number;
  selectedActor: string;
  sortBy: 'featured' | 'rating-desc' | 'rating-asc' | 'title-asc' | 'year-desc';
  page: number;
  itemsPerPage: number;
}

export type SeatTier = 'standard' | 'gold' | 'vip';

export interface Seat {
  id: string; // e.g. "A-1"
  row: string; // e.g. "A"
  number: number; // e.g. 1
  tier: SeatTier;
  price: number;
  isBooked?: boolean;
}

export interface SnackItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'popcorn' | 'beverage' | 'snack' | 'combo';
}

export interface CartBookingItem {
  id: string; // Unique cart item ID
  movie: Movie;
  showDate: string; // e.g. "2026-08-31"
  showTime: string; // e.g. "07:30 PM"
  cinemaHall: string; // e.g. "Screen 1 - IMAX Laser 3D"
  seats: Seat[];
  seatSubtotal: number;
  snacks: {
    snack: SnackItem;
    quantity: number;
  }[];
  snacksSubtotal: number;
  totalItemPrice: number;
}

export interface BillInvoice {
  bookingId: string;
  timestamp: string;
  items: CartBookingItem[];
  baseSeatsTotal: number;
  baseSnacksTotal: number;
  subtotal: number;
  convenienceFee: number;
  taxAmount: number;
  discountAmount: number;
  appliedCoupon?: string;
  grandTotal: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
}
