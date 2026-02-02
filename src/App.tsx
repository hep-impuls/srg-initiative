import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgoraPage } from '@/pages/AgoraPage';
import tourConfig from '@/data/tourConfig.json';
import { TourConfig } from '@/types';

const config = tourConfig as TourConfig;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Root redirects to agora */}
        <Route path="/" element={<Navigate to="/report/agora" replace />} />

        {/* Report pages */}
        <Route
          path="/report/agora"
          element={<AgoraPage config={config.pages.agora} />}
        />

        {/* Future pages can be added here */}
        {/* <Route path="/report/climate" element={<ClimatePage config={config.pages.climate} />} /> */}

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/report/agora" replace />} />
      </Routes>
    </HashRouter>
  );
}
