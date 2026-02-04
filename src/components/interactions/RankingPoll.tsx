import React, { useState } from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';
import { MoveUp, MoveDown, GripVertical } from 'lucide-react';

interface RankingPollProps {
    options: InteractionOption[];
    results: InteractionResults | null;
    onVote: (order: string) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const RankingPoll: React.FC<RankingPollProps> = ({
    options: initialOptions,
    onVote,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    const [items, setItems] = useState(initialOptions);

    const move = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setItems(newItems);
    };

    const handleSubmit = () => {
        const resultString = items.map(i => i.id).join(',');
        onVote(resultString);
    };

    // Logic to show aggregate results (simplified: just show what rank each item got on average)
    // Firestore stores 'opt1,opt2,opt3' as a key in results.optionCounts
    // To keep it simple for now, we just show the user's result if showResults is on, 
    // or hide the controls.

    return (
        <div className="w-full max-w-lg mx-auto space-y-4">
            <div className="space-y-2">
                {(hasVoted && userVote ? initialOptions.filter(o => (userVote as string).split(',').includes(o.id)).sort((a, b) => {
                    const order = (userVote as string).split(',');
                    return order.indexOf(a.id) - order.indexOf(b.id);
                }) : items).map((item, index) => (
                    <div
                        key={item.id}
                        className={`
              flex items-center gap-4 p-4 bg-white border-2 rounded-xl transition-all
              ${hasVoted ? 'border-blue-100 bg-blue-50/30' : 'border-slate-200'}
            `}
                    >
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm">
                            {index + 1}
                        </div>

                        <div className="flex-grow font-medium text-slate-700">
                            {swissifyData(item.label)}
                        </div>

                        {!hasVoted && !showResults && (
                            <div className="flex-none flex gap-1">
                                <button
                                    onClick={() => move(index, 'up')}
                                    disabled={index === 0}
                                    className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-colors"
                                >
                                    <MoveUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => move(index, 'down')}
                                    disabled={index === items.length - 1}
                                    className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-colors"
                                >
                                    <MoveDown className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {!hasVoted && !showResults && (
                            <div className="flex-none text-slate-300 cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!hasVoted && !showResults && (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all mt-4"
                >
                    Reihenfolge bestätigen
                </button>
            )}

            {showResults && (
                <div className="text-center text-sm text-slate-400 mt-4 italic">
                    Ranglisten-Ergebnisse werden aggregiert angezeigt.
                </div>
            )}
        </div>
    );
};
