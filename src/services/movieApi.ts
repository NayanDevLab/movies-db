import { Movie, CastMember, SnackItem, Review, ActorProfile } from '../types/movie';

const TVMAZE_API_BASE = 'https://api.tvmaze.com';

export const CINEMA_CITIES = [
  { id: 'nyc', name: 'New York', state: 'NY, USA', flag: '🇺🇸' },
  { id: 'lax', name: 'Los Angeles', state: 'CA, USA', flag: '🇺🇸' },
  { id: 'lon', name: 'London', state: 'UK', flag: '🇬🇧' },
  { id: 'mum', name: 'Mumbai', state: 'India', flag: '🇮🇳' },
  { id: 'tok', name: 'Tokyo', state: 'Japan', flag: '🇯🇵' },
  { id: 'syd', name: 'Sydney', state: 'Australia', flag: '🇦🇺' },
];

export const INITIAL_REVIEWS: Record<number, Review[]> = {
  1: [
    {
      id: 'rev-1',
      author: 'David K. (Film Critic)',
      rating: 9.5,
      date: 'Aug 28, 2026',
      content:
        'A breathtaking emotional and visual triumph with exceptional production values and storytelling.',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      verified: true,
    },
    {
      id: 'rev-2',
      author: 'Sophia Chen',
      rating: 9.0,
      date: 'Aug 29, 2026',
      content:
        'Incredible cinematography and compelling character arcs. 10/10 recommendation for the big screen!',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      verified: true,
    },
  ],
};

export const CINEMA_SNACKS: SnackItem[] = [
  {
    id: 'snack-1',
    name: 'Caramel & Butter Jumbo Popcorn',
    description: 'Freshly popped gourmet dual-flavored popcorn with melted butter',
    price: 8.5,
    category: 'popcorn',
    image: '🍿',
  },
  {
    id: 'snack-2',
    name: 'Mexican Loaded Nachos with Cheese Dip',
    description: 'Crispy corn tortilla chips with warm jalapeño cheese and salsa',
    price: 7.0,
    category: 'snack',
    image: '🧀',
  },
  {
    id: 'snack-3',
    name: 'Ice-Cold Soda Duo (Coke / Sprite)',
    description: 'Large 750ml fountain dispenser with crushed ice',
    price: 5.0,
    category: 'beverage',
    image: '🥤',
  },
  {
    id: 'snack-4',
    name: 'Ultimate Cinema Combo Box',
    description: '1 Jumbo Popcorn + 2 Large Sodas + 1 Hot Cheese Nachos',
    price: 16.5,
    category: 'combo',
    image: '🎟️',
  },
];

// In-memory cache for fast lookup and deduplication
let cachedLiveMovies: Movie[] = [];
const castCache: Record<number, CastMember[]> = {};

const TRAILER_LIST = [
  'https://www.youtube-nocookie.com/embed/b9EkMc79ZSU', // Stranger Things
  'https://www.youtube-nocookie.com/embed/Di310BC806c', // Wednesday
  'https://www.youtube-nocookie.com/embed/uYPbbksJxIg', // Oppenheimer
  'https://www.youtube-nocookie.com/embed/Way9Dexny3w', // Dune 2
  'https://www.youtube-nocookie.com/embed/zSWdZVtXT7E', // Interstellar
  'https://www.youtube-nocookie.com/embed/ZNeGF-PvRHY', // Mirzapur
  'https://www.youtube-nocookie.com/embed/ngQKSTgH8iQ', // Family Man
  'https://www.youtube-nocookie.com/embed/mojZJ7oeD_g', // Panchayat
  'https://www.youtube-nocookie.com/embed/MWOlnZSnXJo', // Jawan
  'https://www.youtube-nocookie.com/embed/NgBoAMg485s', // RRR
];

export function getMovieTrailer(movie: Movie): string {
  if (movie.trailerUrl) return movie.trailerUrl;
  const idx = Math.abs(movie.id || 1) % TRAILER_LIST.length;
  return TRAILER_LIST[idx];
}

