import { BookOpen } from 'lucide-react';
import { TimelineEntry } from '@/types';

interface ChapterListProps {
  chapters: TimelineEntry[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export function ChapterList({ chapters, currentTime, onSeek }: ChapterListProps) {
  if (chapters.length === 0) return null;

  // Find the current active chapter
  const activeChapterIndex = chapters.reduce((activeIdx, chapter, idx) => {
    if (currentTime >= chapter.seconds) {
      return idx;
    }
    return activeIdx;
  }, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white max-h-[60vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider z-10">
        <BookOpen size={14} />
        <span>Kapitel</span>
      </div>
      <div className="p-2 space-y-1">
        {chapters.map((chapter, idx) => {
          const isActive = idx === activeChapterIndex;

          return (
            <button
              key={chapter.seconds}
              onClick={() => onSeek(chapter.seconds)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              <span className={`font-mono text-xs w-10 text-right ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                {formatTime(chapter.seconds)}
              </span>
              <span className="flex-1 truncate">
                {chapter.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
