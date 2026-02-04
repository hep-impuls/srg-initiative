import React, { useState } from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';

interface PollSliderProps {
    config: { minLabel?: string; maxLabel?: string; options: InteractionOption[] }; // Slider usually implies a range, but our type has options. 
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

    const [localValue, setLocalValue] = useState<number>(50);
    const totalVotes = results?.totalVotes || 0;

    // Calculate average for results
    const calculateAverage = () => {
        if (!results || totalVotes === 0) return 50;
        let sum = 0;
        Object.entries(results.optionCounts).forEach(([val, count]) => {
            sum += Number(val) * count;
        });
        return sum / totalVotes;
    };

    const average = calculateAverage();

    const handleSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setLocalValue(val);
        onInteract?.(val);
    };

    const handleSubmit = () => {
        onVote(localValue);
    };

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
                    value={hasVoted ? Number(userVote) : localValue}
                    onChange={handleSlide}
                    disabled={hasVoted || isSubmitting}
                    className={`
            absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 
            ${hasVoted ? 'cursor-default opacity-80' : 'cursor-pointer'}
            focus:outline-none
          `}
                    style={{
                        // Custom CSS needed for proper thumb styling across browsers, using tailwind classes on wrapper mainly
                    }}
                />

                {/* User Thumb visualization (Custom HTML implementation if needed, but input[type=range] is hard to style perfectly identically across browsers without massive CSS) */}
                {/* Simple approach: Allow native input to handle the "Thumb" */}
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
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        Bestätigen
                    </button>
                </div>
            )}

            {showResults && (
                <div className="text-center mt-4 text-slate-500">
                    Durchschnitt: <span className="font-bold text-slate-800">{Math.round(average)}</span> ({totalVotes} Teilnehmer)
                </div>
            )}
        </div>
    );
};
