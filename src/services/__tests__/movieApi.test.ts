import { describe, it, expect } from 'vitest';
import {
  getMovieTrailer,
  extractUniqueGenres,
  extractUniqueLanguages,
  extractLiveActors,
  CINEMA_SNACKS,
  CINEMA_CITIES,
} from '../movieApi';
import { Movie } from '../../types/movie';

const mockMovies: Movie[] = [
  {
    id: 101,
    name: 'Interstellar Odyssey',
    type: 'Movie',
    language: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    status: 'Running',
    runtime: 169,
    rating: { average: 9.0 },
    image: {
      medium: 'https://example.com/medium1.jpg',
      original: 'https://example.com/original1.jpg',
    },
    summary: 'A futuristic space journey.',
    industry: 'Hollywood',
    mediaType: 'Movie',
    ticketPrice: 16,
    director: 'Christopher N.',
    trailerUrl: 'https://www.youtube.com/watch?v=custom-trailer',
    _embedded: {
      cast: [
        {
          id: 1,
          person: {
            id: 501,
            name: 'Matthew McConaughey',
            gender: 'Male',
            birthday: '1969-11-04',
            country: { name: 'USA', code: 'US' },
          },
          character: { id: 601, name: 'Cooper' },
        },
      ],
    },
  },
  {
    id: 102,
    name: 'Cyber Horizon',
    type: 'Web Series',
    language: 'Japanese',
    genres: ['Sci-Fi', 'Animation', 'Action'],
    status: 'Running',
    runtime: 45,
    rating: { average: 8.5 },
    image: {
      medium: 'https://example.com/medium2.jpg',
      original: 'https://example.com/original2.jpg',
    },
    summary: 'Cybernetic detective in Neo Tokyo.',
    industry: 'Hollywood',
    mediaType: 'Web Series',
    ticketPrice: 15,
    _embedded: {
      cast: [
        {
          id: 2,
          person: {
            id: 502,
            name: 'Kenji Sato',
            gender: 'Male',
          },
          character: { id: 602, name: 'Agent K' },
        },
      ],
    },
  },
];

describe('movieApi Service Unit Tests', () => {
  describe('Trailer URL Resolution', () => {
    it('returns custom trailerUrl if provided in movie object', () => {
      const trailer = getMovieTrailer(mockMovies[0]);
      expect(trailer).toBe('https://www.youtube.com/watch?v=custom-trailer');
    });

    it('returns a fallback valid trailer url when trailerUrl is undefined', () => {
      const movieWithoutTrailer = { ...mockMovies[1], trailerUrl: undefined };
      const trailer = getMovieTrailer(movieWithoutTrailer);
      expect(trailer).toBeDefined();
      expect(trailer).toContain('youtube');
    });
  });

  describe('extractUniqueGenres', () => {
    it('extracts, deduplicates, and sorts genres alphabetically', () => {
      const genres = extractUniqueGenres(mockMovies);
      expect(genres).toEqual(['Action', 'Adventure', 'Animation', 'Drama', 'Sci-Fi']);
    });

    it('returns empty array when input movies list is empty', () => {
      expect(extractUniqueGenres([])).toEqual([]);
    });
  });

  describe('extractUniqueLanguages', () => {
    it('extracts, deduplicates, and sorts languages alphabetically', () => {
      const languages = extractUniqueLanguages(mockMovies);
      expect(languages).toEqual(['English', 'Japanese']);
    });

    it('handles movies with missing language gracefully', () => {
      const moviesWithMissingLang: Movie[] = [
        { ...mockMovies[0], language: '' },
        { ...mockMovies[1], language: 'French' },
      ];
      const languages = extractUniqueLanguages(moviesWithMissingLang);
      expect(languages).toEqual(['French']);
    });
  });

  describe('extractLiveActors', () => {
    it('extracts unique cast members from embedded payload', () => {
      const actors = extractLiveActors(mockMovies);
      expect(actors.length).toBe(2);
      expect(actors.map((a) => a.name)).toEqual(['Matthew McConaughey', 'Kenji Sato']);
    });

    it('deduplicates cast members who appear across multiple movies', () => {
      const duplicatedCastMovies: Movie[] = [
        mockMovies[0],
        {
          ...mockMovies[1],
          _embedded: {
            cast: [
              {
                id: 3,
                person: {
                  id: 501,
                  name: 'Matthew McConaughey',
                },
                character: { id: 603, name: 'Guest Role' },
              },
            ],
          },
        },
      ];

      const actors = extractLiveActors(duplicatedCastMovies);
      expect(actors.length).toBe(1);
      expect(actors[0].name).toBe('Matthew McConaughey');
    });
  });

  describe('Cinema Static Data', () => {
    it('has valid cinema snacks configuration with positive prices', () => {
      expect(CINEMA_SNACKS.length).toBeGreaterThan(0);
      CINEMA_SNACKS.forEach((snack) => {
        expect(snack.id).toBeDefined();
        expect(snack.name).toBeTruthy();
        expect(snack.price).toBeGreaterThan(0);
      });
    });

    it('has recognized cinema cities with flags', () => {
      expect(CINEMA_CITIES.length).toBeGreaterThan(0);
      const nyc = CINEMA_CITIES.find((c) => c.id === 'nyc');
      expect(nyc).toBeDefined();
      expect(nyc?.name).toBe('New York');
    });

    it('deliberate CI failure demonstration: expects 1 to equal 2', () => {
      // Intentionally failing test case to demonstrate GitHub Actions failure detection
      expect(1).toBe(2);
    });
  });
});
