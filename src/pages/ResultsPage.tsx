import React from 'react';
import { UserSummary } from '../components/interactions/UserSummary';

export const ResultsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">Meine Auswertung</h1>
                    <p className="text-slate-500 mt-2">Hier sehen Sie alle Ihre Antworten und Quiz-Ergebnisse im Überblick.</p>
                </header>

                <UserSummary />

                <div className="text-center pt-8">
                    <button
                        onClick={() => window.location.hash = '#/report/demo'}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        ← Zurück zur Übersicht
                    </button>
                </div>
            </div>
        </div>
    );
};
