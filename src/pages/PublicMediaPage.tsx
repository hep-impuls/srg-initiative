import { useState, useEffect } from 'react';
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
    ExternalLink
} from 'lucide-react';

import { FocusRegion } from '@/components/FocusRegion';
import { useAudioDirector } from '@/hooks/useAudioDirector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SourceBadge } from '@/components/SourceBadge';
import { PageConfig, Source } from '@/types';
import { swissifyData } from '@/utils/textUtils';

interface PublicMediaPageProps {
    config: PageConfig;
}

// Source data mapping based on transcripts/public_media_sources.md
const sources: Source[] = swissifyData([
    {
        id: "1",
        text: "Cuts to funding: Denmark",
        details: "Studie zu Finanzierungskürzungen in Dänemark.",
        url: "https://www.mappingmediafreedom.org/2018/07/27/cuts-to-funding-threaten-the-future-of-denmarks-public-service-journalism/"
    },
    {
        id: "2",
        text: "Funding for NPR and PBS",
        details: "Beitrag zur US-Finanzierung von Public Media.",
        url: "https://cei.org/blog/lets-cut-the-cord-on-federal-funding-for-npr-and-pbs/"
    },
    {
        id: "3",
        text: "DR budget slashed",
        details: "Bericht über massive Budgetkürzungen beim dänischen Rundfunk.",
        url: "https://nordiskfilmogtvfond.com/news/stories/dr-budget-to-be-slashed-by-20"
    },
    {
        id: "4",
        text: "Media's coverage & Polarization",
        details: "Forschung zu Medienberichterstattung und politischer Polarisierung.",
        url: "https://journalistsresource.org/politics-and-government/medias-coverage-political-polarization-affects-voter-attitudes/"
    },
    {
        id: "5",
        text: "Media System & Democracy",
        details: "Vergleichende Studie zu Mediensystemen und öffentlichem Wissen.",
        url: "https://www.researchgate.net/publication/237431069_Media_System_Public_Knowledge_and_DemocracyA_Comparative_Study"
    },
    {
        id: "6",
        text: "Public financing of news media (EU)",
        details: "Bericht zur öffentlichen Finanzierung von Nachrichtenmedien in der EU.",
        url: "https://www.europarl.europa.eu/meetdocs/2014_2019/plmrep/COMMITTEES/CULT/DV/2024/04-09/PublicfinancingofnewsmediaintheEU_EN.pdf"
    },
    {
        id: "7",
        text: "BBC Licence Fee Model",
        details: "Artikel zur Zukunft des BBC-Finanzierungsmodells.",
        url: "https://www.theguardian.com/media/2026/jan/26/bbc-tim-davie-licence-fee-funding-model"
    },
    {
        id: "8",
        text: "BBC Licence Fee Increase",
        details: "Hintergrund zur Erhöhung der BBC-Gebühren.",
        url: "https://www.publicmediaalliance.org/licence-fee-increase-for-the-bbc/"
    },
    {
        id: "9",
        text: "BBC Royal Charter Review",
        details: "Regierungsdokument zur Überprüfung der BBC-Charta.",
        url: "https://www.gov.uk/government/consultations/britains-story-the-next-chapter-the-bbc-royal-charter-review-green-paper-and-public-consultation/britains-story-the-next-chapter-bbc-royal-charter-review-green-paper-and-public-consultation"
    },
    {
        id: "10",
        text: "UK Parliament: Future of BBC",
        details: "Parlamentarischer Bericht zur Zukunft der BBC.",
        url: "https://commonslibrary.parliament.uk/research-briefings/cbp-10050/"
    },
    {
        id: "11",
        text: "EBU: Public Funding",
        details: "EBU-Analyse zur öffentlichen Finanzierung von Medien.",
        url: "https://www.ebu.ch/files/live/sites/ebu/files/Publications/EBU-Legal-Focus-Pub-Fund_EN.pdf"
    },
    {
        id: "12",
        text: "Reuters Report 2024 (Germany)",
        details: "Analyse der Nachrichtennutzung in Deutschland.",
        url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2024/germany"
    },
    {
        id: "13",
        text: "NHK Receiving Fee (Japan)",
        details: "Informationen zum japanischen Gebührensystem.",
        url: "https://www.nhk-cs.jp/jushinryo/multilingual/english/"
    },
    {
        id: "14",
        text: "Japan: NHK Fees Critique",
        details: "Kritische Meinung zu den NHK-Gebühren in Japan.",
        url: "https://japantoday.com/category/features/opinions/japan-nhk-fees-in-2025-harassment-disguised-as-public-service"
    },
    {
        id: "15",
        text: "NHK Fees Explained",
        details: "Erklärung des japanischen Mediensystems.",
        url: "https://blog.gaijinpot.com/nhk-fees-in-japan-explained/"
    },
    {
        id: "16",
        text: "Public Service Media Policy",
        details: "Policy Briefs der British Academy zu Public Service Media.",
        url: "https://www.thebritishacademy.ac.uk/documents/6012/Public_Service_Media_Policy_Briefs.pdf"
    },
    {
        id: "17",
        text: "Change for Danish Broadcaster",
        details: "Hintergrund zum Wandel des dänischen Rundfunks.",
        url: "https://www.publicmediaalliance.org/drastic-change-ahead-for-danish-public-broadcaster/"
    },
    {
        id: "18",
        text: "Denmark: Journalisten threatened",
        details: "Bericht über die Auswirkungen von Kürzungen in Dänemark.",
        url: "https://www.indexoncensorship.org/2018/07/denmark-cuts-to-funding-threaten-the-future-of-public-service-journalism/"
    },
    {
        id: "19",
        text: "Reform: French Public Media",
        details: "Informationen zur Reform der Medienfinanzierung in Frankreich.",
        url: "https://entreprendre.service-public.gouv.fr/actualites/A18046?lang=en"
    },
    {
        id: "20",
        text: "Audiovisual Reform France",
        details: "Details zur französischen Rundfunkreform.",
        url: "https://www.culture.gouv.fr/Media/Thematiques/Audiovisuel/Reform-of-the-funding-of-public-broadcasting2"
    },
    {
        id: "21",
        text: "History of US Public Media",
        details: "Rückblick auf die Geschichte von PBS and NPR.",
        url: "https://www.pbs.org/newshour/show/a-look-at-the-history-of-public-media-in-the-u-s-as-republicans-target-federal-funding"
    },
    {
        id: "22",
        text: "CPB Funding Cuts Impact",
        details: "Analyse der Auswirkungen von Budgetkürzungen bei der CPB.",
        url: "https://current.org/2025/02/why-the-impact-of-cpb-funding-cuts-may-not-be-equal/"
    },
    {
        id: "23",
        text: "French Private Television",
        details: "Wissenschaftliche Arbeit zur Etablierung des Privatfernsehens in Frankreich.",
        url: "https://business.columbia.edu/sites/default/files-efs/imce-uploads/CITI/Working%20Papers/Working%20Papers%20T/The%20Establishment%20of%20French%20Private%20Television.pdf"
    },
    {
        id: "24",
        text: "TF1 (France)",
        details: "Informationen zum ehemals öffentlichen Sender TF1.",
        url: "https://en.wikipedia.org/wiki/TF1"
    },
    {
        id: "25",
        text: "Place for Public Service TV?",
        details: "Bericht des Reuters Institute zur Relevanz von Public Service TV.",
        url: "https://reutersinstitute.politics.ox.ac.uk/sites/default/files/2017-11/Is%20There%20Still%20a%20Place%20for%20Public%20Service%20Television.pdf"
    },
    {
        id: "26",
        text: "NZ Public Service TV",
        details: "Ressourcen zum öffentlich-rechtlichen Fernsehen in Neuseeland.",
        url: "https://www.betterpublicmedia.org.nz/resources/public-service-tv-channel"
    },
    {
        id: "27",
        text: "Media Environment NZ",
        details: "Studie zum neuseeländischen Medienmarkt.",
        url: "https://www.researchbank.ac.nz/server/api/core/bitstreams/85db6735-c7f1-41a8-b74c-5bcfd96be2f4/content"
    },
    {
        id: "28",
        text: "TV in a Small Country (NZ)",
        details: "Analyse des neuseeländischen Medienexperiments.",
        url: "https://www.flowjournal.org/2009/05/public-television-in-a-small-country-the-new-zealand-%E2%80%98experiment%E2%80%99-20-years-on%C2%A0%C2%A0trisha-dunleavy%C2%A0%C2%A0victoria-university-of-wellington%C2%A0%C2%A0/"
    },
    {
        id: "29",
        text: "RNZ-TVNZ Merger Issue",
        details: "Artikel zur gescheiterten Fusion von RNZ und TVNZ.",
        url: "https://www.1news.co.nz/2023/01/31/media-marriage-on-the-rocks-public-weigh-in-on-rnz-tvnz-merger/"
    },
    {
        id: "30",
        text: "Independent Journalism: Greece",
        details: "Bericht zur Unabhängigkeit des Journalismus in Griechenland.",
        url: "https://www.opensocietyfoundations.org/uploads/7aa33e1e-6d0a-4739-94da-42eef04c316f/media-policy-independent-journalism-greece-20150511.pdf"
    },
    {
        id: "31",
        text: "Amnesty: Greece Broadcaster",
        details: "Stellungnahme von Amnesty International zur Schließung des griechischen Staatsfunks.",
        url: "https://www.amnesty.org/fr/wp-content/uploads/2021/06/eur250092013en.pdf"
    },
    {
        id: "32",
        text: "Media Freedom in Greece",
        details: "Human Rights Watch Bericht zur Pressefreiheit in Griechenland.",
        url: "https://www.hrw.org/report/2025/05/08/bad-worse/deterioration-media-freedom-greece"
    },
    {
        id: "33",
        text: "Crowding Out Myth (EBU)",
        details: "Beitrag zur Debatte über die Verdrängung privater Medien durch die EBU.",
        url: "https://www.ebu.ch/news/2025/06/public-service-media-online-news-and-the-crowding-out-myth"
    },
    {
        id: "34",
        text: "Debunking Crowding Out",
        details: "Ausführliche EBU-Studie zur Marktbeeinflussung durch öffentliche Medien.",
        url: "https://www.ebu.ch/Publications/Reports/open/EBU_Study-debunking-crowding-out-Full-report.pdf"
    },
    {
        id: "35",
        text: "PSM and Market Performance",
        details: "Wissenschaftliche Studie zur Marktperformance von Public Service Media.",
        url: "https://www.tandfonline.com/doi/full/10.1080/14241277.2026.2617532"
    },
    {
        id: "36",
        text: "Cross-National Study (Stanford)",
        details: "Studie der Stanford University zum internationalen Medienvergleich.",
        url: "https://pcl.sites.stanford.edu/sites/g/files/sbiybj22066/files/media/file/iyengar-cross-national_0.pdf"
    },
    {
        id: "37",
        text: "EJC Media Systems",
        details: "Vergleich europäischer Nachrichtensysteme durch das EJC.",
        url: "https://www.hssaatio.fi/images/stories/tiedostot/EJC_2009.pdf"
    },
    {
        id: "38",
        text: "PSM and Social Cohesion",
        details: "Forschungsbericht zum Beitrag öffentlicher Medien zum sozialen Zusammenhalt.",
        url: "https://www.tandfonline.com/doi/full/10.1080/10584609.2024.2423093"
    },
    {
        id: "39",
        text: "Bang for our buck (Canada)",
        details: "Studie zum wirtschaftlichen und gesellschaftlichen Wert von Public Media.",
        url: "https://www.policyalternatives.ca/wp-content/uploads/2025/02/bang-for-our-buck.pdf"
    },
    {
        id: "40",
        text: "Reuters Report 2024 (USA)",
        details: "Nachrichtennutzung und Vertrauen in den USA.",
        url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2024/united-states"
    },
    {
        id: "41",
        text: "Digital News Report 2024",
        details: "Zentrale Ergebnisse des Reuters Digital News Report 2024.",
        url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2024"
    }
]);

