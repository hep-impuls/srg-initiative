import { useParams, Navigate } from 'react-router-dom';
import { AgoraPage } from '@/pages/AgoraPage';
import { PublicMediaPage } from '@/pages/PublicMediaPage';
import { LumiTestPage } from '@/pages/LumiTestPage';
import { MentiTestPage } from '@/pages/MentiTestPage';
import { OnboardingTour } from '@/components/OnboardingTour';
import { PageConfig } from '@/types';
import { swissifyData } from '@/utils/textUtils';

// Static Config Imports
import AgoraConfig from '@/data/AgoraPage.json';
import PublicMediaConfig from '@/data/PublicMediaPage.json';

// Registry of available report pages
const PAGE_REGISTRY: Record<string, React.ComponentType<{ config: PageConfig }>> = {
    'agora': AgoraPage,
    'publicMedia': PublicMediaPage,
    'lumiTest': LumiTestPage,
    'mentiTest': MentiTestPage,
};

// Registry of configurations
const CONFIG_REGISTRY: Record<string, PageConfig> = {
    'agora': swissifyData(AgoraConfig as unknown as PageConfig),
    'publicMedia': swissifyData(PublicMediaConfig as unknown as PageConfig),
    'lumiTest': { title: 'Lumi Test', audioSrc: 'audio/PublicMediaPage.mp3', timeline: [] },
    'mentiTest': { title: 'Menti Test', audioSrc: 'audio/PublicMediaPage.mp3', timeline: [] },
};

export function ReportShell() {
    const { slug } = useParams<{ slug: string }>();

    // Normalize slug lookup to be case-insensitive
    // This allows /report/PublicMedia to match 'publicMedia' key
    const registryKey = Object.keys(PAGE_REGISTRY).find(key =>
        key.toLowerCase() === slug?.toLowerCase()
    );

    if (!slug || !registryKey || !PAGE_REGISTRY[registryKey] || !CONFIG_REGISTRY[registryKey]) {
        console.warn(`Report shell: slug "${slug}" (normalized: "${registryKey}") not found in registry.`);
        return <Navigate to="/report/agora" replace />;
    }

    const PageComponent = PAGE_REGISTRY[registryKey];
    const pageConfig = CONFIG_REGISTRY[registryKey];

    // Convention over configuration for audio source
    // slug: agora -> /audio/AgoraPage.mp3
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
    const resolvedConfig: PageConfig = {
        ...pageConfig,
        audioSrc: pageConfig.audioSrc || `audio/${capitalizedSlug}Page.mp3`
    };

    return (
        <>
            <PageComponent config={resolvedConfig} />
            <OnboardingTour />
        </>
    );
}
