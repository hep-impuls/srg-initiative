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
    LayoutGrid,
    Copy,
    Check
} from 'lucide-react';
import { useAudioDirector } from '@/hooks/useAudioDirector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { StatCard } from '@/components/StatCard';
import { InfoBox } from '@/components/InfoBox';
import { SourceBadge } from '@/components/SourceBadge';
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

const IMAGE_PROMPTS = {
    agora1: {
        format: "16:9",
        prompt: "A realistic, high-angle flat lay photograph of a modern wooden desk. On one side, there is an old printed newspaper and a classic radio. On the other side, a premium smartphone and a tablet showing news apps. The lighting is warm and natural. Low text, high visual significance on the objects. Clean, educational aesthetic."
    },
    agora2: {
        format: "1:1",
        prompt: "A realistic historical reconstruction of an ancient Greek Agora in a 'National Geographic' documentary style. Warm sunlight illuminating authentic marble columns and dusty ground. Small groups of people in simple linen tunics standing in a circle, engaged in serious conversation. Earthy tones, grounded and educational."
    },
    agora3: {
        format: "1:1",
        prompt: "A close-up shot of a classic editorial desk from the 1980s. A stack of papers, a pencil, and a magnifying glass. A hand is seen using a red marker to highlight a specific line on a manuscript. Professional, focused, and grounded in the physical act of editing and verification. Soft, natural desk lamp lighting."
    },
    agora4: {
        format: "16:9",
        prompt: "A split-screen photographic comparison in a public transport setting (e.g., a train). Left side: An older person in neutral clothing reading a large, folded printed newspaper. Right side: A young person in colorful modern clothing looking intently at a smartphone screen. Consistent lighting across both sides to emphasize the shared space but different habits."
    }
};

