'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterState, ActorProfile } from '../types/movie';

interface FilterContextType {
  filters: FilterState;
  selectedActorProfile: ActorProfile | null;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: FilterState['searchType']) => void;
  setSelectedIndustry: (industry: FilterState['selectedIndustry']) => void;
  setSelectedLanguage: (lang: string) => void;
  setSelectedGenre: (genre: string) => void;
  setSelectedCategory: (category: string) => void;
  setMinRating: (rating: number) => void;
  setSelectedActor: (actor: string) => void;
  setSelectedActorProfile: (profile: ActorProfile | null) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  searchType: 'all',
  selectedIndustry: 'all',
  selectedLanguage: 'all',
  selectedGenre: 'all',
  selectedCategory: 'all',
  minRating: 0,
  selectedActor: 'all',
  sortBy: 'featured',
  page: 1,
  itemsPerPage: 12,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedActorProfile, setSelectedActorProfileState] = useState<ActorProfile | null>(null);

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query, page: 1 }));
  };

  const setSearchType = (type: FilterState['searchType']) => {
    setFilters((prev) => ({ ...prev, searchType: type, page: 1 }));
  };

  const setSelectedIndustry = (industry: FilterState['selectedIndustry']) => {
    setFilters((prev) => ({ ...prev, selectedIndustry: industry, page: 1 }));
  };

  const setSelectedLanguage = (lang: string) => {
    setFilters((prev) => ({ ...prev, selectedLanguage: lang, page: 1 }));
  };

  const setSelectedGenre = (genre: string) => {
    setFilters((prev) => ({ ...prev, selectedGenre: genre, page: 1 }));
  };

  const setSelectedCategory = (category: string) => {
    setFilters((prev) => ({ ...prev, selectedCategory: category, page: 1 }));
  };

  const setMinRating = (rating: number) => {
    setFilters((prev) => ({ ...prev, minRating: rating, page: 1 }));
  };

  const setSelectedActor = (actor: string) => {
    setFilters((prev) => ({ ...prev, selectedActor: actor, page: 1 }));
    if (actor === 'all') {
      setSelectedActorProfileState(null);
    }
  };

  const setSelectedActorProfile = (profile: ActorProfile | null) => {
    setSelectedActorProfileState(profile);
    if (profile) {
      setFilters((prev) => ({ ...prev, selectedActor: profile.name, page: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, selectedActor: 'all', page: 1 }));
    }
  };

  const setSortBy = (sort: FilterState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy: sort, page: 1 }));
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    setFilters((prev) => ({ ...prev, itemsPerPage, page: 1 }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSelectedActorProfileState(null);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        selectedActorProfile,
        setSearchQuery,
        setSearchType,
        setSelectedIndustry,
        setSelectedLanguage,
        setSelectedGenre,
        setSelectedCategory,
        setMinRating,
        setSelectedActor,
        setSelectedActorProfile,
        setSortBy,
        setPage,
        setItemsPerPage,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};


export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

