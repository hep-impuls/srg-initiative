import React, { useState } from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';

interface PointsAllocationProps {
    options: InteractionOption[];
    results: InteractionResults | null;
    onVote: (allocation: string) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const PointsAllocation: React.FC<PointsAllocationProps> = ({
    options,
    onVote,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    const TOTAL_POINTS = 100;
    const [allocation, setAllocation] = useState<Record<string, number>>(
        Object.fromEntries(options.map(o => [o.id, 0]))
    );

    const currentTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    const remaining = TOTAL_POINTS - currentTotal;

    const handleUpdate = (id: string, value: number) => {
        const currentVal = allocation[id];
        const diff = value - currentVal;

        // Prevent exceeding total
        if (currentTotal + diff > TOTAL_POINTS) {
            const allowed = TOTAL_POINTS - (currentTotal - currentVal);
            setAllocation(prev => ({ ...prev, [id]: allowed }));
        } else {
            setAllocation(prev => ({ ...prev, [id]: Math.max(0, value) }));
        }
    };

    const handleSubmit = () => {
        if (currentTotal !== TOTAL_POINTS) return;
        // Format as string: opt1:20,opt2:80
        const resultString = Object.entries(allocation).map(([id, val]) => `${id}:${val}`).join(',');
        onVote(resultString);
    };

    // Parsing user vote if exists
    const parsedUserVote = userVote
        ? Object.fromEntries((userVote as string).split(',').map(s => {
            const [id, val] = s.split(':');
            return [id, parseInt(val)];
        }))
        : allocation;

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                <span className="font-bold text-slate-700">Verfügbare Punkte:</span>
                <span className={`text-2xl font-black ${remaining === 0 ? 'text-green-500' : 'text-blue-500'}`}>
                    {hasVoted ? 0 : remaining}
                </span>
            </div>

            <div className="space-y-6">
                {options.map((option) => {
                    const val = hasVoted ? (parsedUserVote[option.id] || 0) : allocation[option.id];
                    const percent = val;

                    return (
                        <div key={option.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-700">{swissifyData(option.label)}</span>
                                <span className="font-black text-slate-900">{val}</span>
                            </div>

                            <div className="relative w-full h-8 flex items-center">
                                <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                {!hasVoted && !showResults && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={val}
                                        onChange={(e) => handleUpdate(option.id, parseInt(e.target.value))}
                                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!hasVoted && !showResults && (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || currentTotal !== TOTAL_POINTS}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all mt-4"
                >
                    Verteilung abschicken
                </button>
            )}

            {showResults && (
                <div className="text-center text-sm text-slate-400 mt-4 italic">
                    Durchschnittliche Punkteverteilung der Community.
                </div>
            )}
        </div>
    );
};
