import { useEffect, useState, useRef } from 'react';

export function useScrollLock(sensitivity: number = 50) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const markAsUserInteracting = () => {
      setIsUserScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 3000);
    };

    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

      // Detect if user manually scrolled (not programmatic)
      // Note: Smooth scrolling via CSS might interfere with delta detection
      if (Math.abs(currentScrollTop - lastScrollTop.current) > sensitivity) {
        markAsUserInteracting();
      }

      lastScrollTop.current = currentScrollTop;
    };

    // Listen for direct user inputs that cause or signify scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', markAsUserInteracting, { passive: true });
    window.addEventListener('touchmove', markAsUserInteracting, { passive: true });
    window.addEventListener('mousedown', markAsUserInteracting, { passive: true });
    window.addEventListener('hashchange', markAsUserInteracting, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', markAsUserInteracting);
      window.removeEventListener('touchmove', markAsUserInteracting);
      window.removeEventListener('mousedown', markAsUserInteracting);
      window.removeEventListener('hashchange', markAsUserInteracting);
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
