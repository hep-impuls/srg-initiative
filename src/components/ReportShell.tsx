import { useParams, Navigate } from 'react-router-dom';
import { AgoraPage } from '@/pages/AgoraPage';
import { PublicMediaPage } from '@/pages/PublicMediaPage';
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
};

// Registry of configurations
const CONFIG_REGISTRY: Record<string, PageConfig> = {
    'agora': swissifyData(AgoraConfig as unknown as PageConfig),
    'publicMedia': swissifyData(PublicMediaConfig as unknown as PageConfig),
};

export function ReportShell() {
    const { slug } = useParams<{ slug: string }>();

    if (!slug || !PAGE_REGISTRY[slug] || !CONFIG_REGISTRY[slug]) {
        console.warn(`Report shell: slug "${slug}" not found in registry.`);
        return <Navigate to="/report/agora" replace />;
    }

    const PageComponent = PAGE_REGISTRY[slug];
    const pageConfig = CONFIG_REGISTRY[slug];

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