function normalizeLiveShow(show: any): Movie {
  const lang = show.language || 'English';
  const isIndian =
    show.network?.country?.code === 'IN' ||
    show.webChannel?.country?.code === 'IN' ||
    lang.toLowerCase() === 'hindi';

  const isSouthIndian =
    lang.toLowerCase() === 'telugu' ||
    lang.toLowerCase() === 'tamil' ||
    lang.toLowerCase() === 'malayalam' ||
    lang.toLowerCase() === 'kannada';

  const isSeries =
    show.type === 'Scripted' ||
    show.type === 'Reality' ||
    (show.runtime && show.runtime <= 75) ||
    !show.runtime;

  let industry: Movie['industry'] = 'Hollywood';
  if (isSouthIndian) {
    industry = 'Tollywood';
  } else if (isIndian) {
    industry = isSeries ? 'Web Series' : 'Bollywood';
  }

  const ratingAvg = show.rating?.average;
  const price = ratingAvg ? Math.max(10, Math.round(ratingAvg * 1.8)) : 14;

  return {
    id: show.id,
    name: show.name,
    type: show.type || 'Movie',
    language: lang,
    genres: show.genres || [],
    status: show.status || 'Running',
    runtime: show.runtime || show.averageRuntime || 110,
    averageRuntime: show.averageRuntime,
    premiered: show.premiered,
    ended: show.ended,
    officialSite: show.officialSite,
    rating: show.rating || { average: 8.0 },
    image: show.image || {
      medium:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
      original:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    },
    summary:
      show.summary ||
      '<p>An extraordinary cinematic experience featuring award-winning performances and captivating storytelling.</p>',
    updated: show.updated,
    _embedded: show._embedded,
    industry,
    mediaType: isSeries ? 'Web Series' : 'Movie',
    ticketPrice: price,
    tagline: show.genres?.length ? show.genres.join(' • ') : 'Award Winning Cinema',
    ageRating: ratingAvg && ratingAvg >= 8.5 ? 'UA 16+' : 'PG-13',
    director: show.network?.name || show.webChannel?.name || 'Grand Pictures',
    trailerUrl: TRAILER_LIST[Math.abs(show.id || 1) % TRAILER_LIST.length],
  };
}

/**
 * Fetch 100% REAL LIVE Movies and Series directly from the public TVMaze API
 */