function ImagePromptDescription({ promptId }: { promptId: keyof typeof IMAGE_PROMPTS }) {
    const [copied, setCopied] = useState(false);
    const { prompt, format } = IMAGE_PROMPTS[promptId];

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-100 px-2.5 py-1 rounded-md">LLM Prompt</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">Format: {format}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg shadow-sm border border-blue-50"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{copied ? 'Kopiert' : 'Kopieren'}</span>
                </button>
            </div>
            <p className="text-[12px] text-slate-600 italic leading-relaxed text-left font-medium border-l-2 border-blue-200 pl-4">{prompt}</p>
        </div>
    );
}

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
            <div id="beginning-highlight" className="scroll-mt-24">
                {/* Header */}
                <header className="bg-slate-900 text-white pt-12 pb-24 px-4 shadow-lg relative overflow-hidden">
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
                <main className="max-w-5xl mx-auto px-4 -mt-12 relative z-20 pb-20">

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-t-2xl shadow-sm border-b border-slate-200 flex flex-col md:flex-row overflow-hidden">
                        <button
                            onClick={() => setManualTab('theory')}
                            className={`flex-1 py-6 px-6 text-left flex items-center transition-all ${activeTab === 'theory' ? 'bg-white border-b-4 border-blue-500 text-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-3 rounded-full mr-4 ${activeTab === 'theory' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-lg">1. Theorie</div>
                                <div className="text-xs uppercase tracking-wide opacity-80">Verstehen</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setManualTab('data')}
                            className={`flex-1 py-6 px-6 text-left flex items-center transition-all ${activeTab === 'data' ? 'bg-white border-b-4 border-purple-500 text-purple-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-3 rounded-full mr-4 ${activeTab === 'data' ? 'bg-purple-100' : 'bg-slate-200'}`}>
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-lg">2. Datenlage</div>
                                <div className="text-xs uppercase tracking-wide opacity-80">Erkennen</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setManualTab('consequences')}
                            className={`flex-1 py-6 px-6 text-left flex items-center transition-all ${activeTab === 'consequences' ? 'bg-white border-b-4 border-amber-500 text-amber-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <div className={`p-3 rounded-full mr-4 ${activeTab === 'consequences' ? 'bg-amber-100' : 'bg-slate-200'}`}>
                                <Scale size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-lg">3. Folgen</div>
                                <div className="text-xs uppercase tracking-wide opacity-80">Handeln</div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content Container */}
                    <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-12 min-h-[600px]">

                        {/* TAB 1: THEORIE */}
                        {activeTab === 'theory' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* Intro Text Section */}
                                <div className="min-h-[60vh] flex items-center py-12">
                                    <div className="flex flex-col lg:flex-row gap-8 items-center w-full">
                                        <div id="theory-intro" className="scroll-mt-32 flex-1">
                                            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Wie wir miteinander reden</h2>
                                            <p className="text-xl text-slate-600 mb-4 leading-relaxed max-w-2xl">
                                                Früher bestimmten Zeitungsredaktionen, was wichtig war. Heute entscheidet oft ein Algorithmus auf deinem Handy. Das verändert nicht nur, wie wir Nachrichten lesen, sondern wie unsere Demokratie funktioniert.
                                            </p>
                                        </div>
                                        <div className="w-full lg:w-2/5 group">
                                            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                                                <img
                                                    src="/img/agora1.png"
                                                    alt="Digitale Informationslandschaft"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <ImagePromptDescription promptId="agora1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Rest of the Content */}
            <main className="max-w-5xl mx-auto px-4 relative z-20 pb-20 -mt-20">
                <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-12 min-h-[500px] border-t border-slate-100">

                    {/* TAB 1: THEORIE - REST */}
                    {activeTab === 'theory' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Agora Box Section */}
                            <div id="agora-explanation" className="scroll-mt-32 min-h-[70vh] flex items-center py-20 bg-gradient-to-br from-indigo-50/50 to-white rounded-3xl border border-indigo-100 p-8 md:p-12 relative overflow-hidden">
                                <div className="relative z-10 w-full">
                                    <h3 className="text-2xl font-bold text-indigo-900 mb-8 flex items-center">
                                        <LayoutGrid className="w-6 h-6 mr-3 text-indigo-600" />
                                        Was bedeutet "Agora"?
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-12 items-center">
                                        <div className="space-y-6">
                                            <p className="text-lg text-slate-700 leading-relaxed">
                                                Das Wort kommt aus dem alten Griechenland. Die <strong>Agora</strong> war der zentrale <strong>Marktplatz</strong> einer Stadt.
                                            </p>
                                            <p className="text-lg text-slate-700 leading-relaxed">
                                                Dort kaufte man nicht nur Gemüse, sondern dort trafen sich alle Bürger/innen, um zu diskutieren und Politik zu machen.
                                                Es war der Ort, an dem sich die "Öffentlichkeit" bildete.
                                            </p>
                                            <div className="w-full max-w-[280px] group">
                                                <div className="aspect-square bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
                                                    <img
                                                        src="/img/agora2.png"
                                                        alt="Antike Agora Rekonstruktion"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <ImagePromptDescription promptId="agora2" />
                                            </div>
                                        </div>
                                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-indigo-100 text-base shadow-xl space-y-4">
                                            <strong className="block text-xl text-indigo-700 mb-4 border-b border-indigo-50 pb-2">Vergleich für heute:</strong>
                                            <div className="flex items-start gap-4 text-slate-600">
                                                <div className="bg-indigo-50 p-2 rounded-lg text-2xl">🏛️</div>
                                                <p><strong className="text-slate-900">Früher:</strong> Wie eine grosse Schulversammlung. Einer spricht vorne, alle hören dasselbe.</p>
                                            </div>
                                            <div className="flex items-start gap-4 text-slate-600">
                                                <div className="bg-indigo-50 p-2 rounded-lg text-2xl">📱</div>
                                                <p><strong className="text-slate-900">Heute:</strong> Wie tausende kleine WhatsApp-Gruppenchats gleichzeitig. Jeder sieht nur seinen Teil, es ist laut und chaotisch.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            </div>

                            {/* Gatekeeper InfoBox - moved before comparison to match audio flow */}
                            {/* Gatekeeper Section */}
                            <div id="gatekeeper-infobox" className="scroll-mt-32 min-h-[60vh] flex items-center py-20">
                                <div className="flex flex-col md:flex-row gap-12 items-center w-full">
                                    <div className="flex-1">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 md:p-12 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-emerald-500 p-2 rounded-xl"><Lock className="w-6 h-6 text-white" /></div>
                                                <h3 className="text-2xl font-bold text-emerald-900">Was bedeutet 'Gatekeeper'?</h3>
                                            </div>
                                            <p className="text-lg text-emerald-900/80 leading-relaxed">
                                                Gatekeeper heißt übersetzt <strong>"Torwächter"</strong>. <br /><br />
                                                Stell dir einen Club vor. Der Türsteher entscheidet, wer reinkommt. Bei Nachrichten war das früher die Chefredaktion. Sie sortierte: "Das ist ein Gerücht (kommt nicht rein)" und "Das ist ein Fakt (kommt rein)". <br /><br />
                                                <span className="text-emerald-700 font-semibold">Das Problem heute:</span> Auf Social Media gibt es keinen Türsteher. Jeder kann alles posten, ob wahr oder falsch.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 group">
                                        <div className="aspect-square bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden p-2">
                                            <img
                                                src="/img/agora3.png"
                                                alt="Digitaler Gatekeeper Konzept"
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                        </div>
                                        <ImagePromptDescription promptId="agora3" />
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Grid */}
                            <div id="comparison-section" className="scroll-mt-24 mt-12">
                                <h3 className="text-xl font-bold mb-6 text-center">Der Wandel: Ein Vergleich</h3>
                                <div className="grid md:grid-cols-2 gap-8 relative">

                                    {/* Arrow for Desktop */}
                                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow border border-slate-200">
                                        <ArrowRight className="text-slate-400" />
                                    </div>

                                    {/* FRÜHER */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-300 transition-colors">
                                        <div className="flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full mb-4 mx-auto">
                                            <Flame className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <h4 className="text-center text-lg font-bold text-slate-700 mb-2">Das "Lagerfeuer"</h4>
                                        <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-6">Massenmedien (TV, Zeitung)</p>

                                        <ul className="space-y-4 text-sm text-slate-600">
                                            <li className="flex gap-3">
                                                <Users className="w-5 h-5 shrink-0 text-slate-400" />
                                                <span><strong>Alle sehen das Gleiche:</strong> Wenn um 20:00 Uhr die Tagesschau lief, sahen fast alle zu. Am nächsten Tag konnte man im Büro darüber reden.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <Lock className="w-5 h-5 shrink-0 text-slate-400" />
                                                <span><strong>Der Türsteher ("Gatekeeper"):</strong> Chefredakteur/innen entschieden, was wichtig genug ist, um gedruckt zu werden. Sie filterten Fake News (meistens) raus.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* HEUTE */}
                                    <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-colors">
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full mb-4 mx-auto">
                                            <Smartphone className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h4 className="text-center text-lg font-bold text-blue-900 mb-2">Der "Eigene Tunnel"</h4>
                                        <p className="text-center text-xs text-blue-400 uppercase tracking-widest mb-6">Plattformen (Social Media)</p>

                                        <ul className="space-y-4 text-sm text-slate-700">
                                            <li className="flex gap-3">
                                                <Users className="w-5 h-5 shrink-0 text-blue-500" />
                                                <span><strong>Jeder sieht etwas anderes:</strong> Dein TikTok-Feed sieht komplett anders aus als der deiner Eltern. Es gibt keine gemeinsame Basis mehr.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <BrainCircuit className="w-5 h-5 shrink-0 text-blue-500" />
                                                <span><strong>Der Algorithmus:</strong> Ein Computerprogramm entscheidet, was du siehst. Das Ziel ist nicht "Wahrheit", sondern dass du möglichst lange in der App bleibst.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB 2: DATEN */}
                    {activeTab === 'data' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="min-h-[70vh] flex flex-col justify-center py-20">
                                <div className="flex flex-col lg:flex-row gap-12 items-center mb-16 px-4">
                                    <div id="data-intro" className="scroll-mt-32 flex-1">
                                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Die Zahlen: Eine gespaltene Gesellschaft</h2>
                                        <p className="text-xl text-slate-600 mb-4 leading-relaxed max-w-2xl">
                                            Die Daten aus 2024 und 2025 zeigen: Wir driften auseinander. Ältere Menschen nutzen noch TV und Zeitungen, junge Menschen sind fast nur noch auf Social Media.
                                        </p>
                                    </div>
                                    <div className="w-full lg:w-2/5 group">
                                        <div className="aspect-video bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                                            <img
                                                src="/img/agora4.png"
                                                alt="Digitale Nachrichtennutzung Visual"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <ImagePromptDescription promptId="agora4" />
                                    </div>
                                </div>

                                {/* Grid of Stats */}
                                <div id="stat-cards" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        value="46%"
                                        label="News Deprivierte"
                                        subtext="Fast die Hälfte der Schweizer/innen konsumiert kaum noch 'harte' Nachrichten."
                                        color="red"
                                        sourceIds={["8"]}
                                    />
                                    <StatCard
                                        value="17%"
                                        label="Nur Social Media"
                                        subtext="Anteil der 18-24 Jährigen in DE, die Journalismus komplett ignorieren."
                                        color="purple"
                                        sourceIds={["1"]}
                                    />
                                    <StatCard
                                        value="+7%"
                                        label="TikTok Boom"
                                        subtext="Starker Anstieg der TikTok-Nutzung für News bei jungen Schweizern."
                                        color="blue"
                                        sourceIds={["4"]}
                                    />
                                    <StatCard
                                        value="2.1 Mrd."
                                        label="Werbegeld weg"
                                        subtext="CHF pro Jahr gehen an Google/Meta statt an Schweizer Medien."
                                        color="amber"
                                        sourceIds={["5"]}
                                    />
                                </div>
                            </div>

                            <div id="chart-section" className="scroll-mt-32 min-h-[60vh] flex flex-col justify-center bg-slate-50/50 rounded-3xl p-8 md:p-16 border border-slate-100 my-12">
                                <h3 className="font-bold text-3xl mb-12 text-center text-slate-800 tracking-tight">Wer schaut noch Nachrichten?</h3>

                                <div className="max-w-4xl mx-auto w-full space-y-12">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                        <div className="flex justify-between mb-4 text-base font-bold text-slate-700">
                                            <span>Klassisches TV (Gesamtbevölkerung DE)</span>
                                            <span className="bg-slate-100 px-3 py-1 rounded-full">43%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                            <div className="bg-slate-400 h-full rounded-full transition-all duration-1000 shadow-inner" style={{ width: '43%' }}></div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100">
                                        <div className="flex justify-between mb-4 text-base font-bold text-purple-900">
                                            <span>Social Media als Hauptquelle (18-24 Jahre)</span>
                                            <span className="bg-purple-100 px-3 py-1 rounded-full">50%</span>
                                        </div>
                                        <div className="w-full bg-purple-50 rounded-full h-4 overflow-hidden">
                                            <div className="bg-purple-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(147,51,234,0.3)]" style={{ width: '50%' }}></div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <SourceBadge ids={["1", "4"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-lg mb-3 text-slate-800">Die "TikTokisierung"</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            TikTok wird wichtiger. Das Problem: Komplexe Politik wird dort oft auf 15 Sekunden Spaß reduziert. Hintergründe fehlen oft.
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-lg mb-3 text-slate-800">Bildung entscheidet</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            Menschen mit niedrigerer formaler Bildung gehören öfter zur Gruppe, die gar keine Nachrichten mehr schaut ("News Deprivierte").
                                        </p>
                                        <div className="mt-3"><SourceBadge ids={["9"]} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: FOLGEN */}
                    {activeTab === 'consequences' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div id="consequences-intro" className="scroll-mt-32 min-h-[50vh] flex flex-col justify-center py-20">
                                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Was passiert mit unserer Demokratie?</h2>
                                <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
                                    Die Schweiz ist eine direkte Demokratie. Wir müssen mehrmals im Jahr über komplexe Gesetze abstimmen. Das funktioniert nur, wenn wir informiert sind.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 py-12">
                                {/* Konsequenz 1 */}
                                <div id="slacktivism-card" className="scroll-mt-32 bg-white border-t-4 border-red-500 shadow-xl p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <Vote className="text-red-600 w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-slate-800">Schein-Aktivität ("Slacktivism")</h3>
                                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                        Viele liken politische Posts und fühlen sich informiert. Aber Forschung zeigt: Das führt oft nicht dazu, dass sie wirklich wählen gehen. Es ist eine "Illusion".
                                    </p>
                                    <SourceBadge ids={["19"]} />
                                </div>

                                {/* Konsequenz 2 */}
                                <div id="fake-news-card" className="scroll-mt-32 bg-white border-t-4 border-amber-500 shadow-xl p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <BrainCircuit className="text-amber-600 w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-slate-800">Anfällig für Fakes</h3>
                                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                        Nur 55% der Schweizer/innen erkennen Falschnachrichten. Das ist im internationalen Vergleich wenig. Da wir oft abstimmen, ist das gefährlich.
                                    </p>
                                    <SourceBadge ids={["31"]} />
                                </div>

                                {/* Konsequenz 3 */}
                                <div id="polarization-card" className="scroll-mt-32 bg-white border-t-4 border-blue-500 shadow-xl p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <TrendingDown className="text-blue-600 w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-slate-800">Mehr Wut, weniger Diskussion</h3>
                                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                        Auf Social Media klickt man eher auf das, was wütend macht. Das führt dazu, dass wir den politischen Gegner nicht mehr nur "falsch", sondern "böse" finden.
                                    </p>
                                    <SourceBadge ids={["27"]} />
                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto py-12">
                                <InfoBox title="Beispiel: Covid-Abstimmungen" icon={<MessageCircle className="w-5 h-5 mr-2" />} color="amber">
                                    <p className="text-base mb-4 leading-relaxed">
                                        Früher bestimmten Zeitungen, worüber diskutiert wird. Während der Pandemie änderte sich das in der Schweiz:
                                        Themen wurden oft auf Twitter und Telegram groß gemacht. Die Politik musste reagieren.
                                    </p>
                                    <div className="flex items-center text-sm text-slate-700 font-bold bg-amber-100/50 p-3 rounded-xl border border-amber-200/50">
                                        <ArrowRight className="w-4 h-4 mr-2 text-amber-600" />
                                        Das nennt man "Agenda-Setting". Die Macht hat sich verschoben. <SourceBadge ids={["21"]} />
                                    </div>
                                </InfoBox>
                            </div>

                            {/* Regulation Section */}
                            <div id="regulation-section" className="scroll-mt-32 min-h-[60vh] flex flex-col justify-center bg-slate-900 text-white rounded-[2rem] p-10 md:p-16 my-12 shadow-2xl overflow-hidden relative">
                                <div className="relative z-10">
                                    <div className="flex items-start mb-12">
                                        <div className="bg-green-500/20 p-4 rounded-2xl mr-6">
                                            <Scale className="w-10 h-10 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold mb-3 tracking-tight">Was macht der Staat? (Gesetze)</h3>
                                            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                                Die EU hat strenge Regeln eingeführt (DSA). Die Schweiz plant ein eigenes Gesetz (KomPG).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 text-base">
                                        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                <strong className="text-blue-400 text-xl font-bold uppercase tracking-wider">EU (DSA)</strong>
                                            </div>
                                            <p className="text-slate-200 font-semibold mb-4 bg-slate-700/50 px-3 py-1 rounded-lg inline-block">Status: Sehr streng</p>
                                            <ul className="space-y-4 text-slate-300">
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2.5"></div>
                                                    <span>Plattformen müssen Risiken für die Gesellschaft minimieren.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2.5"></div>
                                                    <span>Sie haften schneller für illegale Inhalte (Hate Speech, etc.).</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border-2 border-green-500/30 hover:border-green-500/50 transition-colors shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                                <strong className="text-green-400 text-xl font-bold uppercase tracking-wider">Schweiz (KomPG Entwurf)</strong>
                                            </div>
                                            <p className="text-slate-200 font-semibold mb-4 bg-slate-700/50 px-3 py-1 rounded-lg inline-block">Status: "Swiss Finish" (Eher zurückhaltend)</p>
                                            <ul className="space-y-4 text-slate-300">
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2.5"></div>
                                                    <span>Fokus auf Transparenz (Warum wird mir das gezeigt?).</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2.5"></div>
                                                    <span>Nutzer sollen sich einfacher beschweren können.</span>
                                                </li>
                                                <li className="flex items-start gap-3 text-slate-400 text-sm italic">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2.5"></div>
                                                    <span>Keine Lösch-Pflichten aus Angst vor Zensur.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative gradient */}
                                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer with Sources List */}
                <div id="quellen" className="mt-16 border-t border-slate-300 pt-8">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Wissenschaftliche Quellen
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sources.map((source) => (
                            <div key={source.id} className="text-sm bg-white p-3 rounded shadow-sm border border-slate-200">
                                <div className="flex items-baseline mb-1">
                                    <span className="font-bold text-blue-600 mr-2 text-xs">[{source.id}]</span>
                                    <span className="font-semibold text-slate-800 text-xs leading-tight">{source.text}</span>
                                </div>
                                <p className="text-xs text-slate-500 pl-6">{source.details}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* Audio Player Component */}
            <AudioPlayer
                audioSrc={config.audioSrc || ''}
                directorState={directorState}
            />
        </div>
    );
}
