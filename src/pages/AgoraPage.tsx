import { useRef, useState, useEffect } from 'react';
import {
    Smartphone,
    Users,
    TrendingDown,
    Vote,
    MessageCircle,
    ExternalLink,
    BookOpen,
    BarChart3,
    Scale,
    BrainCircuit,
    Lock,
    ArrowRight,
    Flame,
    LayoutGrid
} from 'lucide-react';
import { useAudioDirector } from '@/hooks/useAudioDirector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { StatCard } from '@/components/StatCard';
import { SourceBadge } from '@/components/SourceBadge';
import { FocusRegion } from '@/components/FocusRegion';
import { PageConfig, Source } from '@/types';
import { swissifyData } from '@/utils/textUtils';
import { InteractionSequence } from '@/components/interactions/InteractionSequence';
import { InteractionModal } from '@/components/interactions/InteractionModal';
import { SafeHTML } from '@/components/SafeHTML';
import agoraContent from '@/data/content/agora-text.json';

interface AgoraPageProps {
    config: PageConfig;
}

// Sources data - loaded from JSON
const sources: Source[] = swissifyData(agoraContent.sources);


// Interaction Sequences
const PRE_UNIT_IDS = [
    'agora-intro-wordcloud-sub',
    'agora-intro-ranking',
    'agora-intro-scale-1',
    'agora-intro-scale-2',
    'agora-intro-scale-3',
    'agora-intro-money'
];

const THEORY_DATA_IDS = [
    'agora-quiz-gatekeeper',
    'agora-points-hypeman',
    'agora-slider-tunnel',
    'agora-ranking-history',
    'agora-guess-tv'
];

const DATA_CONSEQUENCES_IDS = [
    'agora-guess-money',
    'agora-quiz-tiktok',
    'agora-ranking-spiral',
    'agora-poll-slacktivism',
    'agora-slider-fakenews'
];

const POST_UNIT_IDS = [
    'agora-outro-scale-1',
    'agora-outro-scale-2',
    'agora-outro-scale-3',
    'agora-outro-action',
    'agora-outro-money-check',
    'agora-outro-wordcloud-sub'
];

const MASTER_QUIZ_IDS = [
    ...PRE_UNIT_IDS,
    ...THEORY_DATA_IDS,
    ...DATA_CONSEQUENCES_IDS,
    ...POST_UNIT_IDS
];

