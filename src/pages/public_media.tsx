import React, { useState } from 'react';
import {
    Globe,
    Tv,
    Radio,
    Euro,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
    TrendingDown,
    Users,
    BookOpen,
    AlertTriangle,
    Info,
    Link as LinkIcon,
    X,
    Landmark,
    Coins
} from 'lucide-react';

// Daten für Berufsschüler (B1 Niveau)
// Wichtige Begriffe sind in <strong> Tags fettgedruckt.
const countryData = [
    {
        id: 'deutschland',
        name: 'Deutschland',
        region: 'Europa',
        model: 'Haushaltsbeitrag',
        stability: 'Hoch',
        independence: 'Hoch',
        trustScore: 64,
        fundingDetail: 'Pauschale pro Wohnung (egal wie viele Geräte).',
        description: (
            <>
                In Deutschland zahlt jeder Haushalt den gleichen Betrag, egal ob man einen Fernseher hat oder nicht. Das sichert den Sendern feste Einnahmen. Wichtig: Nicht die Politiker bestimmen die Höhe des Beitrags, sondern eine unabhängige Gruppe von Experten (die <strong>KEF</strong>). Das schützt den Sender vor politischem Druck.
            </>
        ),
        risks: (
            <>
                Manchmal versuchen Politiker in den Bundesländern, eine Erhöhung zu blockieren, um bei Wählern gut dazustehen (<strong>Populismus</strong>).
            </>
        ),
        status: 'sicher',
        refs: [13, 20, 21]
    },
    {
        id: 'finnland',
        name: 'Finnland',
        region: 'Nordic',
        model: 'Yle-Steuer',
        stability: 'Sehr Hoch',
        independence: 'Hoch',
        trustScore: 69,
        fundingDetail: 'Abhängig vom Einkommen (wer mehr verdient, zahlt mehr).',
        description: (
            <>
                Finnland nutzt eine spezielle Steuer. Das ist <strong>sozial gerecht</strong>: Wer wenig verdient, zahlt nichts. Wer viel verdient, zahlt mehr. Der Clou: Das Geld kommt in einen <strong>extra Topf</strong> (Fonds). Die Politiker können dieses Geld nicht für andere Dinge (wie Straßenbau) wegnehmen.
            </>
        ),
        risks: 'Das System ist sehr sicher. Es gibt kaum Risiken, weil alle Parteien zustimmen.',
        status: 'sicher',
        refs: [20, 25, 63]
    },
    {
        id: 'uk',
        name: 'Großbritannien',
        region: 'Europa',
        model: 'Lizenzgebühr',
        stability: 'Sinkend',
        independence: 'Mittel',
        trustScore: 62,
        fundingDetail: 'Gebühr für Live-TV Nutzung.',
        description: (
            <>
                Die BBC ist berühmt, hat aber Probleme. Die Regierung hat den Preis für die Lizenz lange Zeit eingefroren. Das ist real eine <strong>Budget-Kürzung</strong> von 30%. Außerdem muss die BBC alle paar Jahre neu mit der Regierung verhandeln (die "Royal Charter"). Das nutzen Politiker oft als <strong>Druckmittel</strong>.
            </>
        ),
        risks: (
            <>
                Viele junge Leute zahlen nicht mehr (<strong>Evasion</strong>). Die Regierung droht, die Gebühr 2027 ganz abzuschaffen.
            </>
        ),
        status: 'risiko',
        refs: [16, 17, 18, 19]
    },
    {
        id: 'japan',
        name: 'Japan',
        region: 'Asien',
        model: 'Empfangsgebühr',
        stability: 'Hoch',
        independence: 'Mittel',
        trustScore: 61,
        fundingDetail: 'Pflicht-Vertrag bei Gerätebesitz.',
        description: (
            <>
                Wer in Japan einen Fernseher hat, muss zahlen. Das Geld wird oft direkt an der Haustür von Kontrolleuren ("der NHK-Mann") eingesammelt. Das bringt viel Geld (96% der Einnahmen), aber viele Bürger/innen finden diesen <strong>Zwang</strong> nervig. Es gibt oft Streit darüber.
            </>
        ),
        risks: (
            <>
                Immer mehr Menschen haben gar keinen Fernseher mehr, sondern streamen nur. Das System ist <strong>veraltet</strong>.
            </>
        ),
        status: 'stabil',
        refs: [22, 23, 24]
    },
    {
        id: 'daenemark',
        name: 'Dänemark',
        region: 'Nordic',
        model: 'Steuer (Staatsbudget)',
        stability: 'Mittel',
        independence: 'Gefährdet',
        trustScore: 57,
        fundingDetail: 'Geld direkt vom Staat.',
        description: (
            <>
                Dänemark hat die Gebühr abgeschafft und zahlt den Sender nun direkt aus Steuern. Das Problem: Die Politiker haben sofort das Budget um 20% gekürzt. Sie haben das Geld als <strong>Strafe</strong> benutzt, weil ihnen die Berichte nicht gefielen. Das zeigt: Steuer-Finanzierung macht <strong>abhängig</strong>.
            </>
        ),
        risks: (
            <>
                Jede neue Regierung kann das Budget einfach ändern. Der Sender ist ein Spielball der Politik.
            </>
        ),
        status: 'risiko',
        refs: [4, 6, 26, 27]
    },
    {
        id: 'frankreich',
        name: 'Frankreich',
        region: 'Europa',
        model: 'Mehrwertsteuer (MwSt)',
        stability: 'Mittel',
        independence: 'Mittel',
        trustScore: 50,
        fundingDetail: 'Teil der Umsatzsteuer (temporär).',
        description: (
            <>
                Frankreich hat die Gebühr 2022 abgeschafft. Jetzt bekommen die Sender einen Teil der Mehrwertsteuer. Das ist aber nur eine <strong>Übergangslösung</strong>. Kritiker warnen: Wenn das Geld bald direkt aus dem normalen Staatshaushalt kommt, hat der Präsident zu viel <strong>Macht</strong> über die Medien.
            </>
        ),
        risks: (
            <>
                Ohne festes Gesetz kann die Regierung den Geldhahn zudrehen, wenn die Sender zu kritisch berichten.
            </>
        ),
        status: 'risiko',
        refs: [28, 29, 38, 39]
    },
    {
        id: 'usa',
        name: 'USA',
        region: 'Nordamerika',
        model: 'Spenden & Stiftungen',
        stability: 'Niedrig',
        independence: 'Mittel',
        trustScore: 40,
        fundingDetail: 'Freiwillige Spenden von Bürgern/Firmen.',
        description: (
            <>
                In den USA zahlt der Staat fast nichts. Sender wie PBS müssen um <strong>Spenden</strong> betteln. Das Problem: Sie machen Programm für reiche Leute, damit diese spenden. Ärmere Regionen haben oft gar keine lokalen Nachrichten mehr (<strong>Nachrichten-Wüsten</strong>).
            </>
        ),
        risks: (
            <>
                Wenn Spenden ausbleiben (z.B. in einer Wirtschaftskrise), gehen die Sender pleite. Es gibt keine Sicherheit.
            </>
        ),
        status: 'gefaehrdet',
        refs: [5, 36, 37, 71]
    },
    {
        id: 'griechenland',
        name: 'Griechenland',
        region: 'Europa',
        model: 'Staatsbudget (Instabil)',
        stability: 'Kritisch',
        independence: 'Niedrig',
        trustScore: 30,
        fundingDetail: 'Direkte Kontrolle durch Regierung.',
        description: (
            <>
                Ein Schock-Beispiel: 2013 hat die Regierung den Sender ERT einfach <strong>über Nacht geschlossen</strong>, um Geld zu sparen. Die Bildschirme waren schwarz. Das zeigt extrem deutlich: Wenn es keine Gesetze zum Schutz gibt, kann der Staat die Medien einfach abschalten ("Shutdown").
            </>
        ),
        risks: (
            <>
                Die Menschen vertrauen dem Sender kaum noch, weil jeder weiß: Die Regierung ist der Boss.
            </>
        ),
        status: 'kritisch',
        refs: [48, 49, 50, 72]
    },
    {
        id: 'neuseeland',
        name: 'Neuseeland',
        region: 'Ozeanien',
        model: 'Kommerzieller Staatsbetrieb',
        stability: 'Niedrig',
        independence: 'Niedrig',
        trustScore: 45,
        fundingDetail: 'Muss Gewinn machen (Werbung).',
        description: (
            <>
                Der Staat besitzt den Sender TVNZ zwar, aber er verlangt, dass der Sender <strong>Gewinn</strong> macht (wie eine private Firma). Deshalb läuft dort viel billiges <strong>Reality-TV</strong> und Werbung statt Bildung. Guter Journalismus kostet Geld und bringt wenig Gewinn, also wird er gestrichen.
            </>
        ),
        risks: (
            <>
                Der öffentliche Auftrag (Bildung, Info) wird vergessen, weil es nur ums Geldverdienen geht.
            </>
        ),
        status: 'gefaehrdet',
        refs: [43, 44, 45, 46]
    }
];

