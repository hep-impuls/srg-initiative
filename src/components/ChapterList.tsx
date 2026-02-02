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
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-700">
          <BookOpen size={16} />
          <span>Kapitel</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {chapters.map((chapter, idx) => {
            const isActive = idx === activeChapterIndex;
            const isPast = currentTime > chapter.seconds;

            return (
              <button
                key={chapter.seconds}
                onClick={() => onSeek(chapter.seconds)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : isPast
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }
                `}
                title={`Springe zu ${chapter.label}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] opacity-70">
                    {formatTime(chapter.seconds)}
                  </span>
                  <span>•</span>
                  <span>{chapter.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
