import { useEffect, useState } from 'react';
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
    Globe,
    ArrowRight,
    Flame,
    LayoutGrid
} from 'lucide-react';
import { useAudioDirector } from '@/hooks/useAudioDirector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { StatCard } from '@/components/StatCard';
import { InfoBox } from '@/components/InfoBox';
import { SourceBadge } from '@/components/SourceBadge';
import { OnboardingTour } from '@/components/OnboardingTour';
import { PageConfig, Source } from '@/types';

interface AgoraPageProps {
    config: PageConfig;
}

// Sources data
const sources: Source[] = [
    { id: "1", text: "Reuters Institute Digital News Report 2025 (Deutschland)", details: "Analyse der Nachrichtennutzung und Abhängigkeit von Social Media bei 18-24 Jährigen." },
    { id: "2", text: "Reuters Institute Digital News Report 2025 (Schweiz)", details: "Verschiebung von Print/TV zu Video-Plattformen." },
    { id: "4", text: "Reuters Institute Digital News Report 2025 (Plattformen)", details: "Wachstum von TikTok (+7%) als Nachrichtenquelle." },
    { id: "5", text: "Marktanalyse Online-Werbung Schweiz 2024", details: "Abfluss von 2.1 Mrd. CHF Werbegeldern zu globalen Tech-Plattformen." },
    { id: "8", text: "fög Jahrbuch Qualität der Medien 2024/2025", details: "News-Deprivation auf Rekordhoch von 46%." },
    { id: "9", text: "fög Studie zu Bildungskluft", details: "Zusammenhang zwischen formaler Bildung und News-Deprivation." },
    { id: "16", text: "Analyse 'Crowding Out' Effekt", details: "Widerlegung der These, dass SRG private Medien verdrängt." },
    { id: "19", text: "Forschung zu politischer Partizipation", details: "'Slacktivism' und das Paradox der Social-Media-Teilnahme." },
    { id: "21", text: "Studie zu COVID-19 Referenden", details: "Agenda-Setting-Machtverschiebung von Redaktionen zu 'Attentive Public'." },
    { id: "27", text: "Polarisierungs-Forschung 2025", details: "Anstieg der 'affektiven Polarisierung' in der Schweiz auf US-Niveau." },
    { id: "31", text: "OECD Studie zu Desinformation", details: "Niedrige Erkennungsrate von Fake News in der Schweiz (55%)." },
    { id: "36", text: "BAKOM Bericht zum KomPG", details: "Unterschiede zwischen Schweizer Regulierung und EU-DSA." }
];

