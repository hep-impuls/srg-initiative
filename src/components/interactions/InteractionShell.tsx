import React, { useMemo } from 'react';
import { InteractionConfig } from '../../types/interaction';
import { useInteractionDirector } from '../../hooks/useInteractionDirector';
import { PollBar } from './PollBar';
import { PollSlider } from './PollSlider';
import { QuizOption } from './QuizOption';
import { RankingPoll } from './RankingPoll';
import { PointsAllocation } from './PointsAllocation';
import { GuessNumber } from './GuessNumber';
import { swissifyData } from '../../utils/textUtils';
import { shuffleArray } from '../../utils/arrayUtils';

interface InteractionShellProps {
    config: InteractionConfig;
    currentTime?: number;
    startTime?: number; // In the context of the audio
}

export const InteractionShell: React.FC<InteractionShellProps> = ({
    config,
    currentTime,
    startTime
}) => {
    const {
        phase,
        results,
        hasVoted,
        userVote,
        isSubmitting,
        submitVote,
        saveDraft,
        handleInteraction
    } = useInteractionDirector({ config, currentTime, startTime });

    // Memoize shuffled options based on the config ID to ensure they don't reshuffle on every render
    const shuffledOptions = useMemo(() => {
        if (!config.options) return [];

        // We randomize for these specific types as requested
        const typesToRandomize = ['quiz', 'ranking', 'points', 'poll'];
        if (typesToRandomize.includes(config.type)) {
            return shuffleArray(config.options);
        }

        return config.options;
    }, [config.id, config.options, config.type]);

    const renderInteraction = () => {
        const commonProps = {
            options: shuffledOptions,
            results,
            onVote: submitVote,
            onInteract: handleInteraction,
            onSaveDraft: saveDraft,
            hasVoted,
            isSubmitting,
            userVote,
            showResults: phase === 'reveal' || hasVoted // Show results if revealed OR if user just voted (instant feedback)
        };

        switch (config.type) {
            case 'poll':
                return <PollBar {...commonProps} />;

            case 'quiz':
                return <QuizOption {...commonProps} />;

            case 'slider':
                return (
                    <PollSlider
                        config={config as any}
                        results={results}
                        onVote={submitVote}
                        onInteract={handleInteraction}
                        onSaveDraft={saveDraft}
                        hasVoted={hasVoted}
                        isSubmitting={isSubmitting}
                        userVote={userVote}
                        showResults={phase === 'reveal' || hasVoted}
                    />
                );

            case 'ranking':
                return <RankingPoll {...commonProps} />;

            case 'points':
                return <PointsAllocation {...commonProps} />;

            case 'guess':
                return (
                    <GuessNumber
                        config={config as any}
                        results={results}
                        onVote={submitVote}
                        onInteract={handleInteraction}
                        onSaveDraft={saveDraft}
                        hasVoted={hasVoted}
                        isSubmitting={isSubmitting}
                        userVote={userVote}
                        showResults={phase === 'reveal' || hasVoted}
                    />
                );

            case 'info':
                return (
                    <div className="flex flex-col items-center gap-4 text-center py-4">
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-800">
                            <p className="text-sm font-medium leading-relaxed">
                                {swissifyData(config.question)}
                            </p>
                        </div>
                    </div>
                );

            default:

                return <div className="text-red-500">Unbekannter Interaktions-Typ: {config.type}</div>;
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 text-center leading-snug">
                    {config.type === 'info' ? 'Kurzer Hinweis' : swissifyData(config.question)}
                </h3>


                {/* Phase Indicator (Optional Debug or UX) */}
                {phase === 'locked' && !hasVoted && (
                    <div className="text-center mt-2 text-amber-600 font-medium text-sm animate-pulse">
                        Abstimmung geschlossen. Ergebnisse gleich...
                    </div>
                )}
            </div>

            <div className="p-6 md:p-8">
                {renderInteraction()}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                <span></span>
                <span>
                    {hasVoted ? 'Abgestimmt' : phase === 'locked' ? 'Geschlossen' : 'Offen'}
                </span>
            </div>
        </div>
    );
};
