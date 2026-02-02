import { Play, Pause, RotateCcw, List } from 'lucide-react';
import { AudioPlayerState } from '@/types';

interface AudioControlsProps {
  audioState: AudioPlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRateChange: (rate: number) => void;
  showChapters?: boolean;
  onToggleChapters?: () => void;
}

export function AudioControls({
  audioState,
  onPlay,
  onPause,
  onSeek,
  onRateChange,
  showChapters,
  onToggleChapters
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
    <div className="px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full transition-colors shrink-0"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>

        {/* Time - Compact */}
        <span className="text-xs font-mono text-slate-500 w-[80px] text-center hidden sm:block">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Progress Bar */}
        <div className="flex-1 relative group">
          <div
            className="w-full bg-slate-200 rounded-full h-1.5 cursor-pointer group-hover:h-2.5 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="bg-blue-600 h-full rounded-full transition-all relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-slate-300 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Controls Group */}
        <div className="flex items-center gap-1">
          {/* Speed */}
          <button
            onClick={togglePlaybackRate}
            className="px-2 py-1 min-w-[3rem] text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
            title="Geschwindigkeit"
          >
            {playbackRate}x
          </button>

          {/* Chapters Toggle */}
          {onToggleChapters && (
            <button
              onClick={onToggleChapters}
              className={`p-2 rounded transition-colors ${showChapters ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              title="Kapitel anzeigen"
            >
              <List size={18} />
            </button>
          )}

          {/* Restart */}
          <button
            onClick={() => onSeek(0)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title="Neustart"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
