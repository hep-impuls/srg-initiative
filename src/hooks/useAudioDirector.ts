import { useEffect, useState, useRef, useCallback } from 'react';
import { TimelineEntry, AudioPlayerState, AudioDirectorState } from '@/types';
import { useScrollLock } from './useScrollLock';

export function useAudioDirector(timeline: TimelineEntry[]): AudioDirectorState {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTab, setCurrentTab] = useState<'theory' | 'data' | 'consequences'>('theory');
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    playbackRate: 1,
  });

  const { isUserScrolling, resumeAutoScroll } = useScrollLock();
  const currentCueIndex = useRef<number>(-1);
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
  const updateOverlayHole = useCallback((elementId: string | null) => {
    const overlay = getDimmingOverlay();
    const path = overlay.querySelector('path');

    if (!elementId || !path) {
      if (path) path.setAttribute('d', '');
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Define path: Full screen rect + Element rect (counter-clockwise for hole)
      // Using fill-rule="evenodd", we just need the two shapes.
      // Outer rect (clockwise): M0,0 H w V h H 0 Z
      // Inner rect (counter-clockwise): M x,y v h h w v -h z ?? 
      // Actually for evenodd, just drawing both rects is enough usually, but let's be explicit

      const d = `
          M0,0 H${windowWidth} V${windowHeight} H0 Z
          M${rect.left},${rect.top} V${rect.bottom} H${rect.right} V${rect.top} Z
        `;

      path.setAttribute('d', d);
    }
  }, [getDimmingOverlay]);

  // Remove focus from previous element
  const clearFocus = useCallback(() => {
    const previousFocused = document.querySelector('.audio-director-focused');
    if (previousFocused) {
      previousFocused.classList.remove('audio-director-focused');
    }

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

  // Scroll to element smoothly with spotlight effect
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Clear previous focus
      clearFocus();

      // Scroll to element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // NOTE: We no longer elevate parents. We use the SVG hole method instead.

      // Add focused class for spotlight effect (visuals only)
      element.classList.add('audio-director-focused');

      // Show dimming overlay
      const overlay = getDimmingOverlay();
      setTimeout(() => {
        overlay.style.opacity = '1';
        updateOverlayHole(elementId);
      }, 100);

      // Add pulse ring effect
      element.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2');
      }, 2000);
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

        // Update active element
        setActiveElementId(cue.focusId);

        // Auto-scroll only if user isn't manually scrolling
        if (!isUserScrolling && cue.focusId) {
          scrollToElement(cue.focusId);
        }
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
  }, [timeline, currentTab, isUserScrolling, findCurrentCue, scrollToElement]);

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
    if (!activeElementId) return;

    let animationFrameId: number;

    const updateLoop = () => {
      updateOverlayHole(activeElementId);
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Start loop
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeElementId, updateOverlayHole]);

  return {
    currentTab,
    activeElementId,
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
