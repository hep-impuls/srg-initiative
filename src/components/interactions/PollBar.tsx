import React from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';

interface PollBarProps {
    options: InteractionOption[];
    results: InteractionResults | null;
    onVote: (optionId: string) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const PollBar: React.FC<PollBarProps> = ({
    options,
    results,
    onVote,
    hasVoted,
    isSubmitting,
    userVote,
    showResults
}) => {
    const totalVotes = results?.totalVotes || 0;

    return (
        <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
            {options.map((option) => {
                const count = results?.optionCounts[option.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isSelected = userVote === option.id;

                return (
                    <div key={option.id} className="relative group">
                        {/* Input Button */}
                        <button
                            onClick={() => onVote(option.id)}
                            disabled={hasVoted || isSubmitting}
                            className={`
                w-full p-4 rounded-xl text-left border-2 transition-all duration-300 relative overflow-hidden
                ${isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-200 hover:border-blue-300 bg-white'
                                }
                ${showResults ? 'cursor-default' : 'cursor-pointer'}
              `}
                        >
                            {/* Background Bar (for results) */}
                            {showResults && (
                                <div
                                    className="absolute left-0 top-0 bottom-0 bg-blue-100 transition-all duration-1000 ease-out z-0"
                                    style={{ width: `${percentage}%` }}
                                />
                            )}

                            {/* Content */}
                            <div className="relative z-10 flex justify-between items-center">
                                <span className={`font-medium text-lg ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {swissifyData(option.label)}
                                </span>

                                {showResults && (
                                    <span className="font-bold text-blue-600 animate-in fade-in">
                                        {percentage}%
                                    </span>
                                )}

                                {!showResults && isSelected && (
                                    <span className="text-blue-500">
                                        ✓
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                );
            })}

            {showResults && (
                <div className="text-center text-sm text-slate-500 mt-2">
                    {totalVotes} Teilnehmer
                </div>
            )}
        </div>
    );
};
