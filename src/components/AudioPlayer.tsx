import { useState } from 'react';
import { AudioControls } from './AudioControls';
import { ChapterList } from './ChapterList';
import { AudioDirectorState } from '@/types';

interface AudioPlayerProps {
  audioSrc: string;
  directorState: AudioDirectorState;
}

export function AudioPlayer({ audioSrc, directorState }: AudioPlayerProps) {
  const [showChapters, setShowChapters] = useState(false);

  const {
    audioState,
    audioRef,
    play,
    pause,
    seek,
    setPlaybackRate,
    chapters
  } = directorState;

  const handleHelp = () => {
    window.dispatchEvent(new CustomEvent('open-audio-onboarding'));
  };

  return (
    <>
      {/* User Interaction Warning - Floating Toast */}


      {/* Floating Audio Player Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none w-[90vw] max-w-[240px] md:max-w-[280px]">

        {/* Audio Element */}
        <audio ref={audioRef} src={audioSrc} preload="metadata" />

        <div className="w-full pointer-events-auto relative">
          {/* Chapter Popover */}
          {showChapters && (
            <div className="absolute bottom-full right-0 mb-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 w-72">
              <ChapterList
                chapters={chapters}
                currentTime={audioState.currentTime}
                onSeek={(time) => {
                  seek(time);
                  setShowChapters(false); // Close on selection
                }}
              />
            </div>
          )}

          {/* Main Control Bar */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden p-1">
            <AudioControls
              audioState={audioState}
              onPlay={play}
              onPause={pause}
              onSeek={seek}
              onRateChange={setPlaybackRate}
              showChapters={showChapters}
              onToggleChapters={() => setShowChapters(!showChapters)}
              onHelp={handleHelp}
            />
          </div>
        </div>
      </div>
    </>
  );
}
