import { Play, Pause, RotateCcw, List, HelpCircle } from 'lucide-react';
import { AudioPlayerState } from '@/types';

interface AudioControlsProps {
  audioState: AudioPlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRateChange: (rate: number) => void;
  showChapters?: boolean;
  onToggleChapters?: () => void;
  onHelp?: () => void;
}

export function AudioControls({
  audioState,
  onPlay,
  onPause,
  onSeek,
  onRateChange,
  showChapters,
  onToggleChapters,
  onHelp
}: AudioControlsProps) {
  const { isPlaying, currentTime, duration, isLoading, playbackRate } = audioState;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    onSeek(percent * duration);
  };

  const togglePlaybackRate = () => {
    // Cycle: 0.8 -> 1 -> 1.2 -> 1.5 -> 2 -> 0.8
    const rates = [0.8, 1, 1.2, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const nextRate = rates[nextIndex];

    onRateChange(nextRate);
  };

  return (
    <div className="px-1.5 py-1.5">
      <div className="flex items-center gap-2">
        {/* Play/Pause Button - Compact */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 text-white rounded-full transition-all shrink-0 shadow-lg shadow-blue-500/10 active:scale-90"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-baseline px-0.5 mb-1">
            <span className="text-[9px] font-bold font-mono text-slate-500 tabular-nums">
              {formatTime(currentTime)}
            </span>
            <button
              onClick={togglePlaybackRate}
              className="text-[9px] font-black text-slate-500 hover:text-white transition-colors"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Progress Bar - Ultra thin Hairline */}
          <div
            className="w-full bg-white/5 rounded-full h-[2px] cursor-pointer group relative"
            onClick={handleProgressClick}
          >
            <div
              className="bg-blue-400 h-full rounded-full transition-all relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-0.5">
          {onToggleChapters && (
            <button
              onClick={onToggleChapters}
              className={`p-1.5 rounded-lg transition-all ${showChapters ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
              title="Kapitel"
            >
              <List size={14} />
            </button>
          )}

          <button
            onClick={() => onSeek(0)}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Neustart"
          >
            <RotateCcw size={14} />
          </button>

          {onHelp && (
            <button
              onClick={onHelp}
              className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Hilfe & Intro"
            >
              <HelpCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
