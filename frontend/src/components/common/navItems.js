import { Archive, FileText, Home, Star, Trash2, UserRound } from 'lucide-react';

/**
 * Navigation items. `available: false` items are shown so the final layout is
 * visible from Week 1, but they cannot be clicked until their week arrives.
 */
export const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home, available: true },
  { label: 'All Notes', to: '/notes', icon: FileText, available: false, week: 3 },
  { label: 'Favorites', to: '/notes?view=favorites', icon: Star, available: false, week: 3 },
  { label: 'Archived', to: '/notes?view=archived', icon: Archive, available: false, week: 3 },
  { label: 'Trash', to: '/notes?view=trash', icon: Trash2, available: false, week: 3 },
  { label: 'Profile', to: '/profile', icon: UserRound, available: false, week: 3 },
];
