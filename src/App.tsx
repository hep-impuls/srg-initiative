import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReportShell } from '@/components/ReportShell';
import EmbedPage from '@/pages/EmbedPage';
import { InteractionDemoPage } from '@/pages/InteractionDemoPage';
import { ResultsPage } from '@/pages/ResultsPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Root redirects to default report */}
        <Route path="/" element={<Navigate to="/report/agora" replace />} />

        {/* Dynamic Report Routing */}
        <Route path="/report/demo" element={<InteractionDemoPage />} />
        <Route path="/report/results/:sourceId" element={<ResultsPage />} />
        <Route path="/report/results" element={<Navigate to="/report/results/demo" replace />} />
        <Route path="/report/:slug" element={<ReportShell />} />

        {/* Embed Route for Interactions */}
        <Route path="/embed/:interactionId" element={<EmbedPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/report/agora" replace />} />
      </Routes>
    </HashRouter>
  );
}
