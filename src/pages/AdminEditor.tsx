import { useState, useEffect } from 'react';
import { Download, FileText, Globe, MessageSquare, TrendingUp, BookOpen, Layers } from 'lucide-react';
import agoraContent from '@/data/content/agora-text.json';
import publicMediaContent from '@/data/content/publicmedia-text.json';

type TabType = 'agora' | 'publicMedia' | 'interactions';

export function AdminEditor() {
    const [activeTab, setActiveTab] = useState<TabType>('agora');
    const [agoraData, setAgoraData] = useState(JSON.parse(JSON.stringify(agoraContent)));
    const [publicMediaData, setPublicMediaData] = useState(JSON.parse(JSON.stringify(publicMediaContent)));

    const downloadJSON = (data: any, filename: string) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Editor</h1>
                    <p className="text-slate-600">
                        Bearbeite die Texte für die Agora- und Public Media-Seiten sowie die Interaktionsdateien.
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                    <div className="flex border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('agora')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'agora'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            Agora Content
                        </button>
                        <button
                            onClick={() => setActiveTab('publicMedia')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'publicMedia'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <Globe className="w-5 h-5" />
                            Public Media Content
                        </button>
                        <button
                            onClick={() => setActiveTab('interactions')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'interactions'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            Interaction Files
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'agora' && (
                            <AgoraEditor data={agoraData} setData={setAgoraData} onDownload={() => downloadJSON(agoraData, 'agora-text.json')} />
                        )}
                        {activeTab === 'publicMedia' && (
                            <PublicMediaEditor data={publicMediaData} setData={setPublicMediaData} onDownload={() => downloadJSON(publicMediaData, 'publicmedia-text.json')} />
                        )}
                        {activeTab === 'interactions' && (
                            <InteractionsEditor />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Agora Editor Component
function AgoraEditor({ data, setData, onDownload }: { data: any; setData: (data: any) => void; onDownload: () => void }) {
    const updateSource = (index: number, field: string, value: string) => {
        const newData = { ...data };
        newData.sources[index][field] = value;
        setData(newData);
    };

    const updateNestedField = (path: string[], value: any) => {
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setData(newData);
    };

    const updateArrayField = (path: string[], index: number, value: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < path.length; i++) {
            current = current[path[i]];
        }
        current[index] = value;
        setData(newData);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-4 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Agora Page Content</h2>
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Download JSON
                </button>
            </div>

            {/* Header Section */}
            <Section title="Header & Titles" icon={<FileText className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Page Title" value={data.header.title} onChange={(val: string) => updateNestedField(['header', 'title'], val)} />
                    <Field label="Page Subtitle" value={data.header.subtitle} onChange={(val: string) => updateNestedField(['header', 'subtitle'], val)} isTextarea />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Field label="Modal: Pre-Quiz" value={data.modalTitles.pre} onChange={(val: string) => updateNestedField(['modalTitles', 'pre'], val)} />
                    <Field label="Modal: Theory/Data" value={data.modalTitles.theoryData} onChange={(val: string) => updateNestedField(['modalTitles', 'theoryData'], val)} />
                    <Field label="Modal: Data/Consequences" value={data.modalTitles.dataConsequences} onChange={(val: string) => updateNestedField(['modalTitles', 'dataConsequences'], val)} />
                    <Field label="Modal: Post-Quiz" value={data.modalTitles.post} onChange={(val: string) => updateNestedField(['modalTitles', 'post'], val)} />
                    <Field label="Modal: Master Quiz" value={data.modalTitles.master} onChange={(val: string) => updateNestedField(['modalTitles', 'master'], val)} />
                </div>
            </Section>

            {/* Tabs Section */}
            <Section title="Navigation Tabs" icon={<Globe className="w-5 h-5" />}>
                <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(data.tabs).map(([key, tab]: [string, any]) => (
                        <div key={key} className="space-y-2 p-3 bg-white rounded border border-slate-200 shadow-sm">
                            <span className="text-xs font-bold uppercase text-slate-400">{key}</span>
                            <Field label="Label" value={tab.label} onChange={(val: string) => updateNestedField(['tabs', key, 'label'], val)} />
                            <Field label="Sublabel" value={tab.sublabel} onChange={(val: string) => updateNestedField(['tabs', key, 'sublabel'], val)} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Sources Section */}
            <Section title={`Sources (${data.sources.length})`} icon={<Layers className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.sources.map((source: any, index: number) => (
                        <div key={source.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">Source {source.id}</span>
                            <div className="space-y-3">
                                <Field label="Text" value={source.text} onChange={(val: string) => updateSource(index, 'text', val)} />
                                <Field label="Details" value={source.details} onChange={(val: string) => updateSource(index, 'details', val)} isTextarea />
                                <Field label="URL" value={source.url} onChange={(val: string) => updateSource(index, 'url', val)} />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Sections Content */}
            <Section title="Page Sections" icon={<MessageSquare className="w-5 h-5" />}>
                <div className="space-y-8">
                    {/* Theory Intro */}
                    <SectionBox title="1. Theory Intro (Intro-Text)">
                        <Field label="Heading" value={data.sections.theoryIntro.heading} onChange={(val: string) => updateNestedField(['sections', 'theoryIntro', 'heading'], val)} />
                        <Field label="Text" value={data.sections.theoryIntro.text} onChange={(val: string) => updateNestedField(['sections', 'theoryIntro', 'text'], val)} isTextarea />
                    </SectionBox>

                    {/* Comparison */}
                    <SectionBox title="2. Comparison (Lagerfeuer vs. Tunnel)">
                        <Field label="Heading" value={data.sections.comparison.heading} onChange={(val: string) => updateNestedField(['sections', 'comparison', 'heading'], val)} />
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                <h4 className="font-bold text-orange-900 mb-3 underline">Lagerfeuer (Mass Media)</h4>
                                <Field label="Title" value={data.sections.comparison.campfire.title} onChange={(val: string) => updateNestedField(['sections', 'comparison', 'campfire', 'title'], val)} />
                                <Field label="Subtitle" value={data.sections.comparison.campfire.subtitle} onChange={(val: string) => updateNestedField(['sections', 'comparison', 'campfire', 'subtitle'], val)} />
                                <div className="mt-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Points</label>
                                    {data.sections.comparison.campfire.points.map((p: string, i: number) => (
                                        <input key={i} className="w-full px-3 py-2 border border-slate-300 rounded-md mb-2 text-sm" value={p} onChange={(e) => updateArrayField(['sections', 'comparison', 'campfire', 'points'], i, e.target.value)} />
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 mb-3 underline">Tunnel (Platforms)</h4>
                                <Field label="Title" value={data.sections.comparison.tunnel.title} onChange={(val: string) => updateNestedField(['sections', 'comparison', 'tunnel', 'title'], val)} />
                                <Field label="Subtitle" value={data.sections.comparison.tunnel.subtitle} onChange={(val: string) => updateNestedField(['sections', 'comparison', 'tunnel', 'subtitle'], val)} />
                                <div className="mt-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Points</label>
                                    {data.sections.comparison.tunnel.points.map((p: string, i: number) => (
                                        <input key={i} className="w-full px-3 py-2 border border-slate-300 rounded-md mb-2 text-sm" value={p} onChange={(e) => updateArrayField(['sections', 'comparison', 'tunnel', 'points'], i, e.target.value)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionBox>

                    {/* Agora */}
                    <SectionBox title="3. Agora Section">
                        <Field label="Heading" value={data.sections.agora.heading} onChange={(val: string) => updateNestedField(['sections', 'agora', 'heading'], val)} />
                        <Field label="Text 1" value={data.sections.agora.text1} onChange={(val: string) => updateNestedField(['sections', 'agora', 'text1'], val)} isTextarea />
                        <Field label="Text 2" value={data.sections.agora.text2} onChange={(val: string) => updateNestedField(['sections', 'agora', 'text2'], val)} isTextarea />
                        <div className="grid md:grid-cols-2 gap-4">
                            <Field label="Comparison Before" value={data.sections.agora.comparisonBefore} onChange={(val: string) => updateNestedField(['sections', 'agora', 'comparisonBefore'], val)} />
                            <Field label="Comparison Today" value={data.sections.agora.comparisonToday} onChange={(val: string) => updateNestedField(['sections', 'agora', 'comparisonToday'], val)} />
                        </div>
                    </SectionBox>

                    {/* Simple Sections (Gatekeeper, Algorithm, Attention) */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <SectionBox title="Gatekeeper">
                            <Field label="Heading" value={data.sections.gatekeeper.heading} onChange={(val: string) => updateNestedField(['sections', 'gatekeeper', 'heading'], val)} />
                            <Field label="Text" value={data.sections.gatekeeper.text} onChange={(val: string) => updateNestedField(['sections', 'gatekeeper', 'text'], val)} isTextarea />
                        </SectionBox>
                        <SectionBox title="Algorithm">
                            <Field label="Heading" value={data.sections.algorithm.heading} onChange={(val: string) => updateNestedField(['sections', 'algorithm', 'heading'], val)} />
                            <Field label="Text" value={data.sections.algorithm.text} onChange={(val: string) => updateNestedField(['sections', 'algorithm', 'text'], val)} isTextarea />
                        </SectionBox>
                        <SectionBox title="Attention">
                            <Field label="Heading" value={data.sections.attention.heading} onChange={(val: string) => updateNestedField(['sections', 'attention', 'heading'], val)} />
                            <Field label="Text" value={data.sections.attention.text} onChange={(val: string) => updateNestedField(['sections', 'attention', 'text'], val)} isTextarea />
                        </SectionBox>
                    </div>

                    {/* Data Overview */}
                    <SectionBox title="4. Data Overview">
                        <Field label="Heading" value={data.sections.dataOverview.heading} onChange={(val: string) => updateNestedField(['sections', 'dataOverview', 'heading'], val)} />
                        <Field label="Text" value={data.sections.dataOverview.text} onChange={(val: string) => updateNestedField(['sections', 'dataOverview', 'text'], val)} isTextarea />
                    </SectionBox>

                    {/* Data Stats */}
                    <SectionBox title="5. Data Stats (Lower Section)">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Field label="Chart Heading" value={data.sections.dataStats.chartHeading} onChange={(val: string) => updateNestedField(['sections', 'dataStats', 'chartHeading'], val)} />
                                <Field label="TikTok Heading" value={data.sections.dataStats.tiktokHeading} onChange={(val: string) => updateNestedField(['sections', 'dataStats', 'tiktokHeading'], val)} />
                                <Field label="TikTok Text" value={data.sections.dataStats.tiktokText} onChange={(val: string) => updateNestedField(['sections', 'dataStats', 'tiktokText'], val)} isTextarea />
                            </div>
                            <div className="space-y-4">
                                <Field label="Bildungskluft Heading" value={data.sections.dataStats.bildungskluftHeading} onChange={(val: string) => updateNestedField(['sections', 'dataStats', 'bildungskluftHeading'], val)} />
                                <Field label="Bildungskluft Text" value={data.sections.dataStats.bildungskluftText} onChange={(val: string) => updateNestedField(['sections', 'dataStats', 'bildungskluftText'], val)} isTextarea />
                            </div>
                        </div>
                    </SectionBox>

                    {/* TikTok Problem */}
                    <SectionBox title="6. TikTok 15s Problem">
                        <Field label="Heading" value={data.sections.tiktokProblem.heading} onChange={(val: string) => updateNestedField(['sections', 'tiktokProblem', 'heading'], val)} />
                        <Field label="Text 1" value={data.sections.tiktokProblem.text1} onChange={(val: string) => updateNestedField(['sections', 'tiktokProblem', 'text1'], val)} isTextarea />
                        <Field label="Text 2" value={data.sections.tiktokProblem.text2} onChange={(val: string) => updateNestedField(['sections', 'tiktokProblem', 'text2'], val)} isTextarea />
                        <Field label="Callout (Yellow Box)" value={data.sections.tiktokProblem.callout} onChange={(val: string) => updateNestedField(['sections', 'tiktokProblem', 'callout'], val)} />
                    </SectionBox>

                    {/* Money Flow */}
                    <SectionBox title="7. Money Flow (Teufelskreis)">
                        <Field label="Heading" value={data.sections.moneyFlow.heading} onChange={(val: string) => updateNestedField(['sections', 'moneyFlow', 'heading'], val)} />
                        <Field label="Text 1" value={data.sections.moneyFlow.text1} onChange={(val: string) => updateNestedField(['sections', 'moneyFlow', 'text1'], val)} isTextarea />
                        <Field label="Text 2" value={data.sections.moneyFlow.text2} onChange={(val: string) => updateNestedField(['sections', 'moneyFlow', 'text2'], val)} isTextarea />
                        <Field label="Callout (Equation)" value={data.sections.moneyFlow.callout} onChange={(val: string) => updateNestedField(['sections', 'moneyFlow', 'callout'], val)} />
                    </SectionBox>

                    {/* Consequences */}
                    <SectionBox title="8. Consequences (Democratic Risks)">
                        <Field label="Heading" value={data.sections.consequencesIntro.heading} onChange={(val: string) => updateNestedField(['sections', 'consequencesIntro', 'heading'], val)} />
                        <Field label="Text" value={data.sections.consequencesIntro.text} onChange={(val: string) => updateNestedField(['sections', 'consequencesIntro', 'text'], val)} isTextarea />
                        <div className="grid md:grid-cols-3 gap-4 mt-6">
                            {Object.entries(data.sections.consequenceCards).map(([key, card]: [string, any]) => (
                                <div key={key} className="p-3 bg-white rounded border border-slate-200">
                                    <span className="text-xs font-bold uppercase text-slate-400">{key}</span>
                                    <Field label="Heading" value={card.heading} onChange={(val: string) => updateNestedField(['sections', 'consequenceCards', key, 'heading'], val)} />
                                    <Field label="Text" value={card.text} onChange={(val: string) => updateNestedField(['sections', 'consequenceCards', key, 'text'], val)} isTextarea />
                                </div>
                            ))}
                        </div>
                    </SectionBox>

                    {/* Agenda Setting */}
                    <SectionBox title="9. Agenda Setting">
                        <Field label="Heading" value={data.sections.agenda.heading} onChange={(val: string) => updateNestedField(['sections', 'agenda', 'heading'], val)} />
                        <Field label="Text" value={data.sections.agenda.text} onChange={(val: string) => updateNestedField(['sections', 'agenda', 'text'], val)} isTextarea />
                        <Field label="Quote" value={data.sections.agenda.quote} onChange={(val: string) => updateNestedField(['sections', 'agenda', 'quote'], val)} isTextarea />
                    </SectionBox>

                    {/* Final Question */}
                    <SectionBox title="10. Final Question">
                        <Field label="Heading" value={data.sections.finalQuestion.heading} onChange={(val: string) => updateNestedField(['sections', 'finalQuestion', 'heading'], val)} />
                        <Field label="Text" value={data.sections.finalQuestion.text} onChange={(val: string) => updateNestedField(['sections', 'finalQuestion', 'text'], val)} isTextarea />
                        <div className="mt-3">
                            <label className="text-xs font-bold text-slate-500 uppercase">Options</label>
                            {data.sections.finalQuestion.options.map((o: string, i: number) => (
                                <input key={i} className="w-full px-3 py-2 border border-slate-300 rounded-md mb-2 text-sm" value={o} onChange={(e) => updateArrayField(['sections', 'finalQuestion', 'options'], i, e.target.value)} />
                            ))}
                        </div>
                    </SectionBox>
                </div>
            </Section>

            {/* Footer Section */}
            <Section title="Footer" icon={<Layers className="w-5 h-5" />}>
                <Field label="Sources Heading" value={data.footer.sourcesHeading} onChange={(val: string) => updateNestedField(['footer', 'sourcesHeading'], val)} />
            </Section>
        </div>
    );
}

// Public Media Editor Component
function PublicMediaEditor({ data, setData, onDownload }: { data: any; setData: (data: any) => void; onDownload: () => void }) {
    const updateSource = (index: number, field: string, value: string) => {
        const newData = { ...data };
        newData.sources[index][field] = value;
        setData(newData);
    };

    const updateCountry = (index: number, field: string, value: any) => {
        const newData = { ...data };
        newData.countryData[index][field] = value;
        setData(newData);
    };

    const updateNestedField = (path: string[], value: any) => {
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setData(newData);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-4 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Public Media Page Content</h2>
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Download JSON
                </button>
            </div>

            {/* Header Section */}
            <Section title="Header & Titles" icon={<Globe className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Page Title" value={data.header.title} onChange={(val: string) => updateNestedField(['header', 'title'], val)} />
                    <Field label="Page Subtitle" value={data.header.subtitle} onChange={(val: string) => updateNestedField(['header', 'subtitle'], val)} isTextarea />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Field label="Modal: Pre-Quiz" value={data.modalTitles.pre} onChange={(val: string) => updateNestedField(['modalTitles', 'pre'], val)} />
                    <Field label="Modal: Map Comparison" value={data.modalTitles.mapCompare} onChange={(val: string) => updateNestedField(['modalTitles', 'mapCompare'], val)} />
                    <Field label="Modal: Post-Quiz" value={data.modalTitles.post} onChange={(val: string) => updateNestedField(['modalTitles', 'post'], val)} />
                    <Field label="Modal: Master Quiz" value={data.modalTitles.master} onChange={(val: string) => updateNestedField(['modalTitles', 'master'], val)} />
                </div>
            </Section>

            {/* Hero Section */}
            <Section title="Hero Intro" icon={<Layers className="w-5 h-5" />}>
                <SectionBox title="Hero Card">
                    <Field label="Badge" value={data.hero.badge} onChange={(val: string) => updateNestedField(['hero', 'badge'], val)} />
                    <Field label="Heading" value={data.hero.heading} onChange={(val: string) => updateNestedField(['hero', 'heading'], val)} />
                    <Field label="Text" value={data.hero.text} onChange={(val: string) => updateNestedField(['hero', 'text'], val)} isTextarea />
                </SectionBox>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                    {Object.entries(data.heroCards).map(([key, card]: [string, any]) => (
                        <SectionBox key={key} title={`Card: ${key}`}>
                            <Field label="Heading" value={card.heading} onChange={(val: string) => updateNestedField(['heroCards', key, 'heading'], val)} />
                            <Field label="Text" value={card.text} onChange={(val: string) => updateNestedField(['heroCards', key, 'text'], val)} isTextarea />
                        </SectionBox>
                    ))}
                </div>
            </Section>

            {/* Sources Section */}
            <Section title={`Sources (${data.sources.length})`} icon={<FileText className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2">
                    {data.sources.map((source: any, index: number) => (
                        <div key={source.id || index} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">Source {source.id}</span>
                            <div className="space-y-3">
                                <Field label="Text" value={source.text} onChange={(val: string) => updateSource(index, 'text', val)} />
                                <Field label="Details" value={source.details} onChange={(val: string) => updateSource(index, 'details', val)} isTextarea />
                                <Field label="URL" value={source.url} onChange={(val: string) => updateSource(index, 'url', val)} />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Country Data */}
            <Section title={`Country Data (${data.countryData.length})`} icon={<Globe className="w-5 h-5" />}>
                <div className="space-y-6">
                    {data.countryData.map((country: any, index: number) => (
                        <div key={country.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                                <h4 className="font-bold text-slate-900 text-lg">{country.name} ({country.id})</h4>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${country.status === 'sicher' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    Status: {country.status}
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Field label="Name" value={country.name} onChange={(val: string) => updateCountry(index, 'name', val)} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Region" value={country.region} onChange={(val: string) => updateCountry(index, 'region', val)} />
                                        <Field label="Model" value={country.model} onChange={(val: string) => updateCountry(index, 'model', val)} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Field label="Stability" value={country.stability} onChange={(val: string) => updateCountry(index, 'stability', val)} />
                                        <Field label="Independence" value={country.independence} onChange={(val: string) => updateCountry(index, 'independence', val)} />
                                        <Field label="Trust Score" value={String(country.trustScore)} onChange={(val: string) => updateCountry(index, 'trustScore', Number(val))} />
                                    </div>
                                    <Field label="Funding Detail" value={country.fundingDetail} onChange={(val: string) => updateCountry(index, 'fundingDetail', val)} />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description (Bullet Points)</label>
                                        {country.description.map((desc: string, descIndex: number) => (
                                            <textarea
                                                key={descIndex}
                                                value={desc}
                                                onChange={(e) => {
                                                    const newDesc = [...country.description];
                                                    newDesc[descIndex] = e.target.value;
                                                    updateCountry(index, 'description', newDesc);
                                                }}
                                                rows={2}
                                                className="w-full px-3 py-2 mb-2 bg-white border border-slate-300 rounded-lg text-sm"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Risks (Bullet Points)</label>
                                        {country.risks.map((risk: string, riskIndex: number) => (
                                            <textarea
                                                key={riskIndex}
                                                value={risk}
                                                onChange={(e) => {
                                                    const newRisks = [...country.risks];
                                                    newRisks[riskIndex] = e.target.value;
                                                    updateCountry(index, 'risks', newRisks);
                                                }}
                                                rows={2}
                                                className="w-full px-3 py-2 mb-2 bg-white border border-slate-300 rounded-lg text-sm"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Comparison Section */}
            <Section title="Comparison (Unabhängigkeit & Vertrauen)" icon={<TrendingUp className="w-5 h-5" />}>
                <SectionBox title="Intro">
                    <Field label="Heading" value={data.comparison.heading} onChange={(val: string) => updateNestedField(['comparison', 'heading'], val)} />
                    <Field label="Text" value={data.comparison.text} onChange={(val: string) => updateNestedField(['comparison', 'text'], val)} isTextarea />
                    <Field label="Chart Label" value={data.comparison.chartLabel} onChange={(val: string) => updateNestedField(['comparison', 'chartLabel'], val)} />
                </SectionBox>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <SectionBox title="Myth Check">
                        <Field label="Heading" value={data.comparison.mythCheck.heading} onChange={(val: string) => updateNestedField(['comparison', 'mythCheck', 'heading'], val)} />
                        <Field label="Text" value={data.comparison.mythCheck.text} onChange={(val: string) => updateNestedField(['comparison', 'mythCheck', 'text'], val)} isTextarea />
                        <Field label="List Header" value={data.comparison.mythCheck.listHeader} onChange={(val: string) => updateNestedField(['comparison', 'mythCheck', 'listHeader'], val)} />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="List Result" value={data.comparison.mythCheck.listResult} onChange={(val: string) => updateNestedField(['comparison', 'mythCheck', 'listResult'], val)} />
                            <Field label="List Value" value={data.comparison.mythCheck.listValue} onChange={(val: string) => updateNestedField(['comparison', 'mythCheck', 'listValue'], val)} />
                        </div>
                        <Field label="Footer" value={data.comparison.mythCheck.footer} onChange={(val: string) => updateNestedField(['comparison', 'mythCheck', 'footer'], val)} isTextarea />
                    </SectionBox>
                    <SectionBox title="Knowledge Gap">
                        <Field label="Heading" value={data.comparison.knowledgeGap.heading} onChange={(val: string) => updateNestedField(['comparison', 'knowledgeGap', 'heading'], val)} />
                        <Field label="Text" value={data.comparison.knowledgeGap.text} onChange={(val: string) => updateNestedField(['comparison', 'knowledgeGap', 'text'], val)} isTextarea />
                        <div className="p-3 bg-red-50 rounded-lg space-y-2">
                            <Field label="USA Header" value={data.comparison.knowledgeGap.usaHeader} onChange={(val: string) => updateNestedField(['comparison', 'knowledgeGap', 'usaHeader'], val)} />
                            <Field label="USA Text" value={data.comparison.knowledgeGap.usaText} onChange={(val: string) => updateNestedField(['comparison', 'knowledgeGap', 'usaText'], val)} isTextarea />
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg space-y-2">
                            <Field label="Europe Header" value={data.comparison.knowledgeGap.europeHeader} onChange={(val: string) => updateNestedField(['comparison', 'knowledgeGap', 'europeHeader'], val)} />
                            <Field label="Europe Text" value={data.comparison.knowledgeGap.europeText} onChange={(val: string) => updateNestedField(['comparison', 'knowledgeGap', 'europeText'], val)} isTextarea />
                        </div>
                    </SectionBox>
                </div>
            </Section>

            {/* Analysis Section */}
            <Section title="Analysis (Folgen)" icon={<BookOpen className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-6">
                    <SectionBox title="Privatization">
                        <Field label="Heading" value={data.analysis.privatization.heading} onChange={(val: string) => updateNestedField(['analysis', 'privatization', 'heading'], val)} />
                        <Field label="Subheading" value={data.analysis.privatization.subheading} onChange={(val: string) => updateNestedField(['analysis', 'privatization', 'subheading'], val)} />
                        <Field label="Text" value={data.analysis.privatization.text} onChange={(val: string) => updateNestedField(['analysis', 'privatization', 'text'], val)} isTextarea />
                        <div className="mt-3 space-y-3">
                            {data.analysis.privatization.points.map((p: any, i: number) => (
                                <div key={i} className="p-2 bg-white rounded border border-slate-200">
                                    <Field label={`Point ${i + 1} Title`} value={p.title} onChange={(val: string) => {
                                        const newPoints = [...data.analysis.privatization.points];
                                        newPoints[i].title = val;
                                        updateNestedField(['analysis', 'privatization', 'points'], newPoints);
                                    }} />
                                    <Field label="Text" value={p.text} onChange={(val: string) => {
                                        const newPoints = [...data.analysis.privatization.points];
                                        newPoints[i].text = val;
                                        updateNestedField(['analysis', 'privatization', 'points'], newPoints);
                                    }} isTextarea />
                                </div>
                            ))}
                        </div>
                    </SectionBox>
                    <SectionBox title="Intervention">
                        <Field label="Heading" value={data.analysis.intervention.heading} onChange={(val: string) => updateNestedField(['analysis', 'intervention', 'heading'], val)} />
                        <Field label="Subheading" value={data.analysis.intervention.subheading} onChange={(val: string) => updateNestedField(['analysis', 'intervention', 'subheading'], val)} />
                        <Field label="Text" value={data.analysis.intervention.text} onChange={(val: string) => updateNestedField(['analysis', 'intervention', 'text'], val)} isTextarea />
                        <div className="mt-3 space-y-3">
                            {data.analysis.intervention.points.map((p: any, i: number) => (
                                <div key={i} className="p-2 bg-white rounded border border-slate-200">
                                    <Field label={`Point ${i + 1} Title`} value={p.title} onChange={(val: string) => {
                                        const newPoints = [...data.analysis.intervention.points];
                                        newPoints[i].title = val;
                                        updateNestedField(['analysis', 'intervention', 'points'], newPoints);
                                    }} />
                                    <Field label="Text" value={p.text} onChange={(val: string) => {
                                        const newPoints = [...data.analysis.intervention.points];
                                        newPoints[i].text = val;
                                        updateNestedField(['analysis', 'intervention', 'points'], newPoints);
                                    }} isTextarea />
                                </div>
                            ))}
                        </div>
                    </SectionBox>
                </div>
                <SectionBox title="Cohesion (Zusammenhalt)">
                    <Field label="Heading" value={data.analysis.cohesion.heading} onChange={(val: string) => updateNestedField(['analysis', 'cohesion', 'heading'], val)} />
                    <Field label="Text" value={data.analysis.cohesion.text} onChange={(val: string) => updateNestedField(['analysis', 'cohesion', 'text'], val)} isTextarea />
                </SectionBox>
            </Section>

            {/* Quiz & Footer */}
            <div className="grid md:grid-cols-2 gap-6">
                <SectionBox title="Quiz View">
                    <Field label="Heading" value={data.quizView.heading} onChange={(val: string) => updateNestedField(['quizView', 'heading'], val)} />
                    <Field label="Text" value={data.quizView.text} onChange={(val: string) => updateNestedField(['quizView', 'text'], val)} isTextarea />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Start Button" value={data.quizView.startButton} onChange={(val: string) => updateNestedField(['quizView', 'startButton'], val)} />
                        <Field label="Results Button" value={data.quizView.resultsButton} onChange={(val: string) => updateNestedField(['quizView', 'resultsButton'], val)} />
                    </div>
                </SectionBox>
                <SectionBox title="Footer">
                    <Field label="Sources Heading" value={data.footer.sourcesHeading} onChange={(val: string) => updateNestedField(['footer', 'sourcesHeading'], val)} />
                </SectionBox>
            </div>
        </div>
    );
}

// Helper Components
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h4>
            <div className="grid gap-4">{children}</div>
        </div>
    );
}

function Field({ label, value, onChange, isTextarea }: { label: string; value: string; onChange: (v: string) => void; isTextarea?: boolean }) {
    return (
        <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-tight">{label}</label>
            {isTextarea ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                />
            )}
        </div>
    );
}

// Interactions Editor Component
function InteractionsEditor() {
    const [interactions, setInteractions] = useState<Record<string, any>>({});
    const [selectedPage, setSelectedPage] = useState<'agora' | 'publicMedia' | 'demo'>('agora');
    const [loading, setLoading] = useState(true);

    // Load all interaction files
    useEffect(() => {
        const loadInteractions = async () => {
            const interactionFiles = [
                'agora-guess-money', 'agora-guess-tv', 'agora-intro-money', 'agora-intro-ranking',
                'agora-intro-scale-1', 'agora-intro-scale-2', 'agora-intro-scale-3', 'agora-intro-wordcloud-sub',
                'agora-outro-action', 'agora-outro-money-check', 'agora-outro-scale-1', 'agora-outro-scale-2',
                'agora-outro-scale-3', 'agora-outro-wordcloud-sub', 'agora-points-hypeman', 'agora-poll-slacktivism',
                'agora-quiz-gatekeeper', 'agora-quiz-tiktok', 'agora-ranking-history', 'agora-ranking-spiral',
                'agora-slider-fakenews', 'agora-slider-tunnel',
                'publicMedia-intro-funding-pre', 'publicMedia-intro-independence-slider', 'publicMedia-intro-priority-ranking',
                'publicMedia-map-points-safeguards', 'publicMedia-map-quiz-protection',
                'publicMedia-outro-action-ranking', 'publicMedia-outro-funding-post',
                'demo-guess', 'demo-points', 'demo-poll', 'demo-quiz', 'demo-ranking', 'demo-slider'
            ];

            const loaded: Record<string, any> = {};
            for (const file of interactionFiles) {
                try {
                    const module = await import(`@/data/interactions/${file}.json`);
                    loaded[file] = JSON.parse(JSON.stringify(module.default));
                } catch (error) {
                    console.error(`Failed to load ${file}:`, error);
                }
            }
            setInteractions(loaded);
            setLoading(false);
        };

        loadInteractions();
    }, []);

    const updateInteraction = (id: string, field: string, value: any) => {
        setInteractions((prev: Record<string, any>) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const updateOption = (id: string, optionIndex: number, field: string, value: any) => {
        setInteractions((prev: Record<string, any>) => ({
            ...prev,
            [id]: {
                ...prev[id],
                options: prev[id].options.map((opt: any, idx: number) =>
                    idx === optionIndex ? { ...opt, [field]: value } : opt
                )
            }
        }));
    };

    const downloadAllAsZip = async () => {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        // Add all interaction files to ZIP
        Object.entries(interactions).forEach(([filename, data]) => {
            zip.file(`${filename}.json`, JSON.stringify(data, null, 2));
        });

        // Generate and download ZIP
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'interactions.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-slate-600">Loading interactions...</div>
            </div>
        );
    }

    const pageInteractions = Object.entries(interactions).filter(([id]) => id.startsWith(selectedPage));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Interaction Files Editor</h2>
                <button
                    onClick={downloadAllAsZip}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download All as ZIP
                </button>
            </div>

            {/* Page Selector */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setSelectedPage('agora')}
                    className={`px-4 py-2 font-medium transition-colors ${selectedPage === 'agora'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Agora ({Object.keys(interactions).filter(id => id.startsWith('agora')).length})
                </button>
                <button
                    onClick={() => setSelectedPage('publicMedia')}
                    className={`px-4 py-2 font-medium transition-colors ${selectedPage === 'publicMedia'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Public Media ({Object.keys(interactions).filter(id => id.startsWith('publicMedia')).length})
                </button>
                <button
                    onClick={() => setSelectedPage('demo')}
                    className={`px-4 py-2 font-medium transition-colors ${selectedPage === 'demo'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Demo ({Object.keys(interactions).filter(id => id.startsWith('demo')).length})
                </button>
            </div>

            {/* Interactions List */}
            <div className="space-y-4">
                {pageInteractions.map(([id, data]) => (
                    <InteractionEditor
                        key={id}
                        id={id}
                        data={data}
                        updateInteraction={updateInteraction}
                        updateOption={updateOption}
                    />
                ))}
            </div>
        </div>
    );
}

// Individual Interaction Editor
function InteractionEditor({
    id,
    data,
    updateInteraction,
    updateOption
}: {
    id: string;
    data: any;
    updateInteraction: (id: string, field: string, value: any) => void;
    updateOption: (id: string, optionIndex: number, field: string, value: any) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const typeColors: Record<string, string> = {
        quiz: 'bg-green-100 text-green-800',
        poll: 'bg-blue-100 text-blue-800',
        ranking: 'bg-purple-100 text-purple-800',
        slider: 'bg-orange-100 text-orange-800',
        points: 'bg-pink-100 text-pink-800',
        guess: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[data.type] || 'bg-slate-100 text-slate-800'}`}>
                        {data.type}
                    </span>
                    <span className="font-medium text-slate-900">{id}</span>
                </div>
                <span className="text-slate-400">{isExpanded ? '▼' : '▶'}</span>
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Generic fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {data.title !== undefined && <Field label="Title" value={data.title} onChange={(val) => updateInteraction(id, 'title', val)} />}
                        {data.heading !== undefined && <Field label="Heading" value={data.heading} onChange={(val) => updateInteraction(id, 'heading', val)} />}
                        {data.subtitle !== undefined && <Field label="Subtitle" value={data.subtitle} onChange={(val) => updateInteraction(id, 'subtitle', val)} />}
                        {data.description !== undefined && <Field label="Description" value={data.description} onChange={(val) => updateInteraction(id, 'description', val)} isTextarea />}
                        {data.details !== undefined && <Field label="Details" value={data.details} onChange={(val) => updateInteraction(id, 'details', val)} isTextarea />}
                        {data.explanation !== undefined && <Field label="Explanation" value={data.explanation} onChange={(val) => updateInteraction(id, 'explanation', val)} isTextarea />}
                        {data.correctAnswer !== undefined && <Field label="Correct Answer (ID)" value={data.correctAnswer} onChange={(val) => updateInteraction(id, 'correctAnswer', val)} />}
                        {data.tag !== undefined && <Field label="Tag/Prefix" value={data.tag} onChange={(val) => updateInteraction(id, 'tag', val)} />}
                    </div>

                    {/* Question */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Question
                        </label>
                        <textarea
                            value={data.question}
                            onChange={(e) => updateInteraction(id, 'question', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Slider-specific fields */}
                    {data.type === 'slider' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Min Label
                                </label>
                                <input
                                    type="text"
                                    value={data.minLabel}
                                    onChange={(e) => updateInteraction(id, 'minLabel', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Max Label
                                </label>
                                <input
                                    type="text"
                                    value={data.maxLabel}
                                    onChange={(e) => updateInteraction(id, 'maxLabel', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    {data.options && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Options ({data.options.length})
                            </label>
                            {data.options.map((option: any, index: number) => (
                                <div key={option.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-sm font-medium text-slate-500 mt-2">{index + 1}.</span>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={option.label}
                                                    onChange={(e) => updateOption(id, index, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    placeholder="Option Label"
                                                />
                                                {data.type === 'quiz' && option.isCorrect && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                        ✓ Correct Answer
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-6">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Option ID (Internal Reference)</label>
                                            <input
                                                type="text"
                                                value={option.id}
                                                onChange={(e) => updateOption(id, index, 'id', e.target.value)}
                                                className="w-full px-2 py-1 border border-slate-200 rounded bg-slate-100/50 text-xs text-slate-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
