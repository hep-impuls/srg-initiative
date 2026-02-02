import { useState, useEffect } from 'react';
import { X, Headphones, Info } from 'lucide-react';

export function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenAudioTour');
        if (!hasSeenTour) {
            // Delay slightly to ensure layout is ready and for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismissTour = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenAudioTour', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Background Overlay for clicks */}
            <div className="absolute inset-0 pointer-events-auto" onClick={dismissTour} />

            {/* Content Box - Positioned above the player in the bottom-right */}
            <div className="absolute bottom-[7rem] right-6 z-[110] w-full max-w-[320px] bg-white rounded-2xl shadow-2xl border border-blue-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
                <button
                    onClick={dismissTour}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Schliessen"
                >
                    <X size={18} />
                </button>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200 animate-pulse">
                            <Headphones size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">Audio-Guide verfügbar</h3>
                            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">Interaktives Lernen</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Diese Lerneinheit verfügt über einen <strong>Audio-Guide</strong>, der dich Schritt für Schritt durch die Inhalte führt.
                        </p>

                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2">
                            <div className="text-blue-400 mt-0.5">
                                <Info size={16} />
                            </div>
                            <p className="text-[11px] text-slate-500 italic leading-snug">
                                Du kannst den Inhalten auch ohne Audio folgen, indem du einfach nach unten scrollst.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={dismissTour}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] text-sm"
                    >
                        Verstanden & Starten
                    </button>

                    <p className="text-center text-[10px] text-slate-400 font-medium font-sans">
                        Viel Erfolg beim Lernen!
                    </p>
                </div>

                {/* Pointer Arrow pointing down to the player */}
                <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-r border-b border-blue-100 rotate-45" />
            </div>

            {/* Spotlight Effect for the Audio Player */}
            <style>{`
        @keyframes pulse-ring-onboarding {
          0% { transform: scale(0.98); opacity: 0.6; }
          50% { transform: scale(1.02); opacity: 0.4; }
          100% { transform: scale(0.98); opacity: 0.6; }
        }
        .audio-player-spotlight {
          position: fixed;
          bottom: 1.25rem;
          right: 1.25rem;
          width: calc(240px + 0.5rem);
          max-width: calc(280px + 0.5rem);
          height: 6rem;
          border-radius: 2rem;
          /* Strong shadow to dim the rest of the screen, but transparent enough to see through */
          box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.6);
          z-index: 105; /* Above modal? No, modal should be above shadow. 
                         The z-[100] container has a stacking context.
                         Box is z-[110]. Shadow should be z-[105]. */
          pointer-events: none;
        }
        .audio-player-ring {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          width: calc(240px + 1rem);
          max-width: calc(280px + 1rem);
          height: 6.5rem;
          border: 4px solid #3b82f6;
          border-radius: 2.5rem;
          z-index: 106;
          pointer-events: none;
          animation: pulse-ring-onboarding 2s infinite ease-in-out;
        }
        @media (min-width: 768px) {
          .audio-player-spotlight {
            width: 290px;
          }
          .audio-player-ring {
            width: 300px;
          }
        }
      `}</style>
            <div className="audio-player-spotlight" />
            <div className="audio-player-ring" />
        </div>
    );
}
