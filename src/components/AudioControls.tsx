import { Play, Pause, RotateCcw } from 'lucide-react';
import { AudioPlayerState } from '@/types';

interface AudioControlsProps {
  audioState: AudioPlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRateChange: (rate: number) => void;
}

export function AudioControls({
  audioState,
  onPlay,
  onPause,
  onSeek,
  onRateChange
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
    <div className="bg-white border-t border-slate-200 shadow-lg p-4">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div
            className="w-full bg-slate-200 rounded-full h-2 cursor-pointer hover:h-3 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Rate Button */}
        <button
          onClick={togglePlaybackRate}
          className="px-2 py-1 min-w-[3rem] text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
          title="Wiedergabegeschwindigkeit ändern"
        >
          {playbackRate}x
        </button>

        {/* Restart Button */}
        <button
          onClick={() => onSeek(0)}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
          title="Von vorne beginnen"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
