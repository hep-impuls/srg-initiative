import { useState, useEffect, useRef } from 'react';
import {
    Globe,
    TrendingUp,
    TrendingDown,
    Users,
    BookOpen,
    AlertTriangle,
    Info,
    Landmark,
    Coins,
    ShieldCheck,
    ShieldAlert,
    ExternalLink,
    HelpCircle,
    Scale,
    Zap
} from 'lucide-react';

import { FocusRegion } from '@/components/FocusRegion';
import { useAudioDirector } from '@/hooks/useAudioDirector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SourceBadge } from '@/components/SourceBadge';
import { InteractionModal } from '@/components/interactions/InteractionModal';
import { InteractionSequence } from '@/components/interactions/InteractionSequence';
import { PageConfig, Source } from '@/types';
import { swissifyData } from '@/utils/textUtils';
import { SafeHTML } from '@/components/SafeHTML';
import publicMediaContent from '@/data/content/publicmedia-text.json';

interface PublicMediaPageProps {
    config: PageConfig;
}

// Source data mapping - loaded from JSON
const sources: Source[] = swissifyData(publicMediaContent.sources);

// Daten für Berufsschüler (B1 Niveau) - loaded from JSON
const countryData = swissifyData(publicMediaContent.countryData);

const PRE_UNIT_IDS = [
    'publicMedia-intro-funding-pre',
    'publicMedia-intro-priority-ranking',
    'publicMedia-intro-independence-slider'
];

const MAP_COMPARE_IDS = [
    'publicMedia-map-quiz-protection',
    'publicMedia-map-points-safeguards'
];

const POST_UNIT_IDS = [
    'publicMedia-outro-funding-post',
    'publicMedia-outro-action-ranking'
];

const MASTER_QUIZ_IDS = [
    ...PRE_UNIT_IDS,
    ...MAP_COMPARE_IDS,
    ...POST_UNIT_IDS
];

