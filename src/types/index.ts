import { RefObject } from 'react';

// Timeline entry configuration
export interface TimelineEntry {
  seconds: number;
  tab: 'theory' | 'data' | 'consequences';
  focusId: string;
  label: string;
  isChapter?: boolean; // Optional: marks this as a chapter marker
}

// Page configuration
export interface PageConfig {
  title: string;
  audioSrc?: string; // Optional: will default to audio/[slug].mp3
  timeline: TimelineEntry[];
}

// Tour configuration (root)
export interface TourConfig {
  pages: {
    [key: string]: PageConfig;
  };
}

// Source reference type
export interface Source {
  id: string;
  text: string;
  details: string;
}

// Audio player state
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  playbackRate: number;
}

// Director hook return value
export interface AudioDirectorState {
  currentTab: 'theory' | 'data' | 'consequences';
  activeElementId: string | null;
  isUserInteracting: boolean;
  resumeAutoScroll: () => void;
  audioState: AudioPlayerState;
  audioRef: RefObject<HTMLAudioElement>;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  chapters: TimelineEntry[]; // List of chapter markers
}
