import { useEffect, useState } from 'react';
import {
    Newspaper,
    Smartphone,
    Tv,
    Users,
    TrendingDown,
    AlertTriangle,
    Vote,
    MessageCircle,
    Info,
    ExternalLink,
    ShieldCheck,
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

            {/* Header */}
            <header id="header-intro" className="scroll-mt-24 bg-slate-900 text-white pt-12 pb-24 px-4 shadow-lg relative overflow-hidden">
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

                            {/* Intro Text */}
                            <div className="max-w-3xl">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Wie wir miteinander reden</h2>
                                <p className="text-lg text-slate-600 mb-6">
                                    Früher bestimmten Zeitungsredaktionen, was wichtig war. Heute entscheidet oft ein Algorithmus auf deinem Handy. Das verändert nicht nur, wie wir Nachrichten lesen, sondern wie unsere Demokratie funktioniert.
                                </p>
                            </div>

                            {/* Agora Box */}
                            <div id="agora-explanation" className="scroll-mt-24 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-indigo-100 rounded-full w-24 h-24 opacity-50"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center">
                                        <LayoutGrid className="w-6 h-6 mr-2 text-indigo-600" />
                                        Was bedeutet "Agora"?
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6 items-center">
                                        <div>
                                            <p className="text-slate-700 leading-relaxed mb-4">
                                                Das Wort kommt aus dem alten Griechenland. Die <strong>Agora</strong> war der zentrale <strong>Marktplatz</strong> einer Stadt.
                                            </p>
                                            <p className="text-slate-700 leading-relaxed">
                                                Dort kaufte man nicht nur Gemüse, sondern dort trafen sich alle Bürger/innen, um zu diskutieren und Politik zu machen.
                                                Es war der Ort, an dem sich die "Öffentlichkeit" bildete. Ohne diesen gemeinsamen Platz wusste niemand, was in der Stadt los war.
                                            </p>
                                        </div>
                                        <div className="bg-white/80 p-4 rounded-xl border border-indigo-100 text-sm shadow-sm">
                                            <strong className="block text-indigo-700 mb-2">Vergleich für heute:</strong>
                                            <ul className="space-y-2 text-slate-600">
                                                <li className="flex items-start">
                                                    <span className="mr-2">🏛️</span>
                                                    <span><strong>Früher:</strong> Wie eine grosse Schulversammlung. Einer spricht vorne, alle hören dasselbe.</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="mr-2">📱</span>
                                                    <span><strong>Heute:</strong> Wie tausende kleine WhatsApp-Gruppenchats gleichzeitig. Jeder sieht nur seinen Teil, es ist laut und chaotisch.</span>
                                                </li>
                                            </ul>
                                        </div>
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

                            <div id="gatekeeper-infobox" className="scroll-mt-24">
                                <InfoBox title="Was bedeutet 'Gatekeeper'?" icon={<Lock className="w-4 h-4 mr-2" />} color="emerald">
                                    Gatekeeper heißt übersetzt <strong>"Torwächter"</strong>. <br />
                                    Stell dir einen Club vor. Der Türsteher entscheidet, wer reinkommt. Bei Nachrichten war das früher die Chefredaktion. Sie sortierte: "Das ist ein Gerücht (kommt nicht rein)" und "Das ist ein Fakt (kommt rein)". <br />
                                    <strong>Das Problem heute:</strong> Auf Social Media gibt es keinen Türsteher. Jeder kann alles posten, ob wahr oder falsch.
                                </InfoBox>
                            </div>

                        </div>
                    )}

                    {/* TAB 2: DATEN */}
                    {activeTab === 'data' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div id="data-intro" className="scroll-mt-24 max-w-3xl">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Die Zahlen: Eine gespaltene Gesellschaft</h2>
                                <p className="text-lg text-slate-600 mb-6">
                                    Die Daten aus 2024 und 2025 zeigen: Wir driften auseinander. Ältere Menschen nutzen noch TV und Zeitungen, junge Menschen sind fast nur noch auf Social Media.
                                </p>
                            </div>

                            {/* Grid of Stats */}
                            <div id="stat-cards" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                                    value="2.1 Mrd."
                                    label="Werbegeld weg"
                                    subtext="CHF pro Jahr gehen an Google/Meta statt an Schweizer Medien."
                                    color="amber"
                                    sourceIds={["5"]}
                                />
                                <StatCard
                                    value="+7%"
                                    label="TikTok Boom"
                                    subtext="Starker Anstieg der TikTok-Nutzung für News bei jungen Schweizern."
                                    color="blue"
                                    sourceIds={["4"]}
                                />
                            </div>

                            <div id="chart-section" className="scroll-mt-24 bg-slate-50 rounded-xl p-8 border border-slate-200">
                                <h3 className="font-bold text-xl mb-6">Wer schaut noch Nachrichten?</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2 text-sm font-semibold">
                                            <span>Klassisches TV (Gesamtbevölkerung DE)</span>
                                            <span>43%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '43%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2 text-sm font-semibold">
                                            <span className="text-purple-700">Social Media als Hauptquelle (18-24 Jahre)</span>
                                            <span className="text-purple-700">50%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                                        </div>
                                        <SourceBadge ids={["1", "4"]} />
                                    </div>
                                </div>

                                <div className="mt-8 grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded border border-slate-100 shadow-sm">
                                        <h4 className="font-bold text-sm mb-2">Die "TikTokisierung"</h4>
                                        <p className="text-xs text-slate-600">
                                            TikTok wird wichtiger. Das Problem: Komplexe Politik wird dort oft auf 15 Sekunden Spaß reduziert. Hintergründe fehlen oft.
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded border border-slate-100 shadow-sm">
                                        <h4 className="font-bold text-sm mb-2">Bildung entscheidet</h4>
                                        <p className="text-xs text-slate-600">
                                            Menschen mit niedrigerer formaler Bildung gehören öfter zur Gruppe, die gar keine Nachrichten mehr schaut ("News Deprivierte").
                                        </p>
                                        <SourceBadge ids={["9"]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: FOLGEN */}
                    {activeTab === 'consequences' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div id="consequences-intro" className="scroll-mt-24 max-w-3xl">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Was passiert mit unserer Demokratie?</h2>
                                <p className="text-lg text-slate-600 mb-6">
                                    Die Schweiz ist eine direkte Demokratie. Wir müssen mehrmals im Jahr über komplexe Gesetze abstimmen. Das funktioniert nur, wenn wir informiert sind.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">

                                {/* Konsequenz 1 */}
                                <div id="slacktivism-card" className="scroll-mt-24 bg-white border-t-4 border-red-500 shadow-lg p-6 rounded-lg hover:-translate-y-1 transition-transform">
                                    <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                        <Vote className="text-red-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Schein-Aktivität ("Slacktivism")</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Viele liken politische Posts und fühlen sich informiert. Aber Forschung zeigt: Das führt oft nicht dazu, dass sie wirklich wählen gehen. Es ist eine "Illusion".
                                    </p>
                                    <SourceBadge ids={["19"]} />
                                </div>

                                {/* Konsequenz 2 */}
                                <div id="fake-news-card" className="scroll-mt-24 bg-white border-t-4 border-amber-500 shadow-lg p-6 rounded-lg hover:-translate-y-1 transition-transform">
                                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                        <BrainCircuit className="text-amber-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Anfällig für Fakes</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Nur 55% der Schweizer/innen erkennen Falschnachrichten. Das ist im internationalen Vergleich wenig. Da wir oft abstimmen, ist das gefährlich.
                                    </p>
                                    <SourceBadge ids={["31"]} />
                                </div>

                                {/* Konsequenz 3 */}
                                <div id="polarization-card" className="scroll-mt-24 bg-white border-t-4 border-blue-500 shadow-lg p-6 rounded-lg hover:-translate-y-1 transition-transform">
                                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                        <TrendingDown className="text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Mehr Wut, weniger Diskussion</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Auf Social Media klickt man eher auf das, was wütend macht. Das führt dazu, dass wir den politischen Gegner nicht mehr nur "falsch", sondern "böse" finden.
                                    </p>
                                    <SourceBadge ids={["27"]} />
                                </div>
                            </div>

                            <InfoBox title="Beispiel: Covid-Abstimmungen" icon={<MessageCircle className="w-4 h-4 mr-2" />} color="amber">
                                <p className="mb-2">
                                    Früher bestimmten Zeitungen, worüber diskutiert wird. Während der Pandemie änderte sich das in der Schweiz:
                                    Themen wurden oft auf Twitter und Telegram groß gemacht. Die Politik musste reagieren.
                                </p>
                                <div className="flex items-center text-xs text-slate-700 font-semibold mt-2">
                                    <ArrowRight className="w-3 h-3 mr-1" />
                                    Das nennt man "Agenda-Setting". Die Macht hat sich verschoben. <SourceBadge ids={["21"]} />
                                </div>
                            </InfoBox>

                            {/* Regulation Section */}
                            <div id="regulation-section" className="scroll-mt-24 bg-slate-900 text-white rounded-xl p-8 mt-8">
                                <div className="flex items-start">
                                    <Scale className="w-8 h-8 text-green-400 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Was macht der Staat? (Gesetze)</h3>
                                        <p className="text-slate-300 text-sm mb-6">
                                            Die EU hat strenge Regeln eingeführt (DSA). Die Schweiz plant ein eigenes Gesetz (KomPG).
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-slate-800 p-4 rounded border border-slate-700">
                                        <strong className="text-blue-400 block mb-2">EU (DSA)</strong>
                                        <p className="text-slate-400 mb-2">Sehr streng.</p>
                                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                            <li>Plattformen müssen Risiken minimieren.</li>
                                            <li>Sie haften schneller für illegale Inhalte.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded border-2 border-green-500/50">
                                        <strong className="text-green-400 block mb-2">Schweiz (KomPG Entwurf)</strong>
                                        <p className="text-slate-400 mb-2">Eher zurückhaltend ("Swiss Finish").</p>
                                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                            <li>Fokus: Transparenz (Warum sehe ich das?).</li>
                                            <li>Nutzer sollen sich einfacher beschweren können.</li>
                                            <li>Keine Lösch-Pflichten (Angst vor Zensur).</li>
                                        </ul>
                                    </div>
                                </div>
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
                audioSrc={config.audioSrc}
                directorState={directorState}
            />
        </div>
    );
}
