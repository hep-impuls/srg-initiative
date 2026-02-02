import { useEffect, useState, useRef, useCallback } from 'react';
import { TimelineEntry, AudioPlayerState, AudioDirectorState } from '@/types';
import { useScrollLock } from './useScrollLock';

export function useAudioDirector(timeline: TimelineEntry[]): AudioDirectorState {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTab, setCurrentTab] = useState<'theory' | 'data' | 'consequences'>('theory');
  const [activeElementIds, setActiveElementIds] = useState<string[]>([]);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    playbackRate: 1,
  });

  const { isUserScrolling, resumeAutoScroll } = useScrollLock();
  const currentCueIndex = useRef<number>(-1);
  const lastFocusedIds = useRef<string[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Extract chapters from timeline
  const chapters = timeline.filter(entry => entry.isChapter);

  // Find the current cue based on audio time
  const findCurrentCue = useCallback((currentTime: number): TimelineEntry | null => {
    // Find the last cue that has passed
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (currentTime >= timeline[i].seconds) {
        return timeline[i];
      }
    }
    return timeline[0] || null;
  }, [timeline]);

  // Create or get dimming overlay
  const getDimmingOverlay = useCallback(() => {
    if (!overlayRef.current) {
      const existingOverlay = document.getElementById('audio-director-overlay');
      if (existingOverlay) {
        overlayRef.current = existingOverlay as HTMLDivElement;
      } else {
        const overlay = document.createElement('div');
        overlay.id = 'audio-director-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 40;
          transition: opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
        `;
        // Create SVG with a path that will form the "hole"
        overlay.innerHTML = `
          <svg width="100%" height="100%" style="pointer-events: none;">
            <path d="" fill="rgba(0, 0, 0, 0.5)" fill-rule="evenodd" style="pointer-events: auto;"></path>
          </svg>
        `;
        document.body.appendChild(overlay);
        overlayRef.current = overlay;
      }
    }
    return overlayRef.current;
  }, []);

  // Update the overlay hole position
  const updateOverlayHole = useCallback((elementIds: string[]) => {
    const overlay = getDimmingOverlay();
    const path = overlay.querySelector('path');

    if (!elementIds.length || !path) {
      if (path) path.setAttribute('d', '');
      return;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Start with the full screen rectangle (clockwise)
    let d = `M0,0 H${windowWidth} V${windowHeight} H0 Z`;

    // Process each element to create holes
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Add hole path (counter-clockwise logic handled by evenodd rule, just drawing rect implies hole)
        d += ` M${rect.left},${rect.top} V${rect.bottom} H${rect.right} V${rect.top} Z`;
      }
    });

    path.setAttribute('d', d);
  }, [getDimmingOverlay]);

  // Remove focus from previous elements
  const clearFocus = useCallback(() => {
    const previousFocused = document.querySelectorAll('.audio-director-focused');
    previousFocused.forEach(el => el.classList.remove('audio-director-focused'));

    // Remove pulse rings
    const previousRings = document.querySelectorAll('.ring-2.ring-blue-400');
    previousRings.forEach(el => el.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2'));

    // Reset elevated parent z-indexes (cleanup legacy if any)
    const elevatedParents = document.querySelectorAll('[data-elevated="true"]');
    elevatedParents.forEach((parent) => {
      (parent as HTMLElement).style.zIndex = '';
      parent.removeAttribute('data-elevated');
    });

    const overlay = getDimmingOverlay();
    overlay.style.opacity = '0';
    // Clear the hole
    const path = overlay.querySelector('path');
    if (path) path.setAttribute('d', '');

  }, [getDimmingOverlay]);

  // Scroll to elements smoothly with spotlight effect
  const scrollToElements = useCallback((elementIds: string[]) => {
    // Filter out invalid IDs
    const validIds = elementIds.filter(id => document.getElementById(id));

    if (validIds.length === 0) return;

    // Check for duplicate focus to prevent flashing
    const areSameIds = validIds.length === lastFocusedIds.current.length &&
      validIds.every((id, i) => id === lastFocusedIds.current[i]);

    if (!areSameIds) {
      // Clear previous focus only if targets changed
      clearFocus();
      lastFocusedIds.current = validIds;
    }

    // Scroll to the first element (or improved logic: center of bounding box of all elements?)
    // For now, simple approach: scroll to the first valid element
    const firstElement = document.getElementById(validIds[0]);
    if (firstElement) {
      firstElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    // Add focused class and pulse ring to all elements
    validIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('audio-director-focused');

        // Only add pulse ring for new targets
        if (!areSameIds) {
          el.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2');
          // Remove ring after animation
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2');
          }, 2000);
        }
      }
    });

    // Show dimming overlay
    const overlay = getDimmingOverlay();

    if (!areSameIds) {
      // Delay for new elements to allow transition
      setTimeout(() => {
        overlay.style.opacity = '1';
        updateOverlayHole(validIds);
      }, 100);
    } else {
      // Instant update for same elements (e.g. resume auto-scroll)
      overlay.style.opacity = '1';
      updateOverlayHole(validIds);
    }

  }, [getDimmingOverlay, clearFocus, updateOverlayHole]);

  // Handle time updates from audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setAudioState(prev => ({ ...prev, currentTime }));

      const cue = findCurrentCue(currentTime);
      if (!cue) return;

      const cueIndex = timeline.indexOf(cue);

      // Only react if we've moved to a new cue
      if (cueIndex !== currentCueIndex.current) {
        currentCueIndex.current = cueIndex;

        // Update tab
        if (cue.tab !== currentTab) {
          setCurrentTab(cue.tab);
        }

        // Determine targets: use focusIds array if present, otherwise fall back to single focusId
        let targets: string[] = [];
        if (cue.focusIds && cue.focusIds.length > 0) {
          targets = cue.focusIds;
        } else if (cue.focusId) {
          targets = [cue.focusId];
        }

        setActiveElementIds(targets);

        // Auto-scroll logic is handled by useEffect now to ensure DOM is ready
        // if (!isUserScrolling && targets.length > 0) {
        //   scrollToElements(targets);
        // }
      }
    };

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [timeline, currentTab, isUserScrolling, findCurrentCue, scrollToElements]);

  // Audio controls
  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setAudioState(prev => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      if (overlayRef.current) {
        overlayRef.current.remove();
        overlayRef.current = null;
      }
      clearFocus();
    };
  }, [clearFocus]);

  // Keep overlay hole synced with active element position (for scroll/resize)
  useEffect(() => {
    if (activeElementIds.length === 0) return;

    let animationFrameId: number;

    const updateLoop = () => {
      updateOverlayHole(activeElementIds);
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Start loop
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeElementIds, updateOverlayHole]);
  // Handle auto-scrolling when active elements change or tab changes
  useEffect(() => {
    // Only scroll if we have targets and user isn't manually intervening
    if (activeElementIds.length > 0 && !isUserScrolling) {
      // Use a timeout to ensure React has finished rendering the new tab content
      // This solves the issue where the element doesn't exist yet immediately after state change
      const timer = setTimeout(() => {
        scrollToElements(activeElementIds);
      }, 100); // 100ms should be enough for the tab animation/render

      return () => clearTimeout(timer);
    }
  }, [activeElementIds, isUserScrolling, scrollToElements, currentTab]); // Dependency on currentTab helps re-trigger if needed, though activeElementIds update usually suffices

  return {
    currentTab,
    activeElementId: activeElementIds.length > 0 ? activeElementIds[0] : null, // Backward compatibility
    activeElementIds,
    isUserInteracting: isUserScrolling,
    resumeAutoScroll,
    audioState,
    audioRef,
    play,
    pause,
    seek,
    setPlaybackRate,
    chapters,
  };
}
