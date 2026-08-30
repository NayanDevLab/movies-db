/**
 * UI Style Constants for Pagination Component
 */
export const PAGINATION_STYLES = {
  container:
    'py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/80 text-xs',
  infoText: 'flex items-center gap-3 text-slate-600 dark:text-slate-400',
  perPageSelect:
    'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 cursor-pointer',
  controlsContainer: 'flex items-center gap-1.5',
  navButton:
    'p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
  pageButtonActive:
    'w-8 h-8 rounded-xl font-bold transition-all text-xs bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30',
  pageButtonInactive:
    'w-8 h-8 rounded-xl font-bold transition-all text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800',
  ellipsis: 'px-2 text-slate-400 dark:text-slate-600 font-bold',
} as const;
