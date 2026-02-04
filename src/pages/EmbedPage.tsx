import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InteractionShell } from '../components/interactions/InteractionShell';
import { InteractionConfig } from '../types/interaction';

export default function EmbedPage() {
    const { interactionId } = useParams<{ interactionId: string }>();
    const [config, setConfig] = useState<InteractionConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadConfig() {
            if (!interactionId) return;

            try {
                // Dynamic import of all interaction JSONs
                // Note: Vite requires us to include the extension in the glob if we want to be specific, 
                // or we can just try to import.
                // Using import.meta.glob is the standard Vite way for dynamic dynamic imports.

                // Dynamic import of all interaction JSONs
                const modules = import.meta.glob('../data/interactions/*.json');

                // Construct expected path (glob paths are relative to the file defining them)
                const expectedPath = `../data/interactions/${interactionId}.json`;

                const loader = modules[expectedPath];

                if (!loader) {
                    throw new Error(`Interaction "${interactionId}" not found.`);
                }

                const mod: any = await loader();
                // handling both default export or direct json content
                const data = mod.default || mod;

                setConfig(data);
            } catch (err) {
                console.error(err);
                setError("Konfiguration konnte nicht geladen werden.");
            } finally {
                setLoading(false);
            }
        }

        loadConfig();
    }, [interactionId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-transparent">Loading...</div>;
    }

    if (error || !config) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 text-red-500">
                {error || "Interaction not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* We pass currentTime as a large number to ensure we default to Reveal phase if just viewing standalone, 
            OR we might want it to be interactive. 
            For Embed, let's assume it's Interactive (Input phase) initially, 
            unless we want to control it via query params.
            For now: Default to interactive.
        */}
                <InteractionShell config={config} />
            </div>
        </div>
    );
}
