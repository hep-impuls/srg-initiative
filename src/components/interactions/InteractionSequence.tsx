import React, { useState, useEffect } from 'react';
import { InteractionShell } from './InteractionShell';
import { InteractionConfig } from '../../types/interaction';

interface InteractionSequenceProps {
    interactionIds: string[];
    startIndex?: number;
    endIndex?: number;
    currentTime?: number;
    startTime?: number; // Start relative to audio
    title?: string;
    mode?: 'list' | 'stepped';
    onComplete?: () => void;
    showResultsButton?: boolean;
}

export const InteractionSequence: React.FC<InteractionSequenceProps> = ({
    interactionIds,
    startIndex = 0,
    endIndex,
    currentTime,
    startTime = 0,
    title,
    mode = 'list',
    onComplete,
    showResultsButton = true
}) => {
    const [configs, setConfigs] = useState<Record<string, InteractionConfig>>({});
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    // Subset of IDs based on range
    const activeIds = interactionIds.slice(startIndex, endIndex !== undefined ? endIndex + 1 : undefined);

    useEffect(() => {
        async function loadAll() {
            try {
                const modules = import.meta.glob('../../data/interactions/*.json');
                const loaded: Record<string, InteractionConfig> = {};

                for (const id of activeIds) {
                    const path = `../../data/interactions/${id}.json`;
                    if (modules[path]) {
                        const mod: any = await modules[path]();
                        loaded[id] = mod.default || mod;
                    }
                }
                setConfigs(loaded);
            } catch (err) {
                console.error("Failed to load sequence configs", err);
            } finally {
                setLoading(false);
            }
        }
        loadAll();
    }, [activeIds.join(',')]);

    if (loading) return <div className="p-8 text-center text-slate-400">Sequenz wird geladen...</div>;

    const renderList = () => (
        <div className="space-y-12">
            {title && <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-500 pl-4">{title}</h2>}
            {activeIds.map((id, index) => {
                const config = configs[id];
                if (!config) return null;

                return (
                    <div key={id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 150}ms` }}>
                        <InteractionShell
                            config={config}
                            currentTime={currentTime}
                            startTime={startTime}
                        />
                    </div>
                );
            })}
        </div>
    );

    const renderStepped = () => {
        const currentId = activeIds[currentStep];
        const config = configs[currentId];
        if (!config) return null;

        return (
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-widest">
                        Frage {currentStep + 1} von {activeIds.length}
                    </div>
                    <div className="flex gap-1">
                        {activeIds.map((_, i) => (
                            <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i === currentStep ? 'bg-blue-500 w-10' : (i < currentStep ? 'bg-blue-200' : 'bg-slate-100')}`} />
                        ))}
                    </div>
                </div>

                <div key={currentId} className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <InteractionShell
                        config={config}
                        // In stepped mode, we usually don't want audio sync to hide results
                        // so we can pass a very high currentTime to force 'reveal' if needed OR just let the shell handle it
                        currentTime={currentTime}
                        startTime={startTime}
                    />
                </div>

                <div className="mt-12 flex justify-between gap-4">
                    <button
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
                    >
                        Zurück
                    </button>

                    {currentStep < activeIds.length - 1 ? (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                        >
                            Nächste Frage →
                        </button>
                    ) : (
                        showResultsButton ? (
                            <button
                                onClick={() => window.location.hash = '#/report/results'}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                            >
                                Zusammenfassung ansehen
                            </button>
                        ) : (
                            <button
                                onClick={onComplete}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                            >
                                Abschliessen & Weiter
                            </button>
                        )
                    )}
                </div>
            </div>
        );
    };

    return mode === 'list' ? renderList() : renderStepped();
};
