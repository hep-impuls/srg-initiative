import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AgoraPage } from '@/pages/AgoraPage';
import { PageConfig } from '@/types';

// Registry of available report pages
const PAGE_REGISTRY: Record<string, React.ComponentType<{ config: PageConfig }>> = {
    'agora': AgoraPage,
    // Future pages:
    // 'climate': ClimatePage,
};

export function ReportShell() {
    const { slug } = useParams<{ slug: string }>();
    const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const loadConfig = async () => {
            try {
                setIsLoading(true);
                // Dynamically import the JSON file based on slug
                // Capitalize first letter for file name: agora -> AgoraPage.json
                const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
                const config = await import(`@/data/${capitalizedSlug}Page.json`);
                setPageConfig(config.default);
                setError(false);
            } catch (err) {
                console.error(`Failed to load config for slug "${slug}":`, err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, [slug]);

    if (!slug || !PAGE_REGISTRY[slug]) {
        console.warn(`Report shell: slug "${slug}" not found in registry.`);
        return <Navigate to="/report/agora" replace />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-600">Loading...</div>
            </div>
        );
    }

    if (error || !pageConfig) {
        console.error(`Report shell: Failed to load config for slug "${slug}".`);
        return <Navigate to="/report/agora" replace />;
    }

    const PageComponent = PAGE_REGISTRY[slug];

    // Convention over configuration for audio source
    // slug: agora -> /audio/AgoraPage.mp3
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
    const resolvedConfig: PageConfig = {
        ...pageConfig,
        audioSrc: pageConfig.audioSrc || `audio/${capitalizedSlug}Page.mp3`
    };

    return <PageComponent config={resolvedConfig} />;
}
