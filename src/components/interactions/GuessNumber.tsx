import React, { useState } from 'react';
import { InteractionResults } from '../../types/interaction';

interface GuessNumberProps {
    config: { question: string; correctValue?: number; unit?: string };
    results: InteractionResults | null;
    onVote: (value: number) => void;
    onInteract?: (value: number) => void;
    onSaveDraft?: (value: number) => void;
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
    onSaveDraft,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    const [localValue, setLocalValue] = useState<string>(userVote !== null ? String(userVote) : '');
    const touchedRef = React.useRef(false);
    const parseGuessValue = (raw: string) => {
        const parsed = Number.parseInt(raw, 10);
        if (Number.isNaN(parsed)) return null;
        return Math.max(0, parsed);
    };

    // Reset on interaction change
    React.useEffect(() => {
        touchedRef.current = false;
        if (userVote !== null) {
            setLocalValue(String(userVote));
        } else {
            setLocalValue('');
        }
    }, [config.question]); // GuessNumber uses config.question as ID effectively

    // Sync from userVote only if not touched
    React.useEffect(() => {
        if (userVote !== null && !touchedRef.current) {
            setLocalValue(String(userVote));
        }
    }, [userVote]);
    const totalVotes = results?.totalVotes || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseGuessValue(localValue);
        if (val !== null) {
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
                            step="1"
                            min="0"
                            value={localValue}
                            onChange={(e) => {
                                touchedRef.current = true;
                                setLocalValue(e.target.value);
                                const val = parseGuessValue(e.target.value);
                                if (val !== null) onInteract?.(val);
                            }}
                            placeholder="Ihre Schätzung..."
                            onBlur={() => {
                                const val = parseGuessValue(localValue);
                                if (val !== null) onSaveDraft?.(val);
                            }}
                            className="w-32 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-2xl font-black text-slate-800 text-center focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
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
