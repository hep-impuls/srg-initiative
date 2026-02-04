import React from 'react';
import { InteractionOption, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizOptionProps {
    options: InteractionOption[];
    results: InteractionResults | null;
    onVote: (optionId: string) => void;
    hasVoted: boolean;
    isSubmitting: boolean;
    userVote: string | number | null;
    showResults: boolean;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {options.map((option) => {
                const count = results?.optionCounts[option.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isSelected = userVote === option.id;

                // Show truth state only if we have voted or if results are being shown (reveal phase)
                const revealTruth = hasVoted || showResults;
                const isCorrect = option.isCorrect;

                let borderColor = 'border-slate-200';
                let bgColor = 'bg-white';
                let icon = null;

                if (revealTruth) {
                    if (isCorrect) {
                        borderColor = 'border-green-500';
                        bgColor = 'bg-green-50';
                        icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    } else if (isSelected) {
                        borderColor = 'border-red-500';
                        bgColor = 'bg-red-50';
                        icon = <XCircle className="w-6 h-6 text-red-500" />;
                    } else {
                        // Neutral state for unselected wrong answers
                        borderColor = 'border-slate-200 opacity-60';
                    }
                } else if (isSelected) {
                    borderColor = 'border-blue-500';
                    bgColor = 'bg-blue-50';
                }

                return (
                    <button
                        key={option.id}
                        onClick={() => onVote(option.id)}
                        disabled={hasVoted || isSubmitting}
                        className={`
              relative p-6 rounded-xl text-left border-2 transition-all duration-300
              flex flex-col justify-between h-32
              ${borderColor} ${bgColor}
              ${!hasVoted && !showResults ? 'hover:border-blue-300 hover:shadow-md' : 'cursor-default'}
            `}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="font-semibold text-lg text-slate-800 line-clamp-2">
                                {swissifyData(option.label)}
                            </span>
                            {icon}
                        </div>

                        {showResults && (
                            <div className="w-full mt-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>{percentage}% gewählt</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${isCorrect ? 'bg-green-500' : 'bg-slate-400'}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
