'use client';

import React from 'react';
import { useFilters } from '../context/FilterContext';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PAGINATION_STYLES } from '../constants/pagination';

interface PaginationProps {
  totalItems: number;
}

export default function Pagination({ totalItems }: PaginationProps) {
  const { filters, setPage, setItemsPerPage } = useFilters();
  const { page, itemsPerPage } = filters;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems <= 0) return null;

  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(page * itemsPerPage, totalItems);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      range.unshift(-1); // ellipsis
    }
    if (page + delta < totalPages - 1) {
      range.push(-2); // ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className={PAGINATION_STYLES.container}>
      {/* Items per page selector & result count */}
      <div className={PAGINATION_STYLES.infoText}>
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{startIndex}</strong> -{' '}
          <strong className="text-slate-900 dark:text-white">{endIndex}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white">{totalItems}</strong> movies
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-slate-500 hidden sm:inline">Per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className={PAGINATION_STYLES.perPageSelect}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className={PAGINATION_STYLES.controlsContainer}>
        {/* First Page */}
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className={PAGINATION_STYLES.navButton}
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Prev Page */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={PAGINATION_STYLES.navButton}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered Pills */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p < 0) {
              return (
                <span key={`ellipsis-${idx}`} className={PAGINATION_STYLES.ellipsis}>
                  ...
                </span>
              );
            }

            const isActive = p === page;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={
                  isActive
                    ? PAGINATION_STYLES.pageButtonActive
                    : PAGINATION_STYLES.pageButtonInactive
                }
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={PAGINATION_STYLES.navButton}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
          className={PAGINATION_STYLES.navButton}
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
