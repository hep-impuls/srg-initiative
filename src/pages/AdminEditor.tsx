import { useState, useEffect } from 'react';
import { Download, FileText, Globe, MessageSquare } from 'lucide-react';
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

    const updateSection = (section: string, field: string, value: string) => {
        const newData = { ...data };
        if (!newData.sections[section]) newData.sections[section] = {};
        newData.sections[section][field] = value;
        setData(newData);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Agora Page Content</h2>
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download JSON
                </button>
            </div>

            {/* Sources Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Sources ({data.sources.length})</h3>
                <div className="space-y-4">
                    {data.sources.map((source: any, index: number) => (
                        <div key={source.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="grid gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Source {source.id} - Text
                                    </label>
                                    <input
                                        type="text"
                                        value={source.text}
                                        onChange={(e) => updateSource(index, 'text', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Details
                                    </label>
                                    <textarea
                                        value={source.details}
                                        onChange={(e) => updateSource(index, 'details', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Content */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Section Content</h3>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Theory Intro Heading
                        </label>
                        <input
                            type="text"
                            value={data.sections?.theoryIntro?.heading || ''}
                            onChange={(e) => updateSection('theoryIntro', 'heading', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Theory Intro Text
                        </label>
                        <textarea
                            value={data.sections?.theoryIntro?.text || ''}
                            onChange={(e) => updateSection('theoryIntro', 'text', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Public Media Editor Component
function PublicMediaEditor({ data, setData, onDownload }: { data: any; setData: (data: any) => void; onDownload: () => void }) {
    const updateCountry = (index: number, field: string, value: any) => {
        const newData = { ...data };
        newData.countryData[index][field] = value;
        setData(newData);
    };

    const updateCountryDescription = (index: number, descIndex: number, value: string) => {
        const newData = { ...data };
        newData.countryData[index].description[descIndex] = value;
        setData(newData);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Public Media Page Content</h2>
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download JSON
                </button>
            </div>

            {/* Country Data */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Country Data ({data.countryData.length})</h3>
                <div className="space-y-6">
                    {data.countryData.map((country: any, index: number) => (
                        <div key={country.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-900 mb-3">{country.name}</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Funding Detail
                                    </label>
                                    <input
                                        type="text"
                                        value={country.fundingDetail}
                                        onChange={(e) => updateCountry(index, 'fundingDetail', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Description (Bullet Points)
                                    </label>
                                    {country.description.map((desc: string, descIndex: number) => (
                                        <textarea
                                            key={descIndex}
                                            value={desc}
                                            onChange={(e) => updateCountryDescription(index, descIndex, e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 mb-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
        setInteractions(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const updateOption = (id: string, optionIndex: number, field: string, value: any) => {
        setInteractions(prev => ({
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
                                    <div className="flex items-start gap-2">
                                        <span className="text-sm font-medium text-slate-500 mt-2">{index + 1}.</span>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={option.label}
                                                onChange={(e) => updateOption(id, index, 'label', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {data.type === 'quiz' && option.isCorrect && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                    ✓ Correct Answer
                                                </span>
                                            )}
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
