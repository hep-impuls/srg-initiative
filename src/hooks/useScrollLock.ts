import { useEffect, useState, useRef } from 'react';

export function useScrollLock(sensitivity: number = 50) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

      // Detect if user manually scrolled (not programmatic)
      if (Math.abs(currentScrollTop - lastScrollTop.current) > sensitivity) {
        setIsUserScrolling(true);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Reset after 3 seconds of no scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          setIsUserScrolling(false);
        }, 3000);
      }

      lastScrollTop.current = currentScrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [sensitivity]);

  const resumeAutoScroll = () => {
    setIsUserScrolling(false);
  };

  return { isUserScrolling, resumeAutoScroll };
}