export function AgoraPage({ config }: AgoraPageProps) {
    const directorState = useAudioDirector(config.timeline);
    const { currentTab, audioState, audioRef } = directorState; // Destructure audioRef for control
    const [manualTab, setManualTab] = useState<'theory' | 'data' | 'consequences'>('theory');
    const activeTab = audioState.isPlaying ? currentTab : manualTab;

    // Modal State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [completedModals, setCompletedModals] = useState<string[]>([]);
    const hasStartedRef = useRef(false);

    // --- Modal Trigger Logic ---

    // 1. Pre-Unit (Start)
    useEffect(() => {
        if (audioState.isPlaying && !hasStartedRef.current && !completedModals.includes('pre')) {
            // Audio started, pause immediately and show modal
            audioRef.current?.pause();
            setActiveModal('pre');
            hasStartedRef.current = true;
        }
    }, [audioState.isPlaying, completedModals, audioRef]);

    // 2. Tab Transitions
    useEffect(() => {
        const time = audioState.currentTime;

        // Theory -> Data (~255s)
        if (time > 255 && time < 260 && !completedModals.includes('theory-data') && activeModal !== 'theory-data') {
            audioRef.current?.pause();
            setActiveModal('theory-data');
        }

        // Data -> Consequences (~397s)
        if (time > 397 && time < 402 && !completedModals.includes('data-consequences') && activeModal !== 'data-consequences') {
            audioRef.current?.pause();
            setActiveModal('data-consequences');
        }

    }, [audioState.currentTime, completedModals, activeModal, audioRef]);

    // 3. Post-Unit (End)
    useEffect(() => {
        // Trigger slightly before end or check if ended
        if (audioState.duration > 0 && audioState.currentTime >= audioState.duration - 0.5 && !completedModals.includes('post') && activeModal !== 'post') {
            setActiveModal('post');
            // Audio stops naturally or we ensure it's paused? It ends anyway.
        }
    }, [audioState.currentTime, audioState.duration, completedModals, activeModal]);


    const handleModalComplete = (modalId: string) => {
        setCompletedModals(prev => [...prev, modalId]);
        setActiveModal(null);

        // Resume playback if it's not the end
        if (modalId !== 'post') {
            audioRef.current?.play();
        }
    };

    // Use audio director's tab when playing, manual tab when paused
    // const activeTab = audioState.isPlaying ? currentTab : manualTab; // This line was moved up

    // Sync manual tab with director when audio starts playing
    useEffect(() => {
        if (audioState.isPlaying) {
            setManualTab(currentTab);
        }
    }, [audioState.isPlaying, currentTab]);

    // Ensure smooth scrolling
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
            <InteractionModal isOpen={activeModal === 'pre'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={PRE_UNIT_IDS}
                    mode="stepped"
                    title={agoraContent.modalTitles.pre}
                    showResultsButton={false}
                    onComplete={() => handleModalComplete('pre')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'theory-data'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={THEORY_DATA_IDS}
                    mode="stepped"
                    title={agoraContent.modalTitles.theoryData}
                    showResultsButton={false}
                    onComplete={() => handleModalComplete('theory-data')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'data-consequences'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={DATA_CONSEQUENCES_IDS}
                    mode="stepped"
                    title={agoraContent.modalTitles.dataConsequences}
                    showResultsButton={false}
                    onComplete={() => handleModalComplete('data-consequences')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'post'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={POST_UNIT_IDS}
                    mode="stepped"
                    title={agoraContent.modalTitles.post}
                    showResultsButton={true}
                    resultsSourceId="agora"
                    onComplete={() => handleModalComplete('post')}
                />
            </InteractionModal>

            <InteractionModal isOpen={activeModal === 'master'} onClose={() => setActiveModal(null)}>
                <InteractionSequence
                    interactionIds={MASTER_QUIZ_IDS}
                    mode="stepped"
                    title={agoraContent.modalTitles.master}
                    showResultsButton={true}
                    resultsSourceId="agora"
                    onComplete={() => handleModalComplete('master')}
                />
            </InteractionModal>

            {/* Unified Beginning Section (Header, Tabs, Intro) */}
            <div>
                {/* Header - Compact & Light */}
                <FocusRegion
                    id="beginning-highlight"
                    label="Einstieg & Überblick"
                    as="header"
                    className="bg-white text-slate-900 pt-8 pb-8 px-4 border-b border-slate-100 relative overflow-hidden"
                >
                    <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 mb-2">
                                {agoraContent.header.title.split(' ').slice(0, 3).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">{agoraContent.header.title.split(' ').slice(3).join(' ')}</span>
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500 max-w-sm leading-relaxed md:text-right">
                            {agoraContent.header.subtitle}
                        </p>
                    </div>
                </FocusRegion>

                {/* Main Content Area */}
                <main className="max-w-5xl mx-auto px-4 mt-8 relative z-20 pb-16">

                    {/* Navigation Tabs */}
                    <div id="main-tabs" className="bg-white rounded-t-2xl shadow-sm border border-slate-200 border-b-0 flex flex-col md:flex-row overflow-hidden">
                        <button
                            onClick={() => setManualTab('theory')}
                            id="tab-btn-theory"
                            className={`flex-1 py-3 px-4 text-left flex items-center transition-all ${activeTab === 'theory' ? 'bg-white border-b-4 border-blue-500 text-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2 rounded-full mr-3 ${activeTab === 'theory' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">{agoraContent.tabs.theory.label}</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">{agoraContent.tabs.theory.sublabel}</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setManualTab('data')}
                            id="tab-btn-data"
                            className={`flex-1 py-3 px-4 text-left flex items-center transition-all ${activeTab === 'data' ? 'bg-white border-b-4 border-purple-500 text-purple-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2 rounded-full mr-3 ${activeTab === 'data' ? 'bg-purple-100' : 'bg-slate-200'}`}>
                                <BarChart3 size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">{agoraContent.tabs.data.label}</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">{agoraContent.tabs.data.sublabel}</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setManualTab('consequences')}
                            id="tab-btn-consequences"
                            className={`flex-1 py-3 px-4 text-left flex items-center transition-all ${activeTab === 'consequences' ? 'bg-white border-b-4 border-amber-500 text-amber-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2 rounded-full mr-3 ${activeTab === 'consequences' ? 'bg-amber-100' : 'bg-slate-200'}`}>
                                <Scale size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">{agoraContent.tabs.consequences.label}</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">{agoraContent.tabs.consequences.sublabel}</div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content Container */}
                    <div className="bg-white rounded-b-2xl shadow-xl p-4 md:p-6 border-t border-slate-100">

                        {/* TAB 1: THEORIE */}
                        {activeTab === 'theory' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">



                                {/* Intro Text Section */}
                                <FocusRegion
                                    id="theory__intro"
                                    label={agoraContent.sections.theoryIntro.heading}
                                    className="flex flex-col lg:flex-row gap-6 items-center py-4 border-b border-slate-50 pb-8"
                                >
                                    <FocusRegion
                                        id="theory__intro__text"
                                        label="Intro Text"
                                        className="flex-1"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">{agoraContent.sections.theoryIntro.heading}</h2>
                                        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                            <SafeHTML content={agoraContent.sections.theoryIntro.text} className="inline" as="span" /> <SourceBadge ids={["1", "2"]} />
                                        </p>
                                    </FocusRegion>
                                    <FocusRegion
                                        id="theory__intro__image"
                                        label="Intro Bild"
                                        className="w-full lg:w-2/5 group"
                                    >
                                        <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200 transition-transform duration-500 hover:scale-[1.02]">
                                            <img
                                                src="img/agora1.png"
                                                alt="Digitale Informationslands landscapes"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </FocusRegion>
                                </FocusRegion>

                                {/* Comparison Grid - MOVED TO TOP */}
                                <FocusRegion
                                    id="theory__comparison"
                                    label={agoraContent.sections.comparison.heading}
                                    className="py-6 border-b border-slate-50"
                                >
                                    <h3 className="text-lg font-bold mb-4 text-center text-slate-700">{agoraContent.sections.comparison.heading}</h3>
                                    <div className="grid md:grid-cols-2 gap-4 relative">
                                        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-1.5 rounded-full shadow border border-slate-200">
                                            <ArrowRight className="text-slate-400 w-5 h-5" />
                                        </div>

                                        {/* FRÜHER */}
                                        <FocusRegion
                                            id="theory__comparison__left"
                                            label={agoraContent.sections.comparison.campfire.title}
                                            className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-colors"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full mb-2 mx-auto">
                                                <Flame className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <h4 className="text-center font-bold text-slate-700 mb-1">{agoraContent.sections.comparison.campfire.title}</h4>
                                            <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">{agoraContent.sections.comparison.campfire.subtitle}</p>
                                            <ul className="space-y-3 text-sm text-slate-600">
                                                {agoraContent.sections.comparison.campfire.points.map((point, idx) => (
                                                    <li key={idx} className="flex gap-2.5 items-start">
                                                        <Users className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </FocusRegion>

                                        {/* HEUTE */}
                                        <FocusRegion
                                            id="theory__comparison__right"
                                            label={agoraContent.sections.comparison.tunnel.title}
                                            className="bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-100 hover:border-blue-200 transition-colors"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full mb-2 mx-auto">
                                                <Smartphone className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h4 className="text-center font-bold text-blue-900 mb-1">{agoraContent.sections.comparison.tunnel.title}</h4>
                                            <p className="text-center text-[10px] text-blue-400 uppercase font-black tracking-widest mb-3">{agoraContent.sections.comparison.tunnel.subtitle}</p>
                                            <ul className="space-y-3 text-sm text-slate-700">
                                                {agoraContent.sections.comparison.tunnel.points.map((point, idx) => (
                                                    <li key={idx} className="flex gap-2.5 items-start">
                                                        <Users className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </FocusRegion>
                                    </div>
                                </FocusRegion>

                                {/* Agora Box Section */}
                                <FocusRegion
                                    id="theory__agora"
                                    label={agoraContent.sections.agora.heading}
                                    className="py-8 bg-gradient-to-br from-indigo-50/30 to-white rounded-3xl border border-indigo-100/50 p-4 md:p-8 relative overflow-hidden"
                                >
                                    <div className="relative z-10 w-full">
                                        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                            <LayoutGrid className="w-5 h-5 mr-3 text-indigo-600" />
                                            {agoraContent.sections.agora.heading}
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6 items-center">
                                            <div className="space-y-4">
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    <SafeHTML content={agoraContent.sections.agora.text1} />
                                                </p>
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    <SafeHTML content={agoraContent.sections.agora.text2} />
                                                </p>
                                                <div className="w-full max-w-[280px] mx-auto group pt-2">
                                                    <div className="aspect-square bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden transition-transform duration-500 hover:rotate-1">
                                                        <img
                                                            src="img/agora2.png"
                                                            alt="Antike Agora Rekonstruktion"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-indigo-100 text-sm shadow-xl space-y-3">

                                                <strong className="block text-lg text-indigo-700 mb-3 border-b border-indigo-50 pb-2">Vergleich für heute:</strong>
                                                <div className="flex items-start gap-4 text-slate-600">
                                                    <div className="bg-indigo-50 p-2 rounded-lg text-xl">🏛️</div>
                                                    <SafeHTML content={agoraContent.sections.agora.comparisonBefore} as="p" />
                                                </div>
                                                <div className="flex items-start gap-4 text-slate-600">
                                                    <div className="bg-indigo-50 p-2 rounded-lg text-xl">📱</div>
                                                    <SafeHTML content={agoraContent.sections.agora.comparisonToday} as="p" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                                </FocusRegion>

                                {/* Gatekeeper Section */}
                                <FocusRegion
                                    id="theory__gatekeeper"
                                    label={agoraContent.sections.gatekeeper.heading}
                                    className="py-8"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                                        <div className="flex-1">
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 md:p-8">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-emerald-500 p-1.5 rounded-lg"><Lock className="w-4 h-4 text-white" /></div>
                                                    <h3 className="text-lg font-bold text-emerald-900">{agoraContent.sections.gatekeeper.heading}</h3>
                                                </div>
                                                <p className="text-base text-emerald-900/80 leading-relaxed">
                                                    <FocusRegion id="theory__gatekeeper__word__gatekeeper" label="Wort: Gatekeeper" as="span" className="font-bold px-1 rounded transition-colors inline-block">Gatekeeper</FocusRegion> heisst <FocusRegion id="theory__gatekeeper__word__torwaechter" label="Wort: Torwächter" as="span" className="font-bold px-1 rounded transition-colors inline-block">"Torwächter"</FocusRegion>. <SafeHTML content={agoraContent.sections.gatekeeper.text} as="span" />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/3 group">
                                            <div className="aspect-square bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden p-1.5 transition-transform duration-500 hover:-rotate-1">
                                                <img
                                                    src="img/agora3.png"
                                                    alt="Digitaler Gatekeeper Konzept"
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </FocusRegion>

                                {/* Unified Algorithm & Attention Section */}
                                <div className="scroll-mt-24 py-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            {/* Left: Hype Man */}
                                            <FocusRegion
                                                id="theory__algorithm"
                                                label={agoraContent.sections.algorithm.heading}
                                                className="p-6 md:p-8"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <BrainCircuit className="w-5 h-5 text-blue-600" />
                                                    <h3 className="font-bold text-blue-900">{agoraContent.sections.algorithm.heading}</h3>
                                                </div>
                                                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                                                    <SafeHTML content={agoraContent.sections.algorithm.text} />
                                                </p>
                                                <div className="aspect-video bg-white rounded-xl overflow-hidden shadow-sm border border-blue-100/50">
                                                    <img src="img/agora5.png" alt="Algorithm Hype-Man" className="w-full h-full object-cover" />
                                                </div>
                                            </FocusRegion>

                                            {/* Right: Attention */}
                                            <FocusRegion
                                                id="theory__attention"
                                                label={agoraContent.sections.attention.heading}
                                                className="p-6 md:p-8 bg-white/50"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="bg-amber-100 p-1 rounded"><BrainCircuit className="w-4 h-4 text-amber-600" /></div>
                                                    <h3 className="font-bold text-amber-900">{agoraContent.sections.attention.heading}</h3>
                                                </div>
                                                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                                                    <SafeHTML content={agoraContent.sections.attention.text} />
                                                </p>
                                                <div className="aspect-video bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100/50">
                                                    <img src="img/agora6.png" alt="Attention Economy" className="w-full h-full object-cover" />
                                                </div>
                                            </FocusRegion>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DATEN */}
                        {activeTab === 'data' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                <FocusRegion
                                    id="data__overview"
                                    label={agoraContent.sections.dataOverview.heading}
                                    className="p-2 -m-2 rounded-3xl"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6 items-center py-4">
                                        <FocusRegion
                                            id="data__overview__text"
                                            label="Daten Intro Text"
                                            className="flex-1"
                                        >
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">{agoraContent.sections.dataOverview.heading}</h2>
                                            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                                <SafeHTML content={agoraContent.sections.dataOverview.text} />
                                            </p>
                                        </FocusRegion>
                                        <FocusRegion
                                            id="data__overview__image"
                                            label="Daten Intro Bild"
                                            className="w-full lg:w-2/5 group"
                                        >
                                            <div className="aspect-video bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 transition-all duration-500 hover:shadow-purple-200/50">
                                                <img
                                                    src="img/agora4.png"
                                                    alt="Digitale Nachrichtennutzung Visual"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </FocusRegion>
                                    </div>

                                    {/* Combined Stats & Chart Grid */}
                                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                                        {/* Left: Vertical Stats */}
                                        <div id="stat-cards" className="col-span-1 flex flex-col gap-4 scroll-mt-24">
                                            <StatCard id="stat-deprivierte" value="46%" label="News Deprivierte" subtext="Kaum noch Nachrichten-Fokus." color="red" sourceIds={["5"]} />
                                            <StatCard id="stat-social" value="17%" label="Nur Social" subtext="Kein Journalismus (18-24 J.)." color="purple" sourceIds={["1"]} />
                                            <StatCard id="stat-tiktok" value="+7%" label="TikTok Boom" subtext="Wachstum als Newsquelle." color="blue" sourceIds={["3"]} />
                                        </div>

                                        {/* Right: Chart Section */}
                                        <div id="chart-section" className="col-span-2 scroll-mt-24 bg-slate-50/50 rounded-3xl p-4 md:p-6 border border-slate-100 h-full mt-0">
                                            <h3 className="font-bold text-lg mb-6 text-center text-slate-800 tracking-tight">{agoraContent.sections.dataStats.chartHeading}</h3>
                                            <div className="max-w-3xl mx-auto w-full space-y-6 pb-2">
                                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                                                        <span>Klassisches TV (Gesamt DE)</span>
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">43%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                        <div className="bg-slate-400 h-full rounded-full" style={{ width: '43%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-purple-100">
                                                    <div className="flex justify-between mb-2 text-sm font-bold text-purple-900">
                                                        <span>Social Media (18-24 Jahre)</span>
                                                        <span className="bg-purple-100 px-2 py-0.5 rounded-full text-xs">50%</span>
                                                    </div>
                                                    <div className="w-full bg-purple-50 rounded-full h-2.5 overflow-hidden">
                                                        <div className="bg-purple-600 h-full rounded-full" style={{ width: '50%' }}></div>
                                                    </div>
                                                    <div className="mt-2 flex justify-end shrink-0 scale-90 origin-right"><SourceBadge ids={["1", "3"]} /></div>
                                                </div>
                                            </div>
                                            <div className="mt-6 grid md:grid-cols-2 gap-4">
                                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <h4 className="font-bold text-sm mb-1 text-slate-800">{agoraContent.sections.dataStats.tiktokHeading}</h4>
                                                    <p className="text-[10px] text-slate-600 leading-relaxed"><SafeHTML content={agoraContent.sections.dataStats.tiktokText} as="span" /></p>
                                                </div>
                                                <div id="bildungskluft-card" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <h4 className="font-bold text-sm mb-1 text-slate-800">{agoraContent.sections.dataStats.bildungskluftHeading}</h4>
                                                    <p className="text-[10px] text-slate-600 leading-relaxed">{agoraContent.sections.dataStats.bildungskluftText}</p>
                                                    <div className="mt-1 scale-90 origin-left"><SourceBadge ids={["6"]} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FocusRegion>

                                {/* 15-Second Video Problem Section */}
                                <FocusRegion
                                    id="data__tiktok"
                                    label={agoraContent.sections.tiktokProblem.heading}
                                    className="scroll-mt-24 bg-purple-50/30 rounded-3xl p-4 md:p-8 border border-purple-100 my-4"
                                >
                                    <h3 className="font-bold text-xl mb-6 text-center text-purple-900 tracking-tight">{agoraContent.sections.tiktokProblem.heading}</h3>
                                    <div className="grid md:grid-cols-2 gap-6 items-center">
                                        <div className="space-y-4">
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                <SafeHTML content={agoraContent.sections.tiktokProblem.text1} />
                                            </p>
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                <SafeHTML content={agoraContent.sections.tiktokProblem.text2} />
                                            </p>
                                            <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-r-xl">
                                                <p className="text-sm text-purple-900 font-semibold">{agoraContent.sections.tiktokProblem.callout}</p>
                                            </div>
                                            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 hover:shadow-xl transition-shadow mt-4">
                                                <img
                                                    src="img/agora7.png"
                                                    alt="Komplexität vs. 15 Sekunden"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
                                                <img
                                                    src="img/agora8.png"
                                                    alt="Information Loss Funnel"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </FocusRegion>

                                {/* Money Flow Section */}
                                <FocusRegion
                                    id="data__money"
                                    label={agoraContent.sections.moneyFlow.heading}
                                    className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-4 md:p-8 border border-red-100 my-4"
                                >
                                    <h3 className="font-bold text-xl mb-4 text-center text-red-900 tracking-tight">{agoraContent.sections.moneyFlow.heading}</h3>
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-1 space-y-4">
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                <SafeHTML content={agoraContent.sections.moneyFlow.text1} />
                                            </p>
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                <strong>{agoraContent.sections.moneyFlow.text2.split(' um ')[0]}</strong> um {agoraContent.sections.moneyFlow.text2.split(' um ')[1]}
                                            </p>
                                            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-xl">
                                                <p className="text-sm text-red-900 font-semibold">{agoraContent.sections.moneyFlow.callout} <SourceBadge ids={["7"]} /></p>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-lg border border-red-100 hover:rotate-1 transition-transform">
                                                <img
                                                    src="img/agora9.png"
                                                    alt="Der Teufelskreis der Finanzierung"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </FocusRegion>
                            </div>
                        )}

                        {/* TAB 3: FOLGEN */}
                        {activeTab === 'consequences' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                <FocusRegion
                                    id="consequences__intro"
                                    label={agoraContent.sections.consequencesIntro.heading}
                                    className="py-6"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">{agoraContent.sections.consequencesIntro.heading}</h2>
                                    <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                        <SafeHTML content={agoraContent.sections.consequencesIntro.text} />
                                    </p>
                                </FocusRegion>

                                <div className="grid md:grid-cols-3 gap-4 py-2">
                                    {(['slacktivism', 'fakeNews', 'polarization'] as const).map((key) => {
                                        const card = agoraContent.sections.consequenceCards[key];
                                        return (
                                            <div key={key} id={`${key}-card`} className={`bg-white border-t-4 ${key === 'slacktivism' ? 'border-red-500' : key === 'fakeNews' ? 'border-amber-500' : 'border-blue-500'} shadow-lg p-4 rounded-2xl hover:-translate-y-1 transition-all duration-300`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${key === 'slacktivism' ? 'bg-red-50' : key === 'fakeNews' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                                                    {key === 'slacktivism' && <Vote className="text-red-600 w-5 h-5" />}
                                                    {key === 'fakeNews' && <BrainCircuit className="text-amber-600 w-5 h-5" />}
                                                    {key === 'polarization' && <TrendingDown className="text-blue-600 w-5 h-5" />}
                                                </div>
                                                <h3 className="font-bold text-base mb-1 text-slate-800">{card.heading}</h3>
                                                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                                    <SafeHTML content={card.text} as="span" />
                                                    {key === 'fakeNews' && <SourceBadge ids={["11"]} />}
                                                    {key === 'slacktivism' && <SourceBadge ids={["8"]} />}
                                                    {key === 'polarization' && <SourceBadge ids={["10"]} />}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Agenda Setting Section (Replaces Regulation) */}
                                <FocusRegion
                                    id="consequences__agenda"
                                    label={agoraContent.sections.agenda.heading}
                                    className="bg-amber-50/50 rounded-[2rem] p-6 md:p-8 my-4 border border-amber-100 relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-amber-500 p-2 rounded-xl"><MessageCircle className="w-5 h-5 text-white" /></div>
                                            <h3 className="text-xl font-bold text-amber-900 tracking-tight">{agoraContent.sections.agenda.heading}</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-4">
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    <SafeHTML content={agoraContent.sections.agenda.text} />
                                                </p>
                                                <div className="bg-white/60 p-4 rounded-xl border border-amber-200/50">
                                                    <p className="text-sm text-amber-900 font-semibold italic">
                                                        {agoraContent.sections.agenda.quote} <SourceBadge ids={["9"]} />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                {/* Placeholder for visual or just clean layout */}
                                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 rotate-1">
                                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Live Trend</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                                                        <div className="h-2 bg-slate-100 rounded w-full"></div>
                                                        <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                </FocusRegion>


                                {/* Final Responsibility Question Section */}
                                <FocusRegion
                                    id="consequences__final"
                                    label={agoraContent.sections.finalQuestion.heading}
                                    className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2rem] p-6 md:p-10 my-6 border-2 border-slate-200 relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <h3 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 text-center">{agoraContent.sections.finalQuestion.heading}</h3>
                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                                                        <SafeHTML content={agoraContent.sections.finalQuestion.text} as="span" />
                                                    </p>
                                                    <ul className="space-y-3 text-base text-slate-600">
                                                        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                                                            <span className="text-2xl">🏢</span>
                                                            <span>{agoraContent.sections.finalQuestion.options[0]}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                                                            <span className="text-2xl">🏛️</span>
                                                            <span>{agoraContent.sections.finalQuestion.options[1]} <SourceBadge ids={["12"]} /></span>
                                                        </li>
                                                        <li className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                                                            <span className="text-2xl">🪞</span>
                                                            <span className="text-blue-700 font-bold">{agoraContent.sections.finalQuestion.options[2]}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 transition-transform hover:rotate-0 duration-500">
                                                <img
                                                    src="img/agora11.png"
                                                    alt="Die Entscheidung liegt bei dir"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                </FocusRegion>

                            </div>
                        )}
                    </div>

                    {/* Footer with Sources List */}
                    <div id="quellen" className="mt-8 border-t border-slate-200 pt-6">
                        <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {agoraContent.footer.sourcesHeading}
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
                                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                                        </div>
                                        <p className="text-slate-500 pl-5 text-[10px] leading-relaxed italic">{source.details}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </main>
            </div >

            {/* Audio Player Component */}
            < AudioPlayer
                audioSrc={config.audioSrc || ''}
                directorState={directorState}
                onStartQuiz={() => {
                    audioRef.current?.pause();
                    setActiveModal('master');
                }}
                onShowResults={() => window.location.hash = '#/report/results/agora'}
            />
        </div >
    );
}
