import React, { useState } from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';

interface PollSliderProps {
    config: { id: string; minLabel?: string; maxLabel?: string; options: InteractionOption[] };
    // If we map options as discrete steps on a slider:
    results: InteractionResults | null;
    onVote: (value: number) => void;
    onInteract?: (value: number) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const PollSlider: React.FC<PollSliderProps> = ({
    config,
    results,
    onVote,
    onInteract,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    // Assuming options map to 1..N or 0..100
    // If options are provided, we treat them as steps. 
    // If not, we might need a generic 0-100 range. 
    // Let's assume for now that if type is slider, we just want a 0-100 scale and options are ignored or used for labels.

    const [localValue, setLocalValue] = useState<number>(() => {
        return userVote !== null ? Number(userVote) : 50;
    });
    const totalVotes = results?.totalVotes || 0;

    // Track if user has interacted to prevent background saves from overwriting local state
    const touchedRef = React.useRef(false);

    // Reset touched state when interaction changes
    React.useEffect(() => {
        touchedRef.current = false;
    }, [config.id]);

    // Sync local value with userVote only if user hasn't touched the slider yet
    React.useEffect(() => {
        if (userVote !== null && !touchedRef.current) {
            setLocalValue(Number(userVote));
        }
    }, [userVote]);

    // Calculate average for results
    const calculateAverage = () => {
        if (!results || totalVotes === 0) return 50;
        let sum = 0;
        let countEntries = 0;
        Object.entries(results.optionCounts).forEach(([val, count]) => {
            sum += Number(val) * count;
            countEntries += count;
        });
        return countEntries > 0 ? sum / countEntries : 50;
    };

    const average = calculateAverage();

    const handleSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
        touchedRef.current = true;
        const val = Number(e.target.value);
        setLocalValue(val);
        onInteract?.(val);
    };

    const handleSubmit = () => {
        onVote(localValue);
    };

    const displayValue = hasVoted ? Number(userVote) : localValue;

    return (
        <div className="w-full max-w-xl mx-auto py-8 px-4">
            <div className="relative h-16 flex items-center mb-8">
                {/* Track Line */}
                <div className="absolute w-full h-2 bg-slate-200 rounded-full" />

                {/* Result Blob (Average) */}
                {showResults && (
                    <div
                        className="absolute top-1/2 -ml-6 -mt-10 flex flex-col items-center transition-all duration-1000 ease-out z-10"
                        style={{ left: `${average}%` }}
                    >
                        <div className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg mb-1">
                            Ø
                        </div>
                        <div className="w-1 h-8 bg-slate-800 opacity-50"></div>
                    </div>
                )}

                {/* User Input Slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={displayValue}
                    onChange={handleSlide}
                    disabled={hasVoted || isSubmitting}
                    className={`
            absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 
            ${hasVoted ? 'cursor-default opacity-80' : 'cursor-pointer'}
            focus:outline-none
          `}
                />

                {/* User Position Marker (Shown when results are revealed) */}
                {showResults && hasVoted && (
                    <div
                        className="absolute top-1/2 -ml-3 mt-4 flex flex-col items-center z-10"
                        style={{ left: `${userVote}%` }}
                    >
                        <div className="w-1 h-4 bg-blue-600"></div>
                        <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold mt-1">
                            DU
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between text-slate-500 font-medium">
                <span>{swissifyData(config.minLabel || '0')}</span>
                <span>{swissifyData(config.maxLabel || '100')}</span>
            </div>

            {!hasVoted && !showResults && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Speichert...
                            </>
                        ) : 'Bestätigen'}
                    </button>
                </div>
            )}

            {showResults && (
                <div className="text-center mt-12 text-slate-500 bg-slate-50 p-4 rounded-2xl animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center gap-8 items-center">
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Deine Wahl</div>
                            <div className="text-2xl font-black text-blue-600">{Math.round(Number(userVote))}</div>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Durchschnitt</div>
                            <div className="text-2xl font-black text-slate-800">{Math.round(average)}</div>
                        </div>
                    </div>
                    <div className="mt-4 text-xs italic text-slate-400">
                        Basierend auf {totalVotes} Teilnahmen
                    </div>
                </div>
            )}
        </div>
    );
};
