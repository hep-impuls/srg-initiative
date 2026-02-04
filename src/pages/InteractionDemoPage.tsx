import React from 'react';
import { InteractionShell } from '../components/interactions/InteractionShell';
import demoPoll from '../data/interactions/demo-poll.json';
import demoQuiz from '../data/interactions/demo-quiz.json';
import demoSlider from '../data/interactions/demo-slider.json';
import demoRanking from '../data/interactions/demo-ranking.json';
import demoPoints from '../data/interactions/demo-points.json';
import demoGuess from '../data/interactions/demo-guess.json';
import { InteractionConfig } from '../types/interaction';
import { InteractionSequence } from '../components/interactions/InteractionSequence';

export const InteractionDemoPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-12 pb-24">
                <header className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Interaction Engine</h1>
                    <p className="text-slate-600 mb-4">Native Firebase-powered interactions</p>
                    <button
                        onClick={() => window.location.hash = '#/report/results'}
                        className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                    >
                        Meine Ergebnisse ansehen →
                    </button>
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">1. Poll (Umfrage)</h2>
                    <InteractionShell config={demoPoll as InteractionConfig} />
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">2. Quiz (Wissenstest)</h2>
                    <InteractionShell config={demoQuiz as InteractionConfig} />
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">3. Slider (Skala)</h2>
                    <InteractionShell config={demoSlider as InteractionConfig} />
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">4. Ranking (Rangliste)</h2>
                    <InteractionShell config={demoRanking as InteractionConfig} />
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">5. 100 Points (Punkte verteilen)</h2>
                    <InteractionShell config={demoPoints as InteractionConfig} />
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">6. Guess number (Zahl schätzen)</h2>
                    <InteractionShell config={demoGuess as InteractionConfig} />
                </section>

                <section className="space-y-6 pt-12 border-t border-slate-200">
                    <header className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 italic">Master Quiz (The "One Take")</h2>
                        <p className="text-slate-500">Diese Sequenz zeigt alle Interaktionen nacheinander – ideal für ein abschliessendes Questionnaire.</p>
                    </header>
                    <InteractionSequence
                        interactionIds={['demo-quiz', 'demo-guess', 'demo-ranking', 'demo-points']}
                        mode="stepped"
                    />
                </section>

                <footer className="pt-12 text-center text-slate-400 text-sm">
                    SRG Interaction Engine MVP - 2026
                </footer>
            </div>
        </div>
    );
};