export function AgoraPage({ config }: AgoraPageProps) {
    const directorState = useAudioDirector(config.timeline);
    const { currentTab, audioState } = directorState;
    const [manualTab, setManualTab] = useState<'theory' | 'data' | 'consequences'>('theory');

    // Use audio director's tab when playing, manual tab when paused
    const activeTab = audioState.isPlaying ? currentTab : manualTab;

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

            {/* Unified Beginning Section (Header, Tabs, Intro) */}
            <div>
                {/* Header */}
                <header id="beginning-highlight" className="scroll-mt-24 bg-slate-900 text-white pt-10 pb-16 px-4 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Globe size={300} />
                    </div>
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="inline-flex items-center space-x-2 bg-slate-800 rounded-full px-4 py-1 mb-6 border border-slate-700">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-semibold tracking-wider text-slate-300">INTERAKTIVER REPORT 2026</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Vom Dorfplatz zum<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Digitalen Feed
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                            Wie sich unsere Demokratie verändert, wenn wir nicht mehr dieselben Nachrichten sehen. Eine Analyse der Situation in Deutschland und der Schweiz.
                        </p>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 pb-20">

                    {/* Navigation Tabs */}
                    <div id="main-tabs" className="bg-white rounded-t-2xl shadow-sm border-b border-slate-200 flex flex-col md:flex-row overflow-hidden">
                        <button
                            onClick={() => setManualTab('theory')}
                            id="tab-btn-theory"
                            className={`flex-1 py-4 px-6 text-left flex items-center transition-all ${activeTab === 'theory' ? 'bg-white border-b-4 border-blue-500 text-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2.5 rounded-full mr-4 ${activeTab === 'theory' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">1. Theorie</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Verstehen</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setManualTab('data')}
                            id="tab-btn-data"
                            className={`flex-1 py-4 px-6 text-left flex items-center transition-all ${activeTab === 'data' ? 'bg-white border-b-4 border-purple-500 text-purple-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2.5 rounded-full mr-4 ${activeTab === 'data' ? 'bg-purple-100' : 'bg-slate-200'}`}>
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">2. Datenlage</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Erkennen</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setManualTab('consequences')}
                            id="tab-btn-consequences"
                            className={`flex-1 py-4 px-6 text-left flex items-center transition-all ${activeTab === 'consequences' ? 'bg-white border-b-4 border-amber-500 text-amber-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2.5 rounded-full mr-4 ${activeTab === 'consequences' ? 'bg-amber-100' : 'bg-slate-200'}`}>
                                <Scale size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">3. Folgen</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Handeln</div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content Container */}
                    <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-10 border-t border-slate-100">

                        {/* TAB 1: THEORIE */}
                        {activeTab === 'theory' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                {/* Intro Text Section */}
                                <div id="theory-intro" className="scroll-mt-32 flex flex-col lg:flex-row gap-8 items-center py-6 border-b border-slate-50 pb-12">
                                    <div className="flex-1">
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">Wie wir miteinander reden</h2>
                                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                                            Früher bestimmten Zeitungsredaktionen, was wichtig war. Heute entscheidet oft ein Algorithmus auf deinem Handy. Das verändert nicht nur, wie wir Nachrichten lesen, sondern wie unsere Demokratie funktioniert.
                                        </p>
                                    </div>
                                    <div className="w-full lg:w-2/5 group">
                                        <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200 transition-transform duration-500 hover:scale-[1.02]">
                                            <img
                                                src="img/agora1.png"
                                                alt="Digitale Informationslandschaft"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Agora Box Section */}
                                <div id="agora-explanation" className="scroll-mt-32 py-12 bg-gradient-to-br from-indigo-50/30 to-white rounded-3xl border border-indigo-100/50 p-6 md:p-10 relative overflow-hidden">
                                    <div className="relative z-10 w-full">
                                        <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center">
                                            <LayoutGrid className="w-5 h-5 mr-3 text-indigo-600" />
                                            Was bedeutet "Agora"?
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-10 items-center">
                                            <div className="space-y-4">
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Das Wort kommt aus dem alten Griechenland. Die <strong>Agora</strong> war der zentrale <strong>Marktplatz</strong> einer Stadt.
                                                </p>
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Es war der Ort, an dem sich die "Öffentlichkeit" bildete – wo Bürger/innen diskutierten und Politik machten.
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
                                            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 text-sm shadow-xl space-y-4">
                                                <strong className="block text-lg text-indigo-700 mb-3 border-b border-indigo-50 pb-2">Vergleich für heute:</strong>
                                                <div className="flex items-start gap-4 text-slate-600">
                                                    <div className="bg-indigo-50 p-2 rounded-lg text-xl">🏛️</div>
                                                    <p><strong className="text-slate-900">Früher:</strong> Wie eine grosse Schulversammlung. Alle hören dasselbe.</p>
                                                </div>
                                                <div className="flex items-start gap-4 text-slate-600">
                                                    <div className="bg-indigo-50 p-2 rounded-lg text-xl">📱</div>
                                                    <p><strong className="text-slate-900">Heute:</strong> Tausende kleine WhatsApp-Gruppenchats gleichzeitig. Jeder sieht nur seinen Teil.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                                </div>

                                {/* Gatekeeper Section */}
                                <div id="gatekeeper-infobox" className="scroll-mt-32 py-12">
                                    <div className="flex flex-col md:flex-row gap-10 items-center w-full">
                                        <div className="flex-1">
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 md:p-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-emerald-500 p-1.5 rounded-lg"><Lock className="w-5 h-5 text-white" /></div>
                                                    <h3 className="text-xl font-bold text-emerald-900">Was bedeutet 'Gatekeeper'?</h3>
                                                </div>
                                                <p className="text-base text-emerald-900/80 leading-relaxed">
                                                    Gatekeeper heißt <strong>"Torwächter"</strong>. Früher entschieden Chefredaktionen, was wichtig genug ist. Heute sortieren Algorithmen oder gar niemand mehr – jeder kann alles posten, wahr oder falsch.
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
                                </div>

                                {/* Algorithm as Hype-Man Section */}
                                <div id="algorithm-hypeman" className="scroll-mt-32 py-12 bg-gradient-to-br from-blue-50/30 to-white rounded-3xl border border-blue-100/50 p-6 md:p-10 relative overflow-hidden">
                                    <div className="relative z-10 w-full">
                                        <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
                                            <BrainCircuit className="w-5 h-5 mr-3 text-blue-600" />
                                            Der Algorithmus als dein persönlicher "Ja-Sager"
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-10 items-center">
                                            <div className="space-y-4">
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Ein Algorithmus will dich nicht herausfordern – er will dich <strong>bestätigen</strong>.
                                                </p>
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Man könnte sagen, er ist dein persönlicher <strong>Hype-Man</strong>. Wie ein Ja-Sager, der dir nur das zeigt, was du hören willst.
                                                </p>
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Warum? Weil <strong>Wut oder Freude</strong> dich viel länger auf der Plattform halten als eine neutrale, vielleicht etwas trockene Tatsache.
                                                </p>
                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                                                    <p className="text-sm text-blue-900 font-semibold">Es geht um Verweildauer, nicht um Wahrheit.</p>
                                                </div>
                                            </div>
                                            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-lg border border-indigo-100 transition-transform duration-500 hover:scale-[1.02]">
                                                <img
                                                    src="img/agora5.png"
                                                    alt="Der Algorithmus als Hype-Man"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
                                </div>

                                {/* Attention Economy Section */}
                                <div id="attention-economy" className="scroll-mt-32 py-12">
                                    <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 md:p-10">
                                        <div className="flex flex-col md:flex-row gap-10 items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-amber-500 p-1.5 rounded-lg"><BrainCircuit className="w-5 h-5 text-white" /></div>
                                                    <h3 className="text-xl font-bold text-amber-900">Die Aufmerksamkeits-Ökonomie</h3>
                                                </div>
                                                <p className="text-base text-amber-900/80 leading-relaxed mb-4">
                                                    Das Ziel eines Algorithmus ist <strong>nicht</strong>, dich umfassend und neutral zu informieren.
                                                </p>
                                                <p className="text-base text-amber-900/80 leading-relaxed">
                                                    Sein Ziel ist <strong>deine Aufmerksamkeit</strong>. Er will einfach, dass du so lange wie möglich in der App bleibst.
                                                </p>
                                            </div>
                                            <div className="w-full md:w-1/3">
                                                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-amber-100 transition-transform duration-500 hover:rotate-2">
                                                    <img
                                                        src="img/agora6.png"
                                                        alt="Aufmerksamkeits-Ökonomie Waage"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Grid */}
                                <div id="comparison-section" className="scroll-mt-24 pt-4">
                                    <h3 className="text-lg font-bold mb-6 text-center text-slate-700">Der Wandel: Ein Vergleich</h3>
                                    <div className="grid md:grid-cols-2 gap-6 relative">
                                        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-1.5 rounded-full shadow border border-slate-200">
                                            <ArrowRight className="text-slate-400 w-5 h-5" />
                                        </div>

                                        {/* FRÜHER */}
                                        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center justify-center w-10 h-10 bg-slate-200 rounded-full mb-3 mx-auto">
                                                <Flame className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <h4 className="text-center font-bold text-slate-700 mb-1">Das "Lagerfeuer"</h4>
                                            <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest mb-4">Massenmedien</p>
                                            <ul className="space-y-3 text-sm text-slate-600">
                                                <li className="flex gap-2.5 items-start">
                                                    <Users className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                    <span>Alle sehen das Gleiche (z.B. Tagesschau um 20:00 Uhr).</span>
                                                </li>
                                                <li className="flex gap-2.5 items-start">
                                                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                    <span>Journalisten filtern Fakten und sortieren Gerüchte aus.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* HEUTE */}
                                        <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-full mb-3 mx-auto">
                                                <Smartphone className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h4 className="text-center font-bold text-blue-900 mb-1">Der "Eigene Tunnel"</h4>
                                            <p className="text-center text-[10px] text-blue-400 uppercase font-black tracking-widest mb-4">Plattformen</p>
                                            <ul className="space-y-3 text-sm text-slate-700">
                                                <li className="flex gap-2.5 items-start">
                                                    <Users className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                    <span>Jeder sieht etwas anderes. Es fehlt die gemeinsame Basis.</span>
                                                </li>
                                                <li className="flex gap-2.5 items-start">
                                                    <BrainCircuit className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                    <span>Algorithmen entscheiden, was dich am Bildschirm hält.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DATEN */}
                        {activeTab === 'data' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col lg:flex-row gap-10 items-center py-6">
                                    <div id="data-intro" className="scroll-mt-32 flex-1">
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">Die Zahlen: Eine gespaltene Gesellschaft</h2>
                                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                                            Die Daten aus 2024 und 2025 zeigen ein klares Bild: Wir driften beim Medienkonsum massiv auseinander.
                                        </p>
                                    </div>
                                    <div id="data-intro-image" className="w-full lg:w-2/5 group">
                                        <div className="aspect-video bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 transition-all duration-500 hover:shadow-purple-200/50">
                                            <img
                                                src="img/agora4.png"
                                                alt="Digitale Nachrichtennutzung Visual"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div id="stat-cards" className="scroll-mt-32 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard value="46%" label="News Deprivierte" subtext="Kaum noch Nachrichten-Fokus." color="red" sourceIds={["8"]} />
                                    <StatCard value="17%" label="Nur Social" subtext="Kein Journalismus (18-24 J.)." color="purple" sourceIds={["1"]} />
                                    <StatCard value="+7%" label="TikTok Boom" subtext="Wachstum als Newsquelle." color="blue" sourceIds={["4"]} />
                                    <StatCard value="2.1 Mrd." label="Werbegeld" subtext="Abfluss zu Tech-Giganten." color="amber" sourceIds={["5"]} />
                                </div>

                                <div id="chart-section" className="scroll-mt-32 bg-slate-50/50 rounded-3xl p-6 md:p-12 border border-slate-100 my-8">
                                    <h3 className="font-bold text-2xl mb-10 text-center text-slate-800 tracking-tight">Wer schaut noch Nachrichten?</h3>
                                    <div className="max-w-3xl mx-auto w-full space-y-8 pb-4">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="flex justify-between mb-3 text-sm font-bold text-slate-700">
                                                <span>Klassisches TV (Gesamt DE)</span>
                                                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">43%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                <div className="bg-slate-400 h-full rounded-full" style={{ width: '43%' }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-purple-100">
                                            <div className="flex justify-between mb-3 text-sm font-bold text-purple-900">
                                                <span>Social Media (18-24 Jahre)</span>
                                                <span className="bg-purple-100 px-2.5 py-0.5 rounded-full">50%</span>
                                            </div>
                                            <div className="w-full bg-purple-50 rounded-full h-3 overflow-hidden">
                                                <div className="bg-purple-600 h-full rounded-full" style={{ width: '50%' }}></div>
                                            </div>
                                            <div className="mt-3 flex justify-end shrink-0 scale-90 origin-right"><SourceBadge ids={["1", "4"]} /></div>
                                        </div>
                                    </div>
                                    <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                            <h4 className="font-bold text-base mb-2 text-slate-800">Die "TikTokisierung"</h4>
                                            <p className="text-xs text-slate-600 leading-relaxed">Komplexe Politik wird oft auf 15 Sekunden Spaß reduziert. Hintergründe fehlen meist.</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                            <h4 className="font-bold text-base mb-2 text-slate-800">Bildungskluft</h4>
                                            <p className="text-xs text-slate-600 leading-relaxed">Menschen mit niedriger formaler Bildung gehören öfter zu den News-Deprivierten.</p>
                                            <div className="mt-2 scale-90 origin-left"><SourceBadge ids={["9"]} /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 15-Second Video Problem Section */}
                                <div id="tiktok-problem" className="scroll-mt-32 bg-purple-50/30 rounded-3xl p-6 md:p-12 border border-purple-100 my-8">
                                    <h3 className="font-bold text-2xl mb-8 text-center text-purple-900 tracking-tight">Das 15-Sekunden-Problem</h3>
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className="space-y-4">
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Kannst du eine <strong>Rentenreform</strong> wirklich in einem 15-Sekunden-Video verstehen?
                                            </p>
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Du kriegst die <strong>Emotion</strong>, den schnellen <strong>Slogan</strong>, aber die Details, die du für die Stimmabgabe brauchst, fallen weg.
                                            </p>
                                            <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-r-xl">
                                                <p className="text-sm text-purple-900 font-semibold">Komplexe Politik wird auf Unterhaltung reduziert. Hintergründe fehlen meist.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
                                                <img
                                                    src="img/agora7.png"
                                                    alt="Komplexität vs. 15 Sekunden"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
                                                <img
                                                    src="img/agora8.png"
                                                    alt="Information Loss Funnel"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Money Flow Section */}
                                <div id="money-flow" className="scroll-mt-32 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 md:p-10 border border-red-100 my-8">
                                    <h3 className="font-bold text-2xl mb-6 text-center text-red-900 tracking-tight">Der Teufelskreis</h3>
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1 space-y-4">
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Jedes Jahr fließen <strong>2,1 Milliarden Franken</strong> an Werbegeldern an globale Plattformen.
                                            </p>
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Geld, das den Schweizer Medienhäusern fehlt, um Journalismus zu finanzieren, der komplexe Vorlagen verständlich macht.
                                            </p>
                                            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-xl">
                                                <p className="text-sm text-red-900 font-semibold">Weniger Geld → Weniger Qualitätsjournalismus → Mehr Abhängigkeit von Plattformen</p>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-2/5">
                                            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-red-100 hover:rotate-1 transition-transform">
                                                <img
                                                    src="img/agora9.png"
                                                    alt="Der Teufelskreis der Finanzierung"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: FOLGEN */}
                        {activeTab === 'consequences' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div id="consequences-intro" className="scroll-mt-32 py-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">Was passiert mit der Demokratie?</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                                        In einer direkten Demokratie müssen wir informiert sein, um über komplexe Gesetze abstimmen zu können.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 py-4">
                                    <div id="slacktivism-card" className="bg-white border-t-4 border-red-500 shadow-lg p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4"><Vote className="text-red-600 w-6 h-6" /></div>
                                        <h3 className="font-bold text-lg mb-2 text-slate-800">Slacktivism</h3>
                                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">Liken statt wählen: Politische Posts fühlen sich wie Aktivität an, führen aber selten zur Urne. <SourceBadge ids={["19"]} /></p>
                                    </div>
                                    <div id="fake-news-card" className="bg-white border-t-4 border-amber-500 shadow-lg p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4"><BrainCircuit className="text-amber-600 w-6 h-6" /></div>
                                        <h3 className="font-bold text-lg mb-2 text-slate-800">Anfällig für Fakes</h3>
                                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">Nur 55% der Schweizer erkennen Fakes zuverlässig. Bei Abstimmungen ist das ein hohes Risiko. <SourceBadge ids={["31"]} /></p>
                                        <div className="mt-4 aspect-video bg-amber-50 rounded-xl overflow-hidden border border-amber-100 relative group">
                                            <img
                                                src="img/agora10.png"
                                                alt="Fake News Test"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                    <div id="polarization-card" className="bg-white border-t-4 border-blue-500 shadow-lg p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4"><TrendingDown className="text-blue-600 w-6 h-6" /></div>
                                        <h3 className="font-bold text-lg mb-2 text-slate-800">Affektive Polarisierung</h3>
                                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">Wut klickt besser. Der politische Gegner wird oft nicht mehr als falsch, sondern als böse gesehen. <SourceBadge ids={["27"]} /></p>
                                    </div>
                                </div>

                                <div className="max-w-4xl mx-auto py-6">
                                    <InfoBox title="Beispiel: Covid-Abstimmungen" icon={<MessageCircle className="w-4 h-4 mr-2" />} color="amber">
                                        <p className="text-sm mb-3">Agenda-Setting Machtverschiebung: Themen wurden oft auf Telegram groß gemacht, die Politik musste reagieren. <SourceBadge ids={["21"]} /></p>
                                    </InfoBox>
                                </div>

                                {/* Regulation Section */}
                                <div id="regulation-section" className="scroll-mt-32 bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 my-6 shadow-2xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-start mb-8">
                                            <div className="bg-green-500/20 p-3 rounded-2xl mr-4"><Scale className="w-8 h-8 text-green-400" /></div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-1 tracking-tight">Was macht der Staat?</h3>
                                                <p className="text-slate-400 text-base max-w-xl">Die EU nutzt den DSA, die Schweiz plant das KomPG Gesetz.</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-700">
                                                <div className="flex items-center gap-2.5 mb-4">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                    <strong className="text-blue-400 font-bold uppercase tracking-wider text-xs">EU (DSA)</strong>
                                                </div>
                                                <ul className="space-y-3 text-slate-300 text-xs">
                                                    <li className="flex gap-2"><span>•</span><span>Plattformen müssen gesellschaftliche Risiken minimieren.</span></li>
                                                    <li className="flex gap-2"><span>•</span><span>Haftung für illegale Inhalte (Hate Speech).</span></li>
                                                </ul>
                                            </div>
                                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl border border-green-500/30">
                                                <div className="flex items-center gap-2.5 mb-4">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                    <strong className="text-green-400 font-bold uppercase tracking-wider text-xs">Schweiz (KomPG)</strong>
                                                </div>
                                                <ul className="space-y-3 text-slate-300 text-xs">
                                                    <li className="flex gap-2"><span>•</span><span>Fokus auf Transparenz (Warum sehe ich das?).</span></li>
                                                    <li className="flex gap-2 text-slate-400 italic"><span>•</span><span>Keine Lösch-Pflichten aus Angst vor Zensur.</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                                </div>

                                {/* Final Responsibility Question Section */}
                                <div id="final-question" className="scroll-mt-32 bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2rem] p-8 md:p-12 my-8 border-2 border-slate-200 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 text-center">Die entscheidende Frage</h3>
                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-6">
                                                <p className="text-lg text-slate-700 leading-relaxed">
                                                    Die alten Gatekeeper – die Chefredakteure – sind weg. Der <strong>Algorithmus</strong> ist der neue Torwächter.
                                                </p>
                                                <p className="text-lg text-slate-700 leading-relaxed">
                                                    Wenn sein oberstes Ziel ist, dich in der App zu halten und <em>nicht</em> dich zu informieren...
                                                </p>
                                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                                                    <p className="text-base font-bold text-blue-900 mb-4">Wer trägt dann die Verantwortung dafür, dass du ein informierter Bürger bist?</p>
                                                    <ul className="space-y-3 text-sm text-slate-600">
                                                        <li className="flex items-center gap-3">
                                                            <span className="text-2xl">🏢</span>
                                                            <span><strong>Die Plattformen?</strong></span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <span className="text-2xl">🏛️</span>
                                                            <span><strong>Der Staat?</strong></span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <span className="text-2xl">🪞</span>
                                                            <span className="text-blue-700 font-bold">Oder liegt diese Verantwortung jetzt vielleicht zum ersten Mal in der Geschichte ganz allein bei dir?</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 transition-transform hover:rotate-0 duration-500">
                                                <img
                                                    src="img/agora11.png"
                                                    alt="Die Entscheidung liegt bei dir"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with Sources List */}
                    <div id="quellen" className="mt-12 border-t border-slate-200 pt-8">
                        <h3 className="text-base font-bold text-slate-600 mb-6 flex items-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Wissenschaftliche Quellen
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sources.map((source) => (
                                <div key={source.id} className="text-[10px] bg-white p-2.5 rounded-xl shadow-sm border border-slate-100/50 hover:border-slate-200 transition-colors">
                                    <div className="flex items-baseline mb-1">
                                        <span className="font-black text-blue-600 mr-1.5 opacity-70">[{source.id}]</span>
                                        <span className="font-bold text-slate-800 leading-[1.1]">{source.text}</span>
                                    </div>
                                    <p className="text-slate-500 pl-5 text-[10px] leading-relaxed italic">{source.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Audio Player Component */}
            <AudioPlayer
                audioSrc={config.audioSrc || ''}
                directorState={directorState}
            />

            {/* Onboarding Tour for first-time users */}
            <OnboardingTour />
        </div>
    );
}
