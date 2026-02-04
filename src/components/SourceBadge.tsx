import React from 'react';

interface SourceBadgeProps {
  ids: string[];
}

export function SourceBadge({ ids }: SourceBadgeProps) {
  const handleSourceClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    // 1. Manually scroll to the target
    const targetElement = document.getElementById(`source-${id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 2. Highlight the target temporarily
      targetElement.classList.add('ring-4', 'ring-blue-400', 'ring-offset-2');
      setTimeout(() => {
        targetElement.classList.remove('ring-4', 'ring-blue-400', 'ring-offset-2');
      }, 2000);
    }

    // 3. Explicitly signal user interaction to the scroll lock hook
    // We do this by dispatching a custom event or a standard event that the hook listens to
    window.dispatchEvent(new Event('wheel'));
    window.dispatchEvent(new Event('mousedown')); // Reinforce interaction
  };

  return (
    <span className="flex flex-wrap gap-1 mt-1">
      {ids.map(id => (
        <a
          key={id}
          href={`#source-${id}`}
          onClick={(e) => handleSourceClick(e, id)}
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          [{id}]
        </a>
      ))}
    </span>
  );
}
