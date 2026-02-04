import { useState, useRef } from 'react';
import { PageConfig } from '@/types';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { ScriptLoader } from '@/components/ScriptLoader';

interface LumiTestPageProps {
    config: PageConfig;
}

export function LumiTestPage({ config }: LumiTestPageProps) {
    const [activeTab, setActiveTab] = useState<'intro' | 'content' | 'quiz'>('intro');
    const [showModal, setShowModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Hardcode audio source for this test if not provided
    const audioSrc = config.audioSrc || 'audio/PublicMediaPage.mp3';

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);

            // Trigger at 30 seconds
            if (time >= 30 && !showModal) {
                audioRef.current.pause();
                setIsPlaying(false);
                setShowModal(true);
            }
        }
    };

    const resetPlayback = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
            setShowModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
            {/* Header / Tabs */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold mb-6">Lumi Integration MVP</h1>
                <div className="flex space-x-4 border-b border-slate-200 pb-1">
                    <button
                        onClick={() => setActiveTab('intro')}
                        className={`px-4 py-2 font-medium ${activeTab === 'intro' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    >
                        1. Intro
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    >
                        2. Content
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`px-4 py-2 font-medium ${activeTab === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    >
                        3. Quiz
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
                {activeTab === 'intro' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                        <p className="text-slate-600">Start the audio below. After 30 seconds, the playback will stop and the Lumi quiz window will appear.</p>
                    </div>
                )}
                {activeTab === 'content' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Main Content</h2>
                        <p className="text-slate-600">This is some placeholder content for the second tab.</p>
                    </div>
                )}
                {activeTab === 'quiz' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Quiz Tab</h2>
                        <p className="text-slate-600">The quiz is also available here manually.</p>
                    </div>
                )}
            </main>

            {/* Audio Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                        </button>
                        <button
                            onClick={resetPlayback}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <div>
                            <div className="text-sm font-bold text-slate-900">Simulated Playback</div>
                            <div className="text-xs text-slate-500 font-mono">
                                Time: {currentTime.toFixed(1)}s / Trigger at: 30.0s
                            </div>
                        </div>
                    </div>
                    <audio
                        ref={audioRef}
                        src={audioSrc}
                        onTimeUpdate={handleTimeUpdate}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Lumi Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800">Quiz Time</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content - Lumi Iframe */}
                        <div className="flex-1 bg-slate-50 p-1 relative overflow-hidden">
                            <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 bg-white">
                                <iframe
                                    src="https://app.lumi.education/api/v1/run/Y-5ydU/embed"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                    title="Public Media Quiz"
                                ></iframe>
                                <ScriptLoader />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
