import React, { useEffect, useState } from 'react';
import { InteractionConfig, InteractionResults } from '../../types/interaction';
import { swissifyData } from '../../utils/textUtils';
import { CheckCircle, Info, Award, Users } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface UserSummaryProps {
    sourceId?: string;
}

export const UserSummary: React.FC<UserSummaryProps> = ({ sourceId }) => {
    const [answeredInteractions, setAnsweredInteractions] = useState<{ config: InteractionConfig, vote: string | number | null, stats: InteractionResults | null }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function discoverAnswers() {
            try {
                const modules = import.meta.glob('../../data/interactions/*.json');
                const results: { config: InteractionConfig, vote: string | number | null, stats: InteractionResults | null }[] = [];

                for (const path in modules) {
                    const mod: any = await modules[path]();
                    const config = mod.default || mod;
                    const userVote = localStorage.getItem(`vote_${config.id}`);

                    // Filter logic
                    let shouldInclude = true;
                    if (sourceId) {
                        if (sourceId === 'agora' && !config.id.startsWith('agora-')) {
                            shouldInclude = false;
                        }
                    }

                    if (shouldInclude) {
                        // Fetch stats from Firestore
                        let stats: InteractionResults | null = null;
                        try {
                            const docRef = doc(db, 'interactions', config.id);
                            const snap = await getDoc(docRef);
                            if (snap.exists()) {
                                const data = snap.data();
                                stats = {
                                    totalVotes: data.total_votes || 0,
                                    optionCounts: data.options || {}
                                };
                            }
                        } catch (e) {
                            console.warn("Failed to load stats for", config.id, e);
                        }

                        results.push({ config, vote: userVote, stats });
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
    }, [sourceId]);

    if (loading) return <div className="p-12 text-center text-slate-500">Analysiere Ihre Antworten...</div>;

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
        if (i.config.type !== 'quiz' || !i.vote) return false;
        const correctOption = i.config.options?.find((o: any) => o.isCorrect);
        return correctOption?.id === i.vote;
    }).length;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Stats Header */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <div className="text-blue-100 text-xs uppercase font-bold tracking-widest mb-1">Antworten</div>
                    <div className="text-4xl font-black">{answeredInteractions.filter(i => i.vote !== null).length}</div>
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

                {answeredInteractions.map(({ config, vote, stats }) => {
                    const isQuiz = config.type === 'quiz';
                    const correctOption = config.options?.find((o: any) => o.isCorrect);
                    const isCorrect = isQuiz && correctOption?.id === vote;
                    const userOptionLabel = vote ? (config.options?.find((o: any) => o.id === vote)?.label || vote) : null;

                    return (
                        <div key={config.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center ${isQuiz ? (vote ? (isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600') : 'bg-slate-100 text-slate-400') : (vote ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400')}`}>
                                {isQuiz ? (vote ? (isCorrect ? <CheckCircle className="w-6 h-6" /> : '!') : '?') : (vote ? <Info className="w-6 h-6" /> : '?')}
                            </div>
                            <div className="flex-grow">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{config.type}</div>
                                <div className="font-bold text-slate-800 leading-tight mb-2">{swissifyData(config.question)}</div>
                                <div className="text-sm mb-3">
                                    <span className="text-slate-500">Ihre Antwort: </span>
                                    {vote ? (
                                        <span className={`font-bold ${isQuiz ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`}>
                                            {swissifyData(String(userOptionLabel))}
                                        </span>
                                    ) : (
                                        <span className="font-bold text-slate-400 italic">keine antwort</span>
                                    )}
                                </div>
                                {isQuiz && !isCorrect && (
                                    <div className="text-xs text-slate-400 mb-3">
                                        Richtig wäre: <span className="font-medium text-slate-600">{swissifyData(correctOption?.label || '')}</span>
                                    </div>
                                )}

                                {/* Community Stats */}
                                {stats && stats.totalVotes > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">Teilnehmer ({stats.totalVotes})</span>
                                        </div>

                                        {/* TYPE: QUIZ & POLL */}
                                        {(config.type === 'quiz' || config.type === 'poll') && (
                                            <div className="space-y-2">
                                                {config.options?.map((opt: any) => {
                                                    const count = stats.optionCounts[opt.id] || 0;
                                                    const percentage = Math.round((count / stats.totalVotes) * 100);
                                                    const isUserChoice = opt.id === vote;
                                                    const isCorrectChoice = isQuiz && opt.isCorrect;

                                                    return (
                                                        <div key={opt.id} className="text-xs">
                                                            <div className="flex justify-between mb-1">
                                                                <span className={`${isUserChoice ? 'font-bold text-slate-700' : 'text-slate-500'}`}>
                                                                    {swissifyData(opt.label)}
                                                                    {isUserChoice && " (Du)"}
                                                                </span>
                                                                <span className="font-mono text-slate-400">{percentage}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${isCorrectChoice ? 'bg-green-400' : 'bg-blue-400'} ${isUserChoice ? 'opacity-100' : 'opacity-40'}`}
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* TYPE: SLIDER */}
                                        {config.type === 'slider' && (() => {
                                            const sum = Object.entries(stats.optionCounts).reduce((acc, [val, count]) => acc + (Number(val) * count), 0);
                                            const avg = sum / stats.totalVotes;
                                            return (
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-slate-100 rounded-full relative mt-2">
                                                        {/* User Marker */}
                                                        {vote !== null && (
                                                            <>
                                                                <div className="absolute top-0 w-1 h-4 bg-blue-600 z-10" style={{ left: `${Number(vote)}%` }} />
                                                                <div className="absolute -top-5 text-xs text-blue-600 font-bold" style={{ left: `${Number(vote)}%`, transform: 'translateX(-50%)' }}>Du</div>
                                                            </>
                                                        )}

                                                        {/* Avg Marker */}
                                                        <div className="absolute top-0 w-1 h-4 bg-slate-400 opacity-50" style={{ left: `${avg}%` }} />
                                                        <div className="absolute top-5 text-xs text-slate-400 font-bold" style={{ left: `${avg}%`, transform: 'translateX(-50%)' }}>Ø {Math.round(avg)}</div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* TYPE: RANKING */}
                                        {config.type === 'ranking' && (() => {
                                            // Calculate average score (position 1 = N points)
                                            const optionScores: Record<string, number> = {};
                                            const opts = config.options || [];
                                            opts.forEach(o => optionScores[o.id] = 0);

                                            Object.entries(stats.optionCounts).forEach(([orderStr, count]) => {
                                                const order = orderStr.split(',');
                                                order.forEach((id, idx) => {
                                                    // Score: N for 1st place, N-1 for 2nd...
                                                    const score = opts.length - idx;
                                                    optionScores[id] = (optionScores[id] || 0) + (score * count);
                                                });
                                            });

                                            // Sort options by total score
                                            const sortedOptions = [...opts].sort((a, b) => optionScores[b.id] - optionScores[a.id]);

                                            return (
                                                <div className="space-y-1 mt-2">
                                                    <div className="text-xs text-slate-400 font-bold mb-1">Teilnehmer-Ranking (Top 3):</div>
                                                    {sortedOptions.slice(0, 3).map((opt, idx) => (
                                                        <div key={opt.id} className="flex items-center gap-2 text-xs">
                                                            <div className="font-mono font-bold text-slate-300 w-4">#{idx + 1}</div>
                                                            <div className="text-slate-600 font-medium">{swissifyData(opt.label)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}

                                        {/* TYPE: POINTS */}
                                        {config.type === 'points' && (() => {
                                            const optionTotals: Record<string, number> = {};
                                            config.options?.forEach(o => optionTotals[o.id] = 0);

                                            Object.entries(stats.optionCounts).forEach(([allocStr, count]) => {
                                                const parts = allocStr.split(','); // "id:20,id2:80"
                                                parts.forEach(p => {
                                                    const [id, val] = p.split(':');
                                                    optionTotals[id] = (optionTotals[id] || 0) + (Number(val) * count);
                                                });
                                            });

                                            return (
                                                <div className="space-y-3 mt-2">
                                                    {config.options?.map((opt: any) => {
                                                        const avg = (optionTotals[opt.id] || 0) / stats.totalVotes;
                                                        // Parse User Vote
                                                        let userVal = 0;
                                                        if (vote && typeof vote === 'string') {
                                                            const userMap = vote.split(',').reduce((acc, curr) => {
                                                                const [k, v] = curr.split(':');
                                                                acc[k] = Number(v);
                                                                return acc;
                                                            }, {} as Record<string, number>);
                                                            userVal = userMap[opt.id] || 0;
                                                        }

                                                        return (
                                                            <div key={opt.id} className="text-xs">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-slate-600 font-medium">{swissifyData(opt.label)}</span>
                                                                    <div className="flex gap-3">
                                                                        {vote !== null && <span className="text-blue-600 font-bold">Du: {userVal}</span>}
                                                                        <span className="text-slate-400">Ø: {Math.round(avg)}</span>
                                                                    </div>
                                                                </div>
                                                                {/* Compare Bars */}
                                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                                                                    <div className="absolute top-0 bottom-0 bg-blue-400 opacity-30" style={{ width: `${avg}%` }}></div>
                                                                    {vote !== null && <div className="absolute top-0 bottom-0 border-l-2 border-blue-600 h-full" style={{ left: `${userVal}%` }}></div>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}

                                        {/* TYPE: GUESS */}
                                        {config.type === 'guess' && (() => {
                                            const sum = Object.entries(stats.optionCounts).reduce((acc, [val, count]) => acc + (Number(val) * count), 0);
                                            const avg = sum / stats.totalVotes;
                                            return (
                                                <div className="text-xs mt-2 text-slate-500">
                                                    Durchschnitt aller Schätzungen: <span className="font-bold">{avg.toFixed(1)}</span>
                                                </div>
                                            );
                                        })()}
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
