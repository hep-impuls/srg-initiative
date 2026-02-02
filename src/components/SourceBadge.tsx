interface SourceBadgeProps {
  ids: string[];
}

export function SourceBadge({ ids }: SourceBadgeProps) {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {ids.map(id => (
        <a
          key={id}
          href="#quellen"
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          [{id}]
        </a>
      ))}
    </div>
  );
}
