'use client';

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia(query);
    
    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    // Initial check
    updateMatch(media);

    // Add listener
    if ('addEventListener' in media) {
      media.addEventListener('change', updateMatch);
    } else {
      // Fallback for older browsers
      (media as any).addListener(updateMatch);
    }

    return () => {
      // Cleanup
      if ('removeEventListener' in media) {
        media.removeEventListener('change', updateMatch);
      } else {
        // Fallback for older browsers
        (media as any).removeListener(updateMatch);
      }
    };
  }, [query]);

  // Return false on the server, true only on the client if it matches
  return mounted ? matches : false;
};

export default useMediaQuery; 