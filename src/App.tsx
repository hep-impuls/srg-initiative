import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReportShell } from '@/components/ReportShell';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Root redirects to default report */}
        <Route path="/" element={<Navigate to="/report/agora" replace />} />

        {/* Dynamic Report Routing */}
        <Route path="/report/:slug" element={<ReportShell />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/report/agora" replace />} />
      </Routes>
    </HashRouter>
  );
}