const SourceBadge = ({ refs }) => (
    <div className="flex flex-wrap gap-1 mt-2">
        {refs.map((r) => (
            <span key={r} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 cursor-help" title={`Quelle #${r} aus dem Bericht`}>
                <LinkIcon size={10} className="mr-1" />
                Quelle [{r}]
            </span>
        ))}
    </div>
);

const StatusIndicator = ({ status }) => {
    const config = {
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

const App = () => {
    const [activeTab, setActiveTab] = useState('map');
    const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
                            <Globe className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Medien-Check Global</h1>
                            <p className="text-blue-200 text-sm">Wie unabhängig sind Nachrichten weltweit?</p>
                        </div>
                    </div>

                    <nav className="flex bg-slate-700/50 p-1 rounded-lg backdrop-blur-sm">
                        {[
                            { id: 'map', label: 'Länder-Übersicht', icon: Globe },
                            { id: 'compare', label: 'Vergleich', icon: TrendingUp },
                            { id: 'analysis', label: 'Folgen & Analyse', icon: BookOpen }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-6">

                {/* VIEW: LÄNDER MONITOR */}
                {activeTab === 'map' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        {/* Sidebar List */}
                        <div className="lg:col-span-4 flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                            <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">Wähle ein Land</h3>
                            {countryData.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedCountry(c)}
                                    className={`group p-4 rounded-xl border text-left transition-all hover:shadow-md relative overflow-hidden ${selectedCountry.id === c.id
                                            ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-lg'
                                            : 'bg-white border-slate-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg text-slate-800">{c.name}</span>
                                        <span className={`h-2 w-2 rounded-full mt-2 ${c.status === 'sicher' ? 'bg-emerald-500' :
                                                c.status === 'stabil' ? 'bg-blue-500' :
                                                    c.status === 'risiko' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                    </div>
                                    <div className="text-xs text-slate-500 mb-2">{c.model}</div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <span>Vertrauen: {c.trustScore}%</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Detail View */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
                                {/* Card Header */}
                                <div className="bg-slate-50/80 border-b border-slate-100 p-8">
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
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-8 space-y-8">

                                    {/* Funding Detail Box */}
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                                        <Landmark className="text-blue-600 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Woher kommt das Geld?</h4>
                                            <p className="text-blue-800 text-sm font-medium">{selectedCountry.fundingDetail}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                                            <Info size={20} className="text-blue-500" />
                                            So funktioniert das System
                                        </h3>
                                        <p className="text-slate-700 leading-relaxed text-lg">
                                            {selectedCountry.description}
                                        </p>
                                        <SourceBadge refs={selectedCountry.refs} />
                                    </div>

                                    <div className={`p-5 rounded-xl border ${selectedCountry.status === 'sicher' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                                        }`}>
                                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 text-slate-900">
                                            {selectedCountry.status === 'sicher' ? 'Warum es gut funktioniert:' : 'Das größte Problem:'}
                                        </h3>
                                        <p className={`text-sm ${selectedCountry.status === 'sicher' ? 'text-emerald-800' : 'text-red-800'}`}>
                                            {selectedCountry.risks}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW: DATEN VERGLEICH */}
                {activeTab === 'compare' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="max-w-3xl mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Je unabhängiger, desto mehr Vertrauen</h2>
                                <p className="text-slate-600 text-lg">
                                    Die Grafik zeigt: Wenn das Geld sicher ist (unabhängig von Politikern), dann <strong>vertrauen</strong> die Menschen den Nachrichten mehr.
                                    Wenn das Geld direkt vom Staat oder von Werbung kommt, ist das Vertrauen geringer.
                                </p>
                            </div>

                            {/* Chart Visualization */}
                            <div className="relative h-80 flex items-end justify-between gap-4 px-4 pb-8 border-b border-slate-200">
                                <div className="absolute left-0 top-10 bottom-10 w-px border-l border-dashed border-slate-300"></div>
                                <div className="absolute -left-8 top-1/2 -rotate-90 text-xs font-bold text-slate-400 tracking-widest uppercase">
                                    Vertrauens-Wert
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
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" />
                                    Mythos: "Staatliche Sender schaden Privaten"
                                </h3>
                                <p className="text-slate-700 mb-4">
                                    Viele glauben: Wenn es ARD/ZDF gibt, haben private Firmen (wie Netflix oder RTL) keine Chance.
                                    <strong>Das stimmt nicht.</strong> Studien zeigen:
                                </p>
                                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 text-sm">
                                    <div className="flex justify-between items-center mb-2 font-bold text-emerald-900">
                                        <span>Mehr staatliche Online-News</span>
                                        <span className="text-emerald-600">Führt zu...</span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-emerald-900 border-t border-emerald-200 pt-2">
                                        <span>Mehr Umsatz für Private Firmen</span>
                                        <span>+28%</span>
                                    </div>
                                    <div className="mt-3 text-sm text-emerald-800 italic">
                                        Warum? Konkurrenz belebt das Geschäft. Gute öffentliche News zwingen Private dazu, auch besser zu werden.
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <BookOpen className="text-blue-500" />
                                    Die "Wissens-Lücke" (Knowledge Gap)
                                </h3>
                                <p className="text-slate-700 mb-4">
                                    Wer weiß eigentlich, was in der Politik passiert?
                                </p>
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-100 rounded text-slate-700">
                                        <span className="block font-bold text-xs uppercase mb-1 text-slate-500">In den USA (Markt-System)</span>
                                        <span className="text-sm">Nur reiche Leute sind gut informiert. Arme Leute wissen oft wenig über Politik.</span>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded text-blue-900 border border-blue-100">
                                        <span className="block font-bold text-xs uppercase mb-1 text-blue-400">In Europa (Öffentliches System)</span>
                                        <span className="text-sm">Fast <strong>alle</strong> sind gut informiert, egal wie viel Geld sie haben. Öffentliche Medien machen schlau.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW: ANALYSE & FOLGEN */}
                {activeTab === 'analysis' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">

                        {/* Case Study: Privatisierung */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-red-50 p-6 border-b border-red-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <AlertTriangle className="text-red-600" />
                                    <h3 className="text-xl font-bold text-red-900">Die Privatisierungs-Falle</h3>
                                </div>
                                <p className="text-red-800 text-sm">Was passiert, wenn man Sender verkauft?</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-slate-700 leading-relaxed">
                                    Beispiele aus Frankreich und Neuseeland zeigen: Wenn ein Sender privatisiert wird, gibt es Probleme.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                        <TrendingDown className="text-red-500 shrink-0" size={24} />
                                        <span>
                                            <strong>Einheitsbrei:</strong> Private Sender kopieren sich gegenseitig. Alle zeigen das Gleiche (Krimis & Shows), weil das billig ist.
                                        </span>
                                    </li>
                                    <li className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                        <TrendingDown className="text-red-500 shrink-0" size={24} />
                                        <span>
                                            <strong>Schlechte News:</strong> Statt Politik-Analysen gibt es Skandale und Verbrechen, um Zuschauer zu ködern.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Case Study: Staats-Intervention */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-amber-50 p-6 border-b border-amber-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldAlert className="text-amber-600" />
                                    <h3 className="text-xl font-bold text-amber-900">Der "Einschüchterungseffekt"</h3>
                                </div>
                                <p className="text-amber-800 text-sm">Wenn der Staat den Geldhahn zudreht</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-slate-700 leading-relaxed">
                                    Wenn Politiker direkt über das Budget entscheiden, werden Sender vorsichtig.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                        <TrendingDown className="text-amber-500 shrink-0" size={24} />
                                        <span>
                                            <strong>Budget als Waffe:</strong> In Dänemark wurden 20% gekürzt, weil Politiker die Meinung der Journalisten/innen nicht mochten.
                                        </span>
                                    </li>
                                    <li className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                        <TrendingDown className="text-amber-500 shrink-0" size={24} />
                                        <span>
                                            <strong>Angst:</strong> Journalisten/innen berichten nicht mehr kritisch, aus Angst, dass ihr Sender geschlossen wird (wie in Griechenland).
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Theory: Social Cohesion */}
                        <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-white/10 p-4 rounded-full">
                                    <Users size={40} className="text-blue-100" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Zusammenhalt vs. Spaltung</h3>
                                    <p className="text-blue-100 leading-relaxed mb-4 text-lg">
                                        Soziale Medien (TikTok, X) wollen oft, dass wir uns streiten, weil das Klicks bringt (<strong>Spaltung</strong>).
                                        <br /><br />
                                        Öffentliche Medien haben den Auftrag, alle Menschen zu informieren. Sie sorgen dafür, dass wir uns auf Fakten einigen können. Sie halten die Gesellschaft zusammen (<strong>Zusammenhalt</strong>).
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
};

export default App;