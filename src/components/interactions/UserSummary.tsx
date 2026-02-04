import React, { useEffect, useState } from 'react';
import { InteractionConfig } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';
import { CheckCircle, Info, Award } from 'lucide-react';

export const UserSummary: React.FC = () => {
    const [answeredInteractions, setAnsweredInteractions] = useState<{ config: InteractionConfig, vote: string | number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function discoverAnswers() {
            try {
                const modules = import.meta.glob('../../data/interactions/*.json');
                const results: { config: InteractionConfig, vote: string | number }[] = [];

                for (const path in modules) {
                    const mod: any = await modules[path]();
                    const config = mod.default || mod;
                    const userVote = localStorage.getItem(`vote_${config.id}`);

                    if (userVote) {
                        results.push({ config, vote: userVote });
                    }
                }
                setAnsweredInteractions(results);
            } catch (err) {
                console.error("Error loading summary", err);
            } finally {
                setLoading(false);
            }
        }
        discoverAnswers();
    }, []);

    if (loading) return <div className="p-12 text-center">Analysiere Ihre Antworten...</div>;

    if (answeredInteractions.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Noch keine Teilnahmen</h3>
                <p className="text-slate-500 mt-2">Nehmen Sie an Umfragen oder Quizzes teil, um hier Ihre persönliche Zusammenfassung zu sehen.</p>
            </div>
        );
    }

    const quizTotal = answeredInteractions.filter(i => i.config.type === 'quiz').length;
    const quizCorrect = answeredInteractions.filter(i => {
        if (i.config.type !== 'quiz') return false;
        const correctOption = i.config.options.find(o => o.isCorrect);
        return correctOption?.id === i.vote;
    }).length;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Stats Header */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <div className="text-blue-100 text-xs uppercase font-bold tracking-widest mb-1">Teilnahmen</div>
                    <div className="text-4xl font-black">{answeredInteractions.length}</div>
                </div>
                <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200">
                    <div className="text-emerald-100 text-xs uppercase font-bold tracking-widest mb-1">Quiz Score</div>
                    <div className="text-4xl font-black">{quizCorrect} / {quizTotal}</div>
                </div>
            </div>

            {/* List of Answers */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Ihre individuellen Antworten
                </h3>

                {answeredInteractions.map(({ config, vote }) => {
                    const isQuiz = config.type === 'quiz';
                    const correctOption = config.options.find(o => o.isCorrect);
                    const isCorrect = isQuiz && correctOption?.id === vote;
                    const userOptionLabel = config.options.find(o => o.id === vote)?.label || vote;

                    return (
                        <div key={config.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center ${isQuiz ? (isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600') : 'bg-blue-100 text-blue-600'}`}>
                                {isQuiz ? (isCorrect ? <CheckCircle className="w-6 h-6" /> : '!') : <Info className="w-6 h-6" />}
                            </div>
                            <div className="flex-grow">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{config.type}</div>
                                <div className="font-bold text-slate-800 leading-tight mb-2">{swissifyData(config.question)}</div>
                                <div className="text-sm">
                                    <span className="text-slate-500">Ihre Antwort: </span>
                                    <span className={`font-bold ${isQuiz ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`}>
                                        {swissifyData(String(userOptionLabel))}
                                    </span>
                                </div>
                                {isQuiz && !isCorrect && (
                                    <div className="text-xs text-slate-400 mt-1">
                                        Richtig wäre: <span className="font-medium text-slate-600">{swissifyData(correctOption?.label || '')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