// Daten für Berufsschüler (B1 Niveau)
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
        refs: ["6", "11", "12"],
        image: 'img/public_media/1.png',
        imageAlt: 'Mauer zwischen Politik und Geld'
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
        refs: ["11", "16", "39"],
        image: 'img/public_media/2.png',
        imageAlt: 'Der gesicherte Geld-Topf'
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
        refs: ["7", "8", "9", "10"],
        image: 'img/public_media/3.png',
        imageAlt: 'Das schmelzende Budget'
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
        refs: ["13", "14", "15"]
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
        refs: ["1", "3", "17", "18"],
        image: 'img/public_media/4.png',
        imageAlt: 'Das Budget als Waffe'
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
        refs: ["19", "20", "23", "24"]
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
        refs: ["2", "21", "22", "40"],
        image: 'img/public_media/5.png',
        imageAlt: 'Nachrichten-Wüste'
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
        refs: ["30", "31", "32", "41"],
        image: 'img/public_media/6.png',
        imageAlt: 'Schwarzer Bildschirm'
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
        refs: ["26", "27", "28", "29"]
    }
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

    // Fallback to manual control if no audio or audio paused
    const [manualTab, setManualTab] = useState<'intro' | 'map' | 'compare' | 'analysis'>('intro');
    const activeTab = directorState.audioState.isPlaying
        ? (directorState.currentTab || manualTab)
        : manualTab;

    const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

    // Sync manual tab when director changes tab
    useEffect(() => {
        if (directorState.currentTab && directorState.audioState.isPlaying) {
            setManualTab(directorState.currentTab as any);
        }
    }, [directorState.currentTab, directorState.audioState.isPlaying]);

    // Sync selected country with audio focus
    useEffect(() => {
        if (directorState.activeElementId && directorState.activeElementId.startsWith('country_')) {
            const countryId = directorState.activeElementId.replace('country_', '');
            const country = countryData.find(c => c.id === countryId);
            if (country) {
                setSelectedCountry(country);
            }
        }
    }, [directorState.activeElementId]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">

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
                            { id: 'intro', label: 'Einstieg', icon: Info },
                            { id: 'map', label: 'Länder-Übersicht', icon: Globe },
                            { id: 'compare', label: 'Vergleich', icon: TrendingUp },
                            { id: 'analysis', label: 'Folgen & Analyse', icon: BookOpen }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setManualTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
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
                            <FocusRegion id="public_media__hero__card_map" label="Karte-Karte" className="group cursor-pointer">
                                <div onClick={() => setManualTab('map')} className="h-full bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Globe size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Reise um die Welt</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Wie funktionieren Mediensysteme in Finnland, den USA oder Griechenland? Ein direkter Vergleich der Modelle.
                                    </p>
                                </div>
                            </FocusRegion>

                            <FocusRegion id="public_media__hero__card_compare" label="Muster-Karte" className="group cursor-pointer">
                                <div onClick={() => setManualTab('compare')} className="h-full bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Muster erkennen</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Gibt es einen Zusammenhang zwischen Finanzierung und Vertrauen? Die Daten zeigen ein klares Bild.
                                    </p>
                                </div>
                            </FocusRegion>

                            <FocusRegion id="public_media__hero__card_analysis" label="Folgen-Karte" className="group cursor-pointer">
                                <div onClick={() => setManualTab('analysis')} className="h-full bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Konsequenzen</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Was passiert, wenn Systeme kippen? Fallstudien zu Privatisierung und staatlicher Einflussnahme.
                                    </p>
                                </div>
                            </FocusRegion>
                        </div>
                    </div>
                )}

                {/* VIEW: LÄNDER MONITOR */}
                {activeTab === 'map' && (
                    <FocusRegion id="public_media__map" label="Länder-Übersicht" className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        {/* Sidebar List */}
                        <FocusRegion id="public_media__map__sidebar" label="Länder-Liste" className="lg:col-span-4 flex flex-col gap-2 h-full">
                            <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">Wähle ein Land</h3>
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
                        <FocusRegion id="public_media__map__detail" label="Detail-Ansicht" className="lg:col-span-8">
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
                                            So funktioniert das System
                                        </h3>
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="flex-1">
                                                <p className="text-slate-700 leading-relaxed text-lg mb-3">
                                                    {selectedCountry.description}
                                                </p>
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
                                            {selectedCountry.status === 'sicher' ? 'Warum es gut funktioniert:' : 'Das größte Problem:'}
                                        </h3>
                                        <p className={`text-sm ${selectedCountry.status === 'sicher' ? 'text-emerald-800' : 'text-red-800'}`}>
                                            {selectedCountry.risks}
                                        </p>
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
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Je unabhängiger, desto mehr Vertrauen</h2>
                                <p className="text-slate-600 text-lg">
                                    Die Grafik zeigt: Wenn das Geld sicher ist (unabhängig von Politikern), dann <strong>vertrauen</strong> die Menschen den Nachrichten mehr.
                                    Wenn das Geld direkt vom Staat oder von Werbung kommt, ist das Vertrauen geringer.
                                </p>
                                <SourceBadge ids={["12", "39", "40"]} />
                            </FocusRegion>

                            {/* Chart Visualization */}
                            <FocusRegion id="public_media__compare__chart" label="Vertrauens-Chart" className="relative h-80 flex items-end justify-between gap-4 px-4 pb-8 border-b border-slate-200">
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
                            </FocusRegion>
                        </FocusRegion>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FocusRegion id="public_media__compare__myth" label="Mythos-Check" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
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
                                    <SourceBadge ids={["33", "34", "35"]} />
                                </div>
                            </FocusRegion>

                            <FocusRegion id="public_media__compare__gap" label="Wissens-Lücke" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
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
                                    <SourceBadge ids={["5", "36", "37"]} />
                                </div>
                            </FocusRegion>
                        </div>
                    </FocusRegion>
                )}

                {/* VIEW: ANALYSE & FOLGEN */}
                {activeTab === 'analysis' && (
                    <FocusRegion id="public_media__analysis" label="Folgen & Analyse" className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">

                        {/* Case Study: Privatisierung */}
                        <FocusRegion id="public_media__analysis__privatization" label="Fallstudie Privatisierung" className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
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
                                <SourceBadge ids={["23", "24", "25", "26", "27"]} />
                            </div>
                        </FocusRegion>

                        {/* Case Study: Staats-Intervention */}
                        <FocusRegion id="public_media__analysis__intervention" label="Fallstudie Staatsdruck" className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-amber-50 p-6 border-b border-amber-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldAlert className="text-amber-600" />
                                    <h3 className="text-xl font-bold text-amber-900">Der "Einschüchterungseffekt"</h3>
                                </div>
                                <p className="text-amber-800 text-sm">Wenn der Staat den Geldhahn zudreht</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-slate-700 leading-relaxed">
                                    Wenn Politiker/innen direkt über das Budget entscheiden, werden Sender vorsichtig.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                        <TrendingDown className="text-amber-500 shrink-0" size={24} />
                                        <span>
                                            <strong>Budget als Waffe:</strong> In Dänemark wurden 20% gekürzt, weil Politiker/innen die Meinung der Journalisten/innen nicht mochten.
                                        </span>
                                    </li>
                                    <li className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded">
                                        <TrendingDown className="text-amber-500 shrink-0" size={24} />
                                        <span>
                                            <strong>Angst:</strong> Journalisten/innen berichten nicht mehr kritisch, aus Angst, dass ihr Sender geschlossen wird (wie in Griechenland).
                                        </span>
                                    </li>
                                </ul>
                                <SourceBadge ids={["1", "3", "30", "31"]} />
                            </div>
                        </FocusRegion>

                        {/* Theory: Social Cohesion */}
                        <FocusRegion id="public_media__analysis__cohesion" label="Zusammenhalt" className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-8">
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
                                    <SourceBadge ids={["4", "38"]} />
                                </div>
                            </div>
                        </FocusRegion>
                    </FocusRegion>
                )}

                {/* Footer with Sources List */}
                <div id="quellen" className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Quellenverzeichnis
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
            />
        </div>
    );
};