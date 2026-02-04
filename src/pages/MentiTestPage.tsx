import { useState, useRef } from 'react';
import { PageConfig } from '@/types';
import { X, Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';
import { ScriptLoader } from '@/components/ScriptLoader';

interface MentiTestPageProps {
    config: PageConfig;
}

export function MentiTestPage({ config }: MentiTestPageProps) {
    const [activeTab, setActiveTab] = useState<'intro' | 'content' | 'quiz'>('intro');
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState<'participation' | 'results'>('participation');
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Hardcode audio source for this test
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

            // Trigger at 15 seconds
            if (time >= 15 && !showModal) {
                audioRef.current.pause();
                setIsPlaying(false);
                setShowModal(true);
                setModalStep('participation'); // Reset to first step
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
                <h1 className="text-3xl font-bold mb-2">Mentimeter Integration MVP</h1>
                <p className="text-slate-500 mb-6">Triggers at 15 seconds.</p>
                <div className="flex space-x-4 border-b border-slate-200 pb-1">
                    <button
                        onClick={() => setActiveTab('intro')}
                        className={`px-4 py-2 font-medium ${activeTab === 'intro' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500'}`}
                    >
                        1. Intro
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500'}`}
                    >
                        2. Content
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`px-4 py-2 font-medium ${activeTab === 'quiz' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500'}`}
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
                        <p className="text-slate-600">Start the audio below. After 15 seconds, the playback will stop and the Mentimeter participation window will appear.</p>
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
                        <p className="text-slate-600">This tab is for additional content.</p>
                    </div>
                )}
            </main>

            {/* Audio Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
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
                                Time: {currentTime.toFixed(1)}s / Trigger at: 15.0s
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

            {/* Mentimeter Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-slate-800">
                                    {modalStep === 'participation' ? 'Ihre Meinung zählt' : 'Ergebnisse'}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <div className={`h-2 w-8 rounded-full ${modalStep === 'participation' ? 'bg-purple-600' : 'bg-slate-200'}`} />
                                    <div className={`h-2 w-8 rounded-full ${modalStep === 'results' ? 'bg-purple-600' : 'bg-slate-200'}`} />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {modalStep === 'participation' && (
                                    <button
                                        onClick={() => setModalStep('results')}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm shadow-sm"
                                    >
                                        Next: Show Results <ArrowRight size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Mentimeter Iframe */}
                        <div className="flex-1 bg-slate-50 p-1 relative overflow-hidden">
                            <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 bg-white">
                                {modalStep === 'participation' ? (
                                    <iframe
                                        src="https://www.menti.com/alow7a4qz5s2"
                                        className="w-full h-full"
                                        frameBorder="0"
                                        title="Mentimeter Participation"
                                    ></iframe>
                                ) : (
                                    <iframe
                                        src="https://www.mentimeter.com/app/presentation/al2o4g7vkrkiscq7s4icneh3hk864f1b"
                                        className="w-full h-full"
                                        frameBorder="0"
                                        title="Mentimeter Results"
                                    ></iframe>
                                )}
                                <ScriptLoader />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
