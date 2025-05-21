import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Page from './pages/Page';
import { QueryProvider } from './providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/team/:teamId/player/:playerId" element={<Page />} />
          <Route path="/team/:teamId" element={<Page />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
