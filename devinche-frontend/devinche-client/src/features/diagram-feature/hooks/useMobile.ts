import { useSyncExternalStore } from 'react';

export const useIsMobile = (query: string = '(max-width: 768px)') => {
  const subscribe = (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false; 
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};