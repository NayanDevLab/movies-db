/**
 * Shared UI constants & style definitions
 */

export const FALLBACK_POSTER_IMAGE =
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80';

export const FALLBACK_HERO_BACKDROP =
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80';

export const NAVBAR_STYLES = {
  header:
    'sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-[#0b0f19]/85 border-b border-slate-200 dark:border-violet-900/30 transition-colors duration-200 shadow-sm dark:shadow-none',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4',
  logoGradientText:
    'text-2xl font-black tracking-wider bg-gradient-to-r from-slate-900 via-slate-800 to-violet-600 dark:from-white dark:via-slate-100 dark:to-violet-400 bg-clip-text text-transparent',
  cityButton:
    'flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors',
  searchInput:
    'w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all',
  themeButton:
    'p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 shadow-sm flex items-center justify-center',
} as const;

export const WATCHLIST_STYLES = {
  card: 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-pink-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4',
  posterContainer:
    'w-12 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 border border-slate-300 dark:border-slate-700',
  removeButton:
    'p-2 rounded-xl bg-slate-100 hover:bg-red-500/20 dark:bg-slate-800 dark:hover:bg-red-500/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition-colors text-xs',
  bookButton:
    'flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/30 transition-all',
} as const;
