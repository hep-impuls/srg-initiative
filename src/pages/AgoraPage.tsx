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
import { SourceBadge } from '@/components/SourceBadge';
import { OnboardingTour } from '@/components/OnboardingTour';
import { PageConfig, Source } from '@/types';
import { swissifyData } from '@/utils/textUtils';

interface AgoraPageProps {
    config: PageConfig;
}

// Sources data
const sources: Source[] = swissifyData([
    {
        id: "1",
        text: "Reuters Institute Digital News Report 2025 (Deutschland)",
        details: "Analyse der Nachrichtennutzung und Abhängigkeit von Social Media bei 18-24 Jährigen.",
        url: "https://leibniz-hbi.de/en/hbi-news/pressinfo/german-findings-of-the-reuters-institute-digital-news-report-2025/"
    },
    {
        id: "2",
        text: "Reuters Institute Digital News Report 2025 (Schweiz)",
        details: "Verschiebung von Print/TV zu Video-Plattformen.",
        url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025"
    },
    {
        id: "3",
        text: "Reuters Institute Digital News Report 2025 (Plattformen)",
        details: "Wachstum von TikTok (+7%) als Nachrichtenquelle.",
        url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025/switzerland"
    },
    {
        id: "4",
        text: "Marktanalyse Online-Werbung Schweiz 2024",
        details: "Abfluss von 2.1 Mrd. CHF Werbegeldern zu globalen Tech-Plattformen.",
        url: "https://www.foeg.uzh.ch/dam/jcr:adbffe22-c427-4c9a-8e3f-390ef071eb9a/JB_2025_I_Main_Findings_20251030_final%20korr.pdf"
    },
    {
        id: "5",
        text: "fög Jahrbuch Qualität der Medien 2024/2025",
        details: "News-Deprivation auf Rekordhoch von 46%.",
        url: "https://www.foeg.uzh.ch/dam/jcr:eaddc4bc-a0fd-4323-8c4a-2376ceeac959/Pr%C3%A4sentation_2024_final_DE.pdf"
    },
    {
        id: "6",
        text: "fög Studie zu Bildungskluft",
        details: "Zusammenhang zwischen formaler Bildung und News-Deprivation.",
        url: "https://www.news.uzh.ch/en/articles/media/2025/yearbook-quality-of-the-media-foeg.html"
    },
    {
        id: "7",
        text: "Analyse 'Crowding Out' Effekt",
        details: "Widerlegung der These, dass SRG private Medien verdrängt.",
        url: "https://www.foeg.uzh.ch/dam/jcr:85ef7b15-95f8-4815-bde8-179b0d0e1089/JB_2024_Study_I_private_Media_EN.pdf"
    },
    {
        id: "8",
        text: "Forschung zu politischer Partizipation",
        details: "'Slacktivism' und das Paradox der Social-Media-Teilnahme.",
        url: "https://www.mdpi.com/2673-5172/6/3/155"
    },
    {
        id: "9",
        text: "Studie zu COVID-19 Referenden",
        details: "Agenda-Setting-Machtverschiebung von Redaktionen zu 'Attentive Public'.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8242806/"
    },
    {
        id: "10",
        text: "Polarisierungs-Forschung 2025",
        details: "Anstieg der 'affektiven Polarisierung' in der Schweiz auf US-Niveau.",
        url: "https://www.news.uzh.ch/en/articles/news/2024/political-polarization.html"
    },
    {
        id: "11",
        text: "OECD Studie zu Desinformation",
        details: "Niedrige Erkennungsrate von Fake News in der Schweiz (55%).",
        url: "https://www.swissinfo.ch/eng/information-wars/swiss-found-to-be-gullible-regarding-fake-news/87475624"
    },
    {
        id: "12",
        text: "BAKOM Bericht zum KomPG",
        details: "Unterschiede zwischen Schweizer Regulierung und EU-DSA.",
        url: "https://www.bakom.admin.ch/dam/de/sd-web/-XQxe6i9YyQN/Erl%C3%A4uternder%20Bericht%20(VE-KomPG).pdf"
    }
]);

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
                <header id="beginning-highlight" className="scroll-mt-24 bg-slate-900 text-white pt-6 pb-8 px-4 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Globe size={200} />
                    </div>
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="inline-flex items-center space-x-2 bg-slate-800 rounded-full px-4 py-1 mb-6 border border-slate-700">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-semibold tracking-wider text-slate-300">INTERAKTIVER REPORT 2026</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
                            Vom Dorfplatz zum<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Digitalen Feed
                            </span>
                        </h1>
                        <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
                            Wie sich unsere Demokratie verändert, wenn wir nicht mehr dieselben Nachrichten sehen. Eine Analyse der Situation in Deutschland und der Schweiz.
                        </p>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-5xl mx-auto px-4 -mt-6 relative z-20 pb-16">

                    {/* Navigation Tabs */}
                    <div id="main-tabs" className="bg-white rounded-t-2xl shadow-sm border-b border-slate-200 flex flex-col md:flex-row overflow-hidden">
                        <button
                            onClick={() => setManualTab('theory')}
                            id="tab-btn-theory"
                            className={`flex-1 py-3 px-4 text-left flex items-center transition-all ${activeTab === 'theory' ? 'bg-white border-b-4 border-blue-500 text-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-2 rounded-full mr-3 ${activeTab === 'theory' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-slate-900">1. Theorie</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Verstehen</div>
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
                                <div className="font-bold text-base text-slate-900">2. Datenlage</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Erkennen</div>
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
                                <div className="font-bold text-base text-slate-900">3. Folgen</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Handeln</div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content Container */}
                    <div className="bg-white rounded-b-2xl shadow-xl p-4 md:p-6 border-t border-slate-100">

                        {/* TAB 1: THEORIE */}
                        {activeTab === 'theory' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                {/* Intro Text Section */}
                                <div id="theory-intro" className="scroll-mt-24 flex flex-col lg:flex-row gap-6 items-center py-4 border-b border-slate-50 pb-8">
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">Wie wir miteinander reden</h2>
                                        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                            <strong>Früher bestimmten Zeitungsredaktionen</strong>, was wichtig war. <strong>Heute entscheidet oft ein Algorithmus</strong> auf deinem Handy. Das verändert nicht nur, wie wir Nachrichten lesen, sondern wie unsere Demokratie funktioniert. <SourceBadge ids={["1", "2"]} />
                                        </p>
                                    </div>
                                    <div className="w-full lg:w-2/5 group">
                                        <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200 transition-transform duration-500 hover:scale-[1.02]">
                                            <img
                                                src="img/agora1.png"
                                                alt="Digitale Informationslands landscapes"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Grid - MOVED TO TOP */}
                                <div id="comparison-section" className="scroll-mt-24 py-6 border-b border-slate-50">
                                    <h3 className="text-lg font-bold mb-4 text-center text-slate-700">Der Wandel: Ein Vergleich</h3>
                                    <div className="grid md:grid-cols-2 gap-4 relative">
                                        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-1.5 rounded-full shadow border border-slate-200">
                                            <ArrowRight className="text-slate-400 w-5 h-5" />
                                        </div>

                                        {/* FRÜHER */}
                                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full mb-2 mx-auto">
                                                <Flame className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <h4 className="text-center font-bold text-slate-700 mb-1">Das "Lagerfeuer"</h4>
                                            <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Massenmedien</p>
                                            <ul className="space-y-3 text-sm text-slate-600">
                                                <li className="flex gap-2.5 items-start">
                                                    <Users className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                    <span><strong>Alle sehen das Gleiche</strong> (z.B. Tagesschau um 20:00 Uhr).</span>
                                                </li>
                                                <li className="flex gap-2.5 items-start">
                                                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                    <span>Journalisten filtern Fakten und sortieren Gerüchte aus.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* HEUTE */}
                                        <div className="bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full mb-2 mx-auto">
                                                <Smartphone className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h4 className="text-center font-bold text-blue-900 mb-1">Der "Eigene Tunnel"</h4>
                                            <p className="text-center text-[10px] text-blue-400 uppercase font-black tracking-widest mb-3">Plattformen</p>
                                            <ul className="space-y-3 text-sm text-slate-700">
                                                <li className="flex gap-2.5 items-start">
                                                    <Users className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                    <span><strong>Jeder sieht etwas anderes.</strong> Es fehlt die gemeinsame Basis. <SourceBadge ids={["1", "2"]} /></span>
                                                </li>
                                                <li className="flex gap-2.5 items-start">
                                                    <BrainCircuit className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                    <span>Algorithmen entscheiden, was dich am Bildschirm hält.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Agora Box Section */}
                                <div id="agora-explanation" className="scroll-mt-24 py-8 bg-gradient-to-br from-indigo-50/30 to-white rounded-3xl border border-indigo-100/50 p-4 md:p-8 relative overflow-hidden">
                                    <div className="relative z-10 w-full">
                                        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                            <LayoutGrid className="w-5 h-5 mr-3 text-indigo-600" />
                                            Was bedeutet "Agora"?
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6 items-center">
                                            <div className="space-y-4">
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Das Wort kommt aus dem alten Griechenland. Die <strong>Agora</strong> war der zentrale <strong>Marktplatz</strong> einer Stadt.
                                                </p>
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    Es war der Ort, an dem sich die <strong>"Öffentlichkeit"</strong> bildete – wo Bürger/innen diskutierten und Politik machten.
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
                                                    <p><strong className="text-slate-900">Früher:</strong> Wie eine grosse Schulversammlung. <strong>Alle hören dasselbe.</strong></p>
                                                </div>
                                                <div className="flex items-start gap-4 text-slate-600">
                                                    <div className="bg-indigo-50 p-2 rounded-lg text-xl">📱</div>
                                                    <p><strong className="text-slate-900">Heute:</strong> Tausende kleine WhatsApp-Gruppenchats gleichzeitig. <strong>Jeder sieht nur seinen Teil.</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                                </div>

                                {/* Gatekeeper Section */}
                                <div id="gatekeeper-infobox" className="scroll-mt-24 py-8">
                                    <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                                        <div className="flex-1">
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 md:p-8">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-emerald-500 p-1.5 rounded-lg"><Lock className="w-4 h-4 text-white" /></div>
                                                    <h3 className="text-lg font-bold text-emerald-900">Was bedeutet 'Gatekeeper'?</h3>
                                                </div>
                                                <p className="text-base text-emerald-900/80 leading-relaxed">
                                                    Gatekeeper heisst <strong>"Torwächter"</strong>. Früher entschieden Chefredaktionen, was wichtig genug ist. Heute sortieren Algorithmen oder gar niemand mehr – <strong>jeder kann alles posten</strong>, wahr oder falsch.
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

                                {/* Unified Algorithm & Attention Section */}
                                <div className="scroll-mt-24 py-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            {/* Left: Hype Man */}
                                            <div id="algorithm-hypeman" className="p-6 md:p-8 scroll-mt-24">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <BrainCircuit className="w-5 h-5 text-blue-600" />
                                                    <h3 className="font-bold text-blue-900">Der Ja-Sager</h3>
                                                </div>
                                                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                                                    Der Algorithmus will dich nicht informieren, sondern <strong>bestätigen</strong>. <strong>Wut und Freude binden dich stärker</strong> als neutrale Fakten.
                                                </p>
                                                <div className="aspect-video bg-white rounded-xl overflow-hidden shadow-sm border border-blue-100/50">
                                                    <img src="img/agora5.png" alt="Algorithm Hype-Man" className="w-full h-full object-cover" />
                                                </div>
                                            </div>

                                            {/* Right: Attention */}
                                            <div id="attention-economy" className="p-6 md:p-8 scroll-mt-24 bg-white/50">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="bg-amber-100 p-1 rounded"><BrainCircuit className="w-4 h-4 text-amber-600" /></div>
                                                    <h3 className="font-bold text-amber-900">Die Währung</h3>
                                                </div>
                                                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                                                    Das Ziel ist deine <strong>Aufmerksamkeit</strong> (Verweildauer). <strong>Je länger du bleibst, desto mehr Werbung</strong> kannst du sehen.
                                                </p>
                                                <div className="aspect-video bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100/50">
                                                    <img src="img/agora6.png" alt="Attention Economy" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DATEN */}
                        {activeTab === 'data' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div id="data-overview-container" className="scroll-mt-24 p-2 -m-2 rounded-3xl">
                                    <div className="flex flex-col lg:flex-row gap-6 items-center py-4">
                                        <div id="data-intro" className="scroll-mt-24 flex-1">
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">Die Zahlen: Eine gespaltene Gesellschaft</h2>
                                            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                                Die Daten aus 2024 und 2025 zeigen ein klares Bild: <strong>Wir driften beim Medienkonsum massiv auseinander.</strong>
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
                                            <h3 className="font-bold text-lg mb-6 text-center text-slate-800 tracking-tight">Wer schaut noch Nachrichten?</h3>
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
                                                    <h4 className="font-bold text-sm mb-1 text-slate-800">Die "TikTokisierung"</h4>
                                                    <p className="text-[10px] text-slate-600 leading-relaxed"><strong>Komplexe Politik wird oft auf 15 Sekunden Spass reduziert.</strong> Hintergründe fehlen meist.</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <h4 className="font-bold text-sm mb-1 text-slate-800">Bildungskluft</h4>
                                                    <p className="text-[10px] text-slate-600 leading-relaxed">Menschen mit niedriger formaler Bildung gehören öfter zu den News-Deprivierten.</p>
                                                    <div className="mt-1 scale-90 origin-left"><SourceBadge ids={["6"]} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 15-Second Video Problem Section */}
                                <div id="tiktok-problem" className="scroll-mt-24 bg-purple-50/30 rounded-3xl p-4 md:p-8 border border-purple-100 my-4">
                                    <h3 className="font-bold text-xl mb-6 text-center text-purple-900 tracking-tight">Das 15-Sekunden-Problem</h3>
                                    <div className="grid md:grid-cols-2 gap-6 items-center">
                                        <div className="space-y-4">
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Kannst du eine <strong>Rentenreform</strong> wirklich in einem 15-Sekunden-Video verstehen?
                                            </p>
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Du kriegst die <strong>Emotion</strong>, den schnellen <strong>Slogan</strong>, aber die <strong>Details</strong>, die du für die Stimmabgabe brauchst, fallen weg.
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
                                <div id="money-flow" className="scroll-mt-24 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-4 md:p-8 border border-red-100 my-4">
                                    <h3 className="font-bold text-xl mb-4 text-center text-red-900 tracking-tight">Der Teufelskreis</h3>
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-1 space-y-4">
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                Jedes Jahr fliessen <strong>2,1 Milliarden Franken</strong> an Werbegeldern an globale Plattformen.
                                            </p>
                                            <p className="text-base text-slate-700 leading-relaxed">
                                                <strong>Geld, das den Schweizer Medienhäusern fehlt</strong>, um Journalismus zu finanzieren, der komplexe Vorlagen verständlich macht.
                                            </p>
                                            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-xl">
                                                <p className="text-sm text-red-900 font-semibold">Weniger Geld → Weniger Qualitätsjournalismus → Mehr Abhängigkeit von Plattformen <SourceBadge ids={["7"]} /></p>
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
                                </div>
                            </div>
                        )}

                        {/* TAB 3: FOLGEN */}
                        {activeTab === 'consequences' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div id="consequences-intro" className="scroll-mt-24 py-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">Was passiert mit der Demokratie?</h2>
                                    <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                        In einer direkten Demokratie müssen wir <strong>informiert sein, um über komplexe Gesetze abstimmen zu können.</strong>
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 py-2">
                                    <div id="slacktivism-card" className="bg-white border-t-4 border-red-500 shadow-lg p-4 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center mb-3"><Vote className="text-red-600 w-5 h-5" /></div>
                                        <h3 className="font-bold text-base mb-1 text-slate-800">Slacktivism</h3>
                                        <p className="text-xs text-slate-600 mb-4 leading-relaxed"><strong>Liken statt wählen:</strong> Politische Posts fühlen sich wie Aktivität an, führen aber selten zur Urne. <SourceBadge ids={["8"]} /></p>
                                    </div>
                                    <div id="fake-news-card" className="bg-white border-t-4 border-amber-500 shadow-lg p-4 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center mb-3"><BrainCircuit className="text-amber-600 w-5 h-5" /></div>
                                        <h3 className="font-bold text-base mb-1 text-slate-800">Anfällig für Fakes</h3>
                                        <p className="text-xs text-slate-600 mb-3 leading-relaxed"><strong>Nur 55% der Schweizer erkennen Fakes</strong> zuverlässig. Bei Abstimmungen ist das ein hohes Risiko. <SourceBadge ids={["11"]} /></p>
                                    </div>
                                    <div id="polarization-card" className="bg-white border-t-4 border-blue-500 shadow-lg p-4 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mb-3"><TrendingDown className="text-blue-600 w-5 h-5" /></div>
                                        <h3 className="font-bold text-base mb-1 text-slate-800">Affektive Polarisierung</h3>
                                        <p className="text-xs text-slate-600 mb-4 leading-relaxed"><strong>Wut klickt besser.</strong> Der politische Gegner wird oft nicht mehr als falsch, sondern als böse gesehen. <SourceBadge ids={["10"]} /></p>
                                    </div>
                                </div>

                                {/* Agenda Setting Section (Replaces Regulation) */}
                                <div id="agenda-setting" className="scroll-mt-24 bg-amber-50/50 rounded-[2rem] p-6 md:p-8 my-4 border border-amber-100 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-amber-500 p-2 rounded-xl"><MessageCircle className="w-5 h-5 text-white" /></div>
                                            <h3 className="text-xl font-bold text-amber-900 tracking-tight">Die Macht der Agenda</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-4">
                                                <p className="text-base text-slate-700 leading-relaxed">
                                                    <strong>Beispiel Covid-Abstimmungen:</strong> Früher setzten Journalisten die Themen. Heute wachsen Themen oft in privaten Chats (Telegram) heran, bis <strong>die Politik reagieren <em>muss</em>.</strong>
                                                </p>
                                                <div className="bg-white/60 p-4 rounded-xl border border-amber-200/50">
                                                    <p className="text-sm text-amber-900 font-semibold italic">
                                                        "Die Politik diskutiert nicht mehr das, was wichtig ist, sondern das, was viral geht." <SourceBadge ids={["9"]} />
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
                                </div>


                                {/* Final Responsibility Question Section */}
                                <div id="final-question" className="scroll-mt-24 bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2rem] p-6 md:p-10 my-6 border-2 border-slate-200 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 text-center">Die entscheidende Frage</h3>
                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                                                        Wenn der Algorithmus dich nicht informieren <em>will</em>, wer ist dann dafür verantwortlich, dass du informiert <em>bist</em>?
                                                    </p>
                                                    <ul className="space-y-3 text-base text-slate-600">
                                                        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                                                            <span className="text-2xl">🏢</span>
                                                            <span>Die Tech-Giganten?</span>
                                                        </li>
                                                        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                                                            <span className="text-2xl">🏛️</span>
                                                            <span>Der Staat? <SourceBadge ids={["12"]} /></span>
                                                        </li>
                                                        <li className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                                                            <span className="text-2xl">🪞</span>
                                                            <span className="text-blue-700 font-bold">Oder bist du es selbst?</span>
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
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with Sources List */}
                    <div id="quellen" className="mt-8 border-t border-slate-200 pt-6">
                        <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Wissenschaftliche Quellen
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