export async function fetchMoviesList(): Promise<Movie[]> {
  if (cachedLiveMovies.length > 0) {
    return cachedLiveMovies;
  }

  try {
    // 1. Fetch top blockbuster search queries & popular pages in parallel
    const popularQueries = [
      'stranger',
      'thrones',
      'breaking',
      'boys',
      'wednesday',
      'last of us',
      'money',
      'squid',
      'shogun',
      'batman',
      'spider',
      'marvel',
      'avatar',
      'mirzapur',
      'sacred',
      'family man',
      'panchayat',
      'delhi crime',
      'hindi',
      'action',
      'thriller',
      'crime',
    ];

    const searchPromises = popularQueries.map((q) =>
      fetch(`${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json' },
      })
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => [])
    );

    // Also fetch page 0 for high-density live show list
    const pagePromise = fetch(`${TVMAZE_API_BASE}/shows?page=0`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    const [searchResults, pageResults] = await Promise.all([
      Promise.all(searchPromises),
      pagePromise,
    ]);

    const allRawShows: any[] = [];

    // Collect search query results
    searchResults.forEach((group: any[]) => {
      if (Array.isArray(group)) {
        group.forEach((item) => {
          if (item?.show?.image) {
            allRawShows.push(item.show);
          }
        });
      }
    });

    // Collect page results with images and high ratings
    if (Array.isArray(pageResults)) {
      pageResults.forEach((show) => {
        if (show?.image && (show.rating?.average >= 7.0 || show.weight >= 50)) {
          allRawShows.push(show);
        }
      });
    }

    // Deduplicate by show ID
    const seenIds = new Set<number>();
    const normalizedMovies: Movie[] = [];

    for (const raw of allRawShows) {
      if (!seenIds.has(raw.id)) {
        seenIds.add(raw.id);
        normalizedMovies.push(normalizeLiveShow(raw));
      }
    }

    // Sort by rating descending so top blockbusters appear first
    normalizedMovies.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));

    cachedLiveMovies = normalizedMovies;
    return cachedLiveMovies;
  } catch (error) {
    console.error('Error fetching live movies from API:', error);
    return [];
  }
}

/**
 * Search movies directly from live public TVMaze API
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) {
    return fetchMoviesList();
  }

  try {
    const response = await fetch(`${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();

    const results: Movie[] = data
      .filter((item: any) => item?.show?.image)
      .map((item: any) => normalizeLiveShow(item.show));

    return results;
  } catch (error) {
    console.error('Error searching live movies:', error);
    return [];
  }
}

/**
 * Search real actors and actresses 100% LIVE directly from public TVMaze API
 */
export async function searchActors(query: string): Promise<ActorProfile[]> {
  const cleanQ = query.trim();
  if (!cleanQ) {
    // If empty query, search for popular actors
    return searchActors('khan');
  }

  try {
    const res = await fetch(`${TVMAZE_API_BASE}/search/people?q=${encodeURIComponent(cleanQ)}`);
    if (!res.ok) throw new Error('Failed to search actors');
    const data = await res.json();

    const actors: ActorProfile[] = data
      .filter((item: any) => item.person && item.person.name)
      .map((item: any) => ({
        id: item.person.id,
        name: item.person.name,
        image: item.person.image,
        gender: item.person.gender,
        birthday: item.person.birthday,
        country: item.person.country,
      }));

    return actors;
  } catch (error) {
    console.error('Error searching live actors:', error);
    return [];
  }
}

/**
 * Fetch all movies/shows starring a specific actor 100% LIVE from API
 */
export async function fetchMoviesByActorId(personId: number, actorName: string): Promise<Movie[]> {
  try {
    // 1. Query live cast credits
    const res = await fetch(`${TVMAZE_API_BASE}/people/${personId}/castcredits?embed=show`);
    let liveShows: Movie[] = [];

    if (res.ok) {
      const data = await res.json();
      liveShows = data
        .filter((item: any) => item._embedded?.show && item._embedded.show.image)
        .map((item: any) => normalizeLiveShow(item._embedded.show));
    }

    // 2. If cast credits were empty or minimal, also search show titles by actor name
    if (liveShows.length === 0 && actorName) {
      const searchRes = await fetch(
        `${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(actorName)}`
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        liveShows = searchData
          .filter((item: any) => item.show && item.show.image)
          .map((item: any) => normalizeLiveShow(item.show));
      }
    }

    // Deduplicate
    const seen = new Set<number>();
    return liveShows.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  } catch (err) {
    console.error(`Error fetching credits for actor ${actorName} (${personId}):`, err);
    return [];
  }
}

/**
 * Fetch movie details with full Cast & Crew 100% LIVE from TVMaze API
 */
export async function fetchMovieDetailsWithCast(movieId: number): Promise<Movie> {
  if (castCache[movieId]) {
    const existing = cachedLiveMovies.find((m) => m.id === movieId);
    if (existing) {
      return { ...existing, _embedded: { cast: castCache[movieId] } };
    }
  }

  try {
    const res = await fetch(`${TVMAZE_API_BASE}/shows/${movieId}?embed=cast`);
    if (res.ok) {
      const data = await res.json();
      const movieWithCast = normalizeLiveShow(data);
      if (data._embedded?.cast) {
        castCache[movieId] = data._embedded.cast;
        movieWithCast._embedded = { cast: data._embedded.cast };
      }
      return movieWithCast;
    }
  } catch (error) {
    console.error(`Error fetching live cast for movie ID ${movieId}:`, error);
  }

  const fallback = cachedLiveMovies.find((m) => m.id === movieId);
  return fallback || normalizeLiveShow({ id: movieId, name: 'Cinema Feature' });
}

/**
 * Extract unique genres dynamically from live fetched movies
 */
export function extractUniqueGenres(movies: Movie[]): string[] {
  const genreSet = new Set<string>();
  movies.forEach((m) => {
    m.genres?.forEach((g) => genreSet.add(g));
  });
  return Array.from(genreSet).sort();
}

/**
 * Extract unique languages dynamically from live fetched movies
 */
export function extractUniqueLanguages(movies: Movie[]): string[] {
  const langSet = new Set<string>();
  movies.forEach((m) => {
    if (m.language) langSet.add(m.language);
  });
  return Array.from(langSet).sort();
}

/**
 * Extract live actors & actresses dynamically from live fetched movies
 */
export function extractLiveActors(movies: Movie[]): ActorProfile[] {
  const actorMap = new Map<string, ActorProfile>();

  movies.forEach((m) => {
    m._embedded?.cast?.forEach((c) => {
      if (c.person && c.person.name && !actorMap.has(c.person.name)) {
        actorMap.set(c.person.name, {
          id: c.person.id,
          name: c.person.name,
          gender: c.person.gender,
          birthday: c.person.birthday,
          country: c.person.country,
          image: c.person.image,
        });
      }
    });
  });

  return Array.from(actorMap.values());
}