const StatusIndicator = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; text: string; icon: any }> = {
        sicher: { color: 'bg-emerald-500', text: 'Sehr Sicher', icon: ShieldCheck },
        stabil: { color: 'bg-blue-500', text: 'Stabil', icon: ShieldCheck },
        risiko: { color: 'bg-amber-500', text: 'Risiko / Unter Druck', icon: AlertTriangle },
        gefaehrdet: { color: 'bg-orange-500', text: 'Gefährdet', icon: ShieldAlert },
        kritisch: { color: 'bg-red-600', text: 'Kritisch / Instabil', icon: ShieldAlert },
    };
    const Cfg = config[status] || config.risiko;
    const Icon = Cfg.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-bold shadow-sm ${Cfg.color}`}>
            <Icon size={16} />
            <span>{Cfg.text}</span>
        </div>
    );
};

export function PublicMediaPage({ config }: PublicMediaPageProps) {
    const directorState = useAudioDirector(config.timeline);
    const { currentTab, audioState, audioRef, activeElementId } = directorState;

    // Fallback to manual control if no audio or audio paused
    const [manualTab, setManualTab] = useState<'intro' | 'map' | 'compare' | 'analysis' | 'quiz'>('intro');
    const activeTab = audioState.isPlaying
        ? (currentTab || manualTab)
        : manualTab;

    const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [completedModals, setCompletedModals] = useState<string[]>([]);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        document.title = 'SRG Initiative - Medien-Check Global';
    }, []);

    // Sync manual tab when director changes tab
    useEffect(() => {
        if (currentTab && audioState.isPlaying) {
            setManualTab(currentTab as any);
        }
    }, [currentTab, audioState.isPlaying]);

    // Sync selected country with audio director
    useEffect(() => {
        if (activeElementId?.startsWith('country_')) {
            const countryId = activeElementId.replace('country_', '');
            const country = countryData.find(c => c.id === countryId);
            if (country) {
                setSelectedCountry(country);
            }
        }
    }, [activeElementId]);

    // Pre-unit trigger when audio starts for the first time
    useEffect(() => {
        if (audioState.isPlaying && !hasStartedRef.current && !completedModals.includes('pre')) {
            audioRef.current?.pause();
            setActiveModal('pre');
            hasStartedRef.current = true;
        }
    }, [audioState.isPlaying, completedModals, audioRef]);

    // Mid-unit transition triggers
    useEffect(() => {
        const time = audioState.currentTime;

        if (time > 371 && time < 374 && !completedModals.includes('map-compare') && activeModal !== 'map-compare') {
            audioRef.current?.pause();
            setActiveModal('map-compare');
        }
    }, [audioState.currentTime, completedModals, activeModal, audioRef]);

    // Post-unit trigger near the end of the audio
    useEffect(() => {
        if (audioState.duration > 0 && audioState.currentTime >= audioState.duration - 0.5 && !completedModals.includes('post') && activeModal !== 'post') {
            setActiveModal('post');
        }
    }, [audioState.currentTime, audioState.duration, completedModals, activeModal]);

    const handleModalComplete = (modalId: string) => {
        setCompletedModals(prev => (prev.includes(modalId) ? prev : [...prev, modalId]));
        setActiveModal(null);

        if (modalId !== 'post') {
            audioRef.current?.play();
        }
    };

    // Ensure smooth scrolling
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            <InteractionModal isOpen={activeModal === 'pre'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={PRE_UNIT_IDS}
                    mode="stepped"
                    title="Teil 1: Deine Meinung vor dem Start"
                    showResultsButton={false}
                    onComplete={() => handleModalComplete('pre')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'map-compare'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={MAP_COMPARE_IDS}
                    mode="stepped"
                    title="Zwischen-Check: Laendervergleich"
                    showResultsButton={false}
                    onComplete={() => handleModalComplete('map-compare')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'post'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={POST_UNIT_IDS}
                    mode="stepped"
                    title="Fazit: Deine Meinung nach der Einheit"
                    showResultsButton={true}
                    resultsSourceId="publicMedia"
                    onComplete={() => handleModalComplete('post')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'master'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={MASTER_QUIZ_IDS}
                    mode="stepped"
                    title="Abschluss-Check"
                    showResultsButton={true}
                    resultsSourceId="publicMedia"
                    onComplete={() => handleModalComplete('master')}
                />
            </InteractionModal>

            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <FocusRegion id="public_media__header" label="Kopfbereich" className="flex items-center gap-4 !bg-transparent">
                        <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
                            <Globe className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Medien-Check Global</h1>
                            <p className="text-blue-200 text-sm">Wie unabhängig sind Nachrichten weltweit?</p>
                        </div>
                    </FocusRegion>

                    <FocusRegion id="public_media__nav" label="Hauptnavigation" as="nav" className="flex bg-slate-700/50 p-1 rounded-lg backdrop-blur-sm">
                        {[
                            { id: 'intro', label: publicMediaContent.tabs.intro.label, icon: Info },
                            { id: 'map', label: publicMediaContent.tabs.map.label, icon: Globe },
                            { id: 'compare', label: publicMediaContent.tabs.compare.label, icon: Scale },
                            { id: 'analysis', label: publicMediaContent.tabs.analysis.label, icon: Zap },
                            { id: 'quiz', label: publicMediaContent.tabs.quiz.label, icon: HelpCircle }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setManualTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </FocusRegion>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-6">

                {/* VIEW: INTRO / HERO */}
                {activeTab === 'intro' && (
                    <div className="animate-in fade-in duration-700">
                        {/* Hero Section */}
                        <FocusRegion id="public_media__hero" label="Intro-Bereich" className="relative bg-slate-900 !bg-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-12">
                            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                            <div className="grid md:grid-cols-2 gap-12 p-12 relative z-10">
                                <div className="flex flex-col justify-center space-y-6">
                                    <div className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest w-fit border border-blue-500/30">
                                        Ein Globaler Vergleich
                                    </div>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                        Wer <span className="text-blue-500">finanziert</span> die öffentlichen Medien?
                                    </h2>
                                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                                        Eine Reise durch die Mediensysteme der Welt. Von unabhängigen Stiftungen bis zum Staatsfunk – und was das für unser Vertrauen bedeutet.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700/50 group hover:border-blue-500/50 transition-all duration-500 hover:rotate-1">
                                        <img
                                            src="img/public_media/0.png"
                                            alt="Visualisierung Globaler Medienströme"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FocusRegion>

                        {/* Navigation Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {(['map', 'compare', 'analysis'] as const).map((key) => {
                                const card = publicMediaContent.heroCards[key];
                                return (
                                    <FocusRegion key={key} id={`public_media__hero__card_${key}`} label={card.heading} className="group cursor-pointer">
                                        <div onClick={() => setManualTab(key)} className={`h-full bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 ${key === 'map' ? 'hover:border-blue-500' : key === 'compare' ? 'hover:border-emerald-500' : 'hover:border-amber-500'}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:text-white transition-colors ${key === 'map' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600' : key === 'compare' ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-600'}`}>
                                                {key === 'map' && <Globe size={24} />}
                                                {key === 'compare' && <Scale size={24} />}
                                                {key === 'analysis' && <Zap size={24} />}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">{card.heading}</h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {card.text}
                                            </p>
                                        </div>
                                    </FocusRegion>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* VIEW: LÄNDER MONITOR */}
                {activeTab === 'map' && (
                    <FocusRegion id="public_media__map" label="Länder-Übersicht" className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        {/* Sidebar List */}
                        <FocusRegion id="public_media__map__sidebar" label="Länder-Liste" className="lg:col-span-3 flex flex-col gap-2 h-full">
                            <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">{publicMediaContent.tabs.map.label}</h3>
                            <div className="flex flex-col gap-2">
                                {countryData.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCountry(c)}
                                        className={`group px-3 py-3 rounded-lg border text-left transition-all hover:shadow-md relative shrink-0 h-fit flex items-center justify-between ${selectedCountry.id === c.id
                                            ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-md transform scale-[1.02]'
                                            : 'bg-white border-slate-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{c.name}</span>
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded leading-none">{c.model}</span>
                                            </div>
                                        </div>
                                        <span className={`h-2 w-2 rounded-full shrink-0 ${c.status === 'sicher' ? 'bg-emerald-500' :
                                            c.status === 'stabil' ? 'bg-blue-500' :
                                                c.status === 'risiko' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                    </button>
                                ))}
                            </div>
                        </FocusRegion>

                        {/* Detail View */}
                        <FocusRegion id={`country_${selectedCountry.id}`} label={`Detail: ${selectedCountry.name}`} className="lg:col-span-9">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
                                {/* Card Header */}
                                <FocusRegion id="public_media__map__detail__header" label="Länder-Header" className="bg-slate-50/80 border-b border-slate-100 p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-extrabold text-slate-900">{selectedCountry.name}</h2>
                                                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold uppercase rounded tracking-wide">
                                                    {selectedCountry.region}
                                                </span>
                                            </div>
                                            <div className="text-slate-600 font-medium flex items-center gap-2">
                                                <Coins size={16} className="text-slate-400" /> {selectedCountry.model}
                                            </div>
                                        </div>
                                        <StatusIndicator status={selectedCountry.status} />
                                    </div>

                                    {/* Key Metrics */}
                                    <FocusRegion id="public_media__map__detail__stats" label="Statistik" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Geld-Sicherheit</div>
                                            <div className={`font-bold text-lg ${selectedCountry.stability.includes('Hoch') ? 'text-emerald-600' :
                                                selectedCountry.stability.includes('Mittel') ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {selectedCountry.stability}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Unabhängigkeit</div>
                                            <div className={`font-bold text-lg ${selectedCountry.independence.includes('Hoch') ? 'text-emerald-600' :
                                                selectedCountry.independence.includes('Mittel') ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {selectedCountry.independence}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Vertrauen (0-100%)</div>
                                            <div className="flex items-end gap-2">
                                                <span className="text-3xl font-black text-slate-800">{selectedCountry.trustScore}%</span>
                                                <span className="text-xs text-slate-400 mb-1 pb-1">laut Studie</span>
                                            </div>
                                        </div>
                                    </FocusRegion>
                                </FocusRegion>

                                {/* Card Body */}
                                <div className="p-8 space-y-8">

                                    {/* Funding Detail Box */}
                                    <FocusRegion id="public_media__map__detail__funding" label="Finanzierung" className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                                        <Landmark className="text-blue-600 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Woher kommt das Geld?</h4>
                                            <p className="text-blue-800 text-sm font-medium">{selectedCountry.fundingDetail}</p>
                                        </div>
                                    </FocusRegion>

                                    <FocusRegion id="public_media__map__detail__desc" label="Beschreibung">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                                            <Info size={20} className="text-blue-500" />
                                            {publicMediaContent.countryData[0].id === 'deutschland' ? 'So funktioniert das System' : 'System-Details'}
                                        </h3>
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="flex-1">
                                                <div className="text-slate-700 leading-relaxed text-base mb-3">
                                                    <SafeHTML content={selectedCountry.description} />
                                                </div>
                                                <SourceBadge ids={selectedCountry.refs} />
                                            </div>
                                            {/* @ts-ignore - image property is added dynamically */}
                                            {selectedCountry.image && (
                                                <div className="w-full md:w-2/5 shrink-0">
                                                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-md border border-slate-200">
                                                        <img
                                                            /* @ts-ignore */
                                                            src={selectedCountry.image}
                                                            /* @ts-ignore */
                                                            alt={selectedCountry.imageAlt || ''}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </FocusRegion>

                                    <FocusRegion id="public_media__map__detail__risks" label="Risiko-Analyse" className={`p-5 rounded-xl border ${selectedCountry.status === 'sicher' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                                        }`}>
                                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 text-slate-900">
                                            {selectedCountry.status === 'sicher' ? 'Warum es gut funktioniert:' : 'Das grösste Problem:'}
                                        </h3>
                                        <div className={`text-sm ${selectedCountry.status === 'sicher' ? 'text-emerald-800' : 'text-red-800'}`}>
                                            <SafeHTML content={selectedCountry.risks} />
                                        </div>
                                    </FocusRegion>
                                </div>
                            </div>
                        </FocusRegion>
                    </FocusRegion>
                )}

                {/* VIEW: DATEN VERGLEICH */}
                {activeTab === 'compare' && (
                    <FocusRegion id="public_media__compare" label="Vergleich" className="space-y-8 animate-in fade-in duration-500">
                        <FocusRegion id="public_media__compare__main_visual" label="Vergleich: Visualisierung" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <FocusRegion id="public_media__compare__intro" label="Einführung" className="max-w-3xl mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">{publicMediaContent.comparison.heading}</h2>
                                <p className="text-slate-600 text-lg">
                                    <SafeHTML content={publicMediaContent.comparison.text} as="span" />
                                </p>
                                <SourceBadge ids={["12", "39", "40"]} />
                            </FocusRegion>

                            {/* Chart Visualization */}
                            <FocusRegion id="public_media__compare__chart" label="Vertrauens-Chart" className="relative h-80 flex items-end justify-between gap-4 px-4 pb-8 border-b border-slate-200">
                                <div className="absolute left-0 top-10 bottom-10 w-px border-l border-dashed border-slate-300"></div>
                                <div className="absolute -left-8 top-1/2 -rotate-90 text-xs font-bold text-slate-400 tracking-widest uppercase">
                                    {publicMediaContent.comparison.chartLabel}
                                </div>

                                {countryData
                                    .sort((a, b) => b.trustScore - a.trustScore)
                                    .map((c) => (
                                        <div key={c.id} className="group relative flex flex-col items-center w-full transition-all hover:scale-105">
                                            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-blue-600 text-lg">
                                                {c.trustScore}%
                                            </div>
                                            <div
                                                className={`w-full max-w-[50px] rounded-t-lg transition-all ${c.id === 'finland' || c.id === 'deutschland' ? 'bg-emerald-400' :
                                                    c.id === 'usa' || c.id === 'griechenland' ? 'bg-red-400' : 'bg-blue-400'
                                                    }`}
                                                style={{ height: `${c.trustScore * 3}px` }}
                                            />
                                            <div className="mt-3 text-xs font-bold text-slate-600 -rotate-45 origin-top-left translate-y-4 whitespace-nowrap">
                                                {c.name}
                                            </div>
                                        </div>
                                    ))}
                            </FocusRegion>
                        </FocusRegion>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FocusRegion id="public_media__compare__myth" label="Mythos-Check" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" />
                                    {publicMediaContent.comparison.mythCheck.heading}
                                </h3>
                                <p className="text-slate-700 mb-4">
                                    <SafeHTML content={publicMediaContent.comparison.mythCheck.text} />
                                </p>
                                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 text-sm">
                                    <div className="flex justify-between items-center mb-2 font-bold text-emerald-900">
                                        <span>{publicMediaContent.comparison.mythCheck.listHeader}</span>
                                        <span className="text-emerald-600">{publicMediaContent.comparison.mythCheck.listSubHeader}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-emerald-900 border-t border-emerald-200 pt-2">
                                        <span>{publicMediaContent.comparison.mythCheck.listResult}</span>
                                        <span>{publicMediaContent.comparison.mythCheck.listValue}</span>
                                    </div>
                                    <div className="mt-3 text-sm text-emerald-800 italic">
                                        {publicMediaContent.comparison.mythCheck.footer}
                                    </div>
                                    <SourceBadge ids={["33", "34", "35"]} />
                                </div>
                            </FocusRegion>

                            <FocusRegion id="public_media__compare__gap" label="Wissens-Lücke" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <BookOpen className="text-blue-500" />
                                    {publicMediaContent.comparison.knowledgeGap.heading}
                                </h3>
                                <p className="text-slate-700 mb-4">
                                    {publicMediaContent.comparison.knowledgeGap.text}
                                </p>
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-100 rounded text-slate-700">
                                        <span className="block font-bold text-xs uppercase mb-1 text-slate-500">{publicMediaContent.comparison.knowledgeGap.usaHeader}</span>
                                        <span className="text-sm">{publicMediaContent.comparison.knowledgeGap.usaText}</span>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded text-blue-900 border border-blue-100">
                                        <span className="block font-bold text-xs uppercase mb-1 text-blue-400">{publicMediaContent.comparison.knowledgeGap.europeHeader}</span>
                                        <span className="text-sm"><SafeHTML content={publicMediaContent.comparison.knowledgeGap.europeText} as="span" /></span>
                                    </div>
                                    <SourceBadge ids={["5", "36", "37"]} />
                                </div>
                            </FocusRegion>
                        </div>
                    </FocusRegion>
                )}

                {/* VIEW: ANALYSE & FOLGEN */}
                {activeTab === 'analysis' && (
                    <FocusRegion id="public_media__analysis" label="Folgen & Analyse" className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">

                        {/* Case Study Template */}
                        {(['privatization', 'intervention'] as const).map((key) => {
                            const section = publicMediaContent.analysis[key];
                            return (
                                <FocusRegion key={key} id={`public_media__analysis__${key}`} label={section.heading} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                    <div className={`${key === 'privatization' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'} p-6 border-b`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {key === 'privatization' ? <AlertTriangle className="text-red-600" /> : <ShieldAlert className="text-amber-600" />}
                                            <h3 className={`text-xl font-bold ${key === 'privatization' ? 'text-red-900' : 'text-amber-900'}`}>{section.heading}</h3>
                                        </div>
                                        <p className={`${key === 'privatization' ? 'text-red-800' : 'text-amber-800'} text-sm`}>{section.subheading}</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-slate-700 leading-relaxed">
                                            {section.text}
                                        </p>
                                        <ul className="space-y-3">
                                            {section.points.map((pt: any, idx: number) => (
                                                <li key={idx} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                                    <TrendingDown className={`${key === 'privatization' ? 'text-red-500' : 'text-amber-500'} shrink-0`} size={24} />
                                                    <span>
                                                        <strong>{pt.title}:</strong> {pt.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <SourceBadge ids={key === 'privatization' ? ["23", "24", "25", "26", "27"] : ["1", "3", "30", "31"]} />
                                    </div>
                                </FocusRegion>
                            );
                        })}

                        {/* Theory: Social Cohesion */}
                        <FocusRegion id="public_media__analysis__cohesion" label="Zusammenhalt" className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-white/10 p-4 rounded-full">
                                    <Users size={40} className="text-blue-100" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{publicMediaContent.analysis.cohesion.heading}</h3>
                                    <p className="text-blue-100 leading-relaxed mb-4 text-lg">
                                        <SafeHTML content={publicMediaContent.analysis.cohesion.text} as="span" />
                                    </p>
                                    <SourceBadge ids={["4", "38"]} />
                                </div>
                            </div>
                        </FocusRegion>
                    </FocusRegion>
                )}

                {/* VIEW: QUIZ */}
                {activeTab === 'quiz' && (
                    <FocusRegion id="public_media__quiz" label="Abschluss-Check" className="animate-in fade-in duration-500">
                        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-slate-200">
                            <div className="max-w-4xl mx-auto text-center">
                                <span className="inline-block p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
                                    <HelpCircle size={32} />
                                </span>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">{publicMediaContent.quizView.heading}</h2>
                                <p className="text-slate-600 text-lg mb-8">
                                    {publicMediaContent.quizView.text}
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            audioRef.current?.pause();
                                            setActiveModal('master');
                                        }}
                                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                    >
                                        {publicMediaContent.quizView.startButton}
                                    </button>
                                    <button
                                        onClick={() => window.location.hash = '#/report/results/publicMedia'}
                                        className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                                    >
                                        {publicMediaContent.quizView.resultsButton}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FocusRegion>
                )}

                {/* Footer with Sources List */}
                <div id="quellen" className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {publicMediaContent.footer.sourcesHeading}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sources.map((source) => (
                            <a
                                key={source.id}
                                id={`source-${source.id}`}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group scroll-mt-32 outline-none target:ring-2 target:ring-blue-500 target:ring-offset-2 target:rounded-xl transition-all"
                            >
                                <div className="h-full text-[10px] bg-white p-2.5 rounded-xl shadow-sm border border-slate-100/50 group-hover:border-blue-200 group-hover:shadow-md transition-all">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <div className="flex items-baseline">
                                            <span className="font-black text-blue-600 mr-1.5 opacity-70">[{source.id}]</span>
                                            <span className="font-bold text-slate-800 leading-[1.1] group-hover:text-blue-700 transition-colors">{source.text}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 pl-5 text-[10px] leading-relaxed italic">{source.details}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>


            </main>

            {/* Audio Player Component */}
            <AudioPlayer
                audioSrc={config.audioSrc || ''}
                directorState={directorState}
                onStartQuiz={() => {
                    audioRef.current?.pause();
                    setActiveModal('master');
                }}
                onShowResults={() => window.location.hash = '#/report/results/publicMedia'}
            />
        </div>
    );
};
