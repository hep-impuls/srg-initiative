import { AudioControls } from './AudioControls';
import { ChapterList } from './ChapterList';
import { AlertTriangle } from 'lucide-react';
import { AudioDirectorState } from '@/types';

interface AudioPlayerProps {
  audioSrc: string;
  directorState: AudioDirectorState;
}

export function AudioPlayer({ audioSrc, directorState }: AudioPlayerProps) {
  const {
    audioState,
    audioRef,
    play,
    pause,
    seek,
    setPlaybackRate,
    isUserInteracting,
    resumeAutoScroll,
    chapters
  } = directorState;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* User Interaction Warning */}
      {isUserInteracting && (
        <div className="bg-amber-100 border-t border-amber-300 px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 text-sm">
              <AlertTriangle size={16} />
              <span>Auto-Navigation pausiert (du scrollst selbst)</span>
            </div>
            <button
              onClick={resumeAutoScroll}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded transition-colors"
            >
              Navigation fortsetzen
            </button>
          </div>
        </div>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Chapter Navigation */}
      <ChapterList
        chapters={chapters}
        currentTime={audioState.currentTime}
        onSeek={seek}
      />

      {/* Controls */}
      <AudioControls
        audioState={audioState}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
        onRateChange={setPlaybackRate}
      />
    </div>
  );
}
