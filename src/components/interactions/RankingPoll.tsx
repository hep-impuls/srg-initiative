import React from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';
import { MoveUp, MoveDown, GripVertical } from 'lucide-react';

interface RankingPollProps {
    options: InteractionOption[];
    results: InteractionResults | null;
    onVote: (order: string) => void;
    onInteract?: (order: string) => void;
    onSaveDraft?: (order: string) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const RankingPoll: React.FC<RankingPollProps> = ({
    options: initialOptions,
    results,
    onVote,
    onInteract,
    onSaveDraft,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    const [items, setItems] = React.useState(() => {
        if (userVote) {
            const order = (userVote as string).split(',');
            // Map the initial options to the saved order
            return [...initialOptions].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
        }
        return initialOptions;
    });

    const touchedRef = React.useRef(false);

    // Sync items with initialOptions if they change (e.g. on new interaction load in sequence)
    React.useEffect(() => {
        touchedRef.current = false;
        if (userVote) {
            const order = (userVote as string).split(',');
            setItems([...initialOptions].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)));
        } else {
            setItems(initialOptions);
        }
    }, [initialOptions]); // Only on interaction change

    // Sync from userVote only if not touched
    React.useEffect(() => {
        if (userVote && !touchedRef.current) {
            const order = (userVote as string).split(',');
            setItems([...initialOptions].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)));
        }
    }, [userVote, initialOptions]); // Added initialOptions to dependency array for safety, though it's primarily for userVote changes

    const move = (index: number, direction: 'up' | 'down') => {
        touchedRef.current = true;
        const newItems = [...items];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        newItems.splice(index, 1);
        newItems.splice(newIndex, 0, items[index]);
        setItems(newItems);

        // Auto-save logic
        const order = newItems.map(i => i.id).join(',');
        onInteract?.(order);
        onSaveDraft?.(order);
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
                <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in duration-700">
                    <h4 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Teilnehmer-Ranking
                    </h4>
                    {(() => {
                        // Calculate scores: Rank 1 = N points, Rank N = 1 point
                        const optionScores: Record<string, number> = {};
                        items.forEach(o => optionScores[o.id] = 0);

                        const totalVotes = results?.totalVotes || 0;
                        if (totalVotes > 0 && results?.optionCounts) {
                            Object.entries(results.optionCounts).forEach(([orderStr, count]) => {
                                const order = orderStr.split(',');
                                order.forEach((id, idx) => {
                                    const score = items.length - idx;
                                    optionScores[id] = (optionScores[id] || 0) + (score * count);
                                });
                            });
                        }

                        // Sort by score
                        const communityOrder = [...items].sort((a, b) => optionScores[b.id] - optionScores[a.id]);

                        return (
                            <div className="space-y-2">
                                {communityOrder.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow text-sm font-medium text-slate-700">
                                            {swissifyData(item.label)}
                                        </div>
                                        {/* Optional: Show score or %? For now just order is enough */}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};
