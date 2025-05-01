
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

// Import pages
import Dashboard from './pages/Dashboard';
import PricingPage from './pages/PricingPage';
import RoiShortTermPage from './pages/RoiShortTermPage';
import TomROIPage from './pages/TomROIPage';
import TomROIHistoryPage from './pages/TomROIHistoryPage';
import TomROIDetailPage from './pages/TomROIDetailPage';
import RoiCalculator from './components/roi/RoiCalculator';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

// This Navbar component is causing an issue, we need to check if it exists
// If not, we can create a simple placeholder
const Navbar = () => (
  <header className="bg-white shadow-sm">
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg text-arca-blue">ROI Analyzer</div>
        <nav className="flex space-x-4">
          <a href="/" className="text-gray-700 hover:text-arca-blue">Home</a>
          <a href="/analise/tom" className="text-gray-700 hover:text-arca-blue">Analisar ROI</a>
          <a href="/meus-rois" className="text-gray-700 hover:text-arca-blue">Meus ROIs</a>
        </nav>
      </div>
    </div>
  </header>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/analise/curto-prazo" element={<ProtectedRoute><RoiShortTermPage /></ProtectedRoute>} />
              <Route path="/analise/tom" element={<ProtectedRoute><TomROIPage /></ProtectedRoute>} />
              <Route path="/analise/tom/:id" element={<ProtectedRoute><TomROIDetailPage /></ProtectedRoute>} />
              <Route path="/meus-rois" element={<ProtectedRoute><TomROIHistoryPage /></ProtectedRoute>} />
              <Route path="/calculadora-roi" element={<ProtectedRoute><RoiCalculator /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
