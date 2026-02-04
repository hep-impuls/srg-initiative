import React, { useState } from 'react';
import { InteractionResults } from '../../types/interaction';

interface GuessNumberProps {
    config: { question: string; correctValue?: number; unit?: string };
    results: InteractionResults | null;
    onVote: (value: number) => void;
    onInteract?: (value: number) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const GuessNumber: React.FC<GuessNumberProps> = ({
    config,
    results,
    onVote,
    onInteract,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    const [localValue, setLocalValue] = useState<string>('');
    const totalVotes = results?.totalVotes || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(localValue);
        if (!isNaN(val)) {
            onVote(val);
        }
    };

    // Calculate average of guesses
    const calculateAverage = () => {
        if (!results || totalVotes === 0) return 0;
        let sum = 0;
        Object.entries(results.optionCounts).forEach(([val, count]) => {
            sum += Number(val) * count;
        });
        return sum / totalVotes;
    };

    const average = calculateAverage();

    return (
        <div className="w-full max-w-md mx-auto py-4">
            {!hasVoted && !showResults ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="number"
                            value={localValue}
                            onChange={(e) => {
                                setLocalValue(e.target.value);
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) onInteract?.(val);
                            }}
                            placeholder="Ihre Schätzung..."
                            className="w-full p-4 text-2xl font-bold text-center border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            autoFocus
                        />
                        {config.unit && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                {config.unit}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !localValue}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                        Schätzung abgeben
                    </button>
                </form>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">
                            Ihre Schätzung
                        </div>
                        <div className="text-4xl font-black text-blue-600">
                            {userVote} {config.unit}
                        </div>
                    </div>

                    {showResults && config.correctValue !== undefined && (
                        <div className="space-y-4 animate-in zoom-in duration-1000 delay-300 fill-mode-both">
                            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
                                <div className="text-green-600 text-sm uppercase tracking-wider font-bold mb-1">
                                    Die richtige Lösung
                                </div>
                                <div className="text-4xl font-black text-green-700">
                                    {config.correctValue} {config.unit}
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm">
                                <span className="text-slate-500">Durchschnitt ({totalVotes} Teilnehmer):</span>
                                <span className="font-bold text-slate-800">{average.toFixed(1)} {config.unit}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
