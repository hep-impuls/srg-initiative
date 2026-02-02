import { SourceBadge } from './SourceBadge';

interface StatCardProps {
  value: string;
  label: string;
  subtext?: string;
  color?: 'blue' | 'red' | 'amber' | 'purple';
  sourceIds: string[];
}

export function StatCard({
  value,
  label,
  subtext,
  color = 'blue',
  sourceIds
}: StatCardProps) {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100'
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} flex flex-col justify-between h-full hover:shadow-md transition-shadow`}>
      <div>
        <div className={`text-4xl font-extrabold mb-2 ${colors[color].split(' ')[0]}`}>
          {value}
        </div>
        <div className="font-bold text-gray-800 mb-2">{label}</div>
        {subtext && <p className="text-sm text-gray-600">{subtext}</p>}
      </div>
      <SourceBadge ids={sourceIds} />
    </div>
  );
}
