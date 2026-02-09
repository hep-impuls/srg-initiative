import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { UserSummary } from '../components/interactions/UserSummary';

export const ResultsPage: React.FC = () => {
    const { sourceId } = useParams<{ sourceId: string }>();
    const navigate = useNavigate();

    const handleBack = () => {
        if (sourceId === 'agora') {
            navigate('/report/agora');
        } else if (sourceId === 'publicMedia') {
            navigate('/report/publicMedia');
        } else {
            navigate('/report/demo');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:p-0">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center print:text-left print:mb-8">
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">Meine Auswertung</h1>
                    <p className="text-slate-500 mt-2 print:hidden">Hier sehen Sie alle Ihre Antworten und Quiz-Ergebnisse im Überblick.</p>
                </header>

                <UserSummary sourceId={sourceId} />

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-8 print:hidden">
                    <button
                        onClick={handleBack}
                        className="text-blue-600 font-bold hover:underline px-6 py-3"
                    >
                        ← Zurück zur Übersicht
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
                    >
                        <Printer size={18} />
                        Als PDF speichern / Drucken
                    </button>
                </div>
            </div>
        </div>
    );
};
