
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import the Toaster from sonner
import { Toaster } from 'sonner';

// Import pages
import Dashboard from './pages/Dashboard';
import PricingPage from './pages/PricingPage';
import RoiShortTermPage from './pages/RoiShortTermPage';
import TomROIPage from './pages/TomROIPage';
import TomROIHistoryPage from './pages/TomROIHistoryPage';
import TomROIDetailPage from './pages/TomROIDetailPage';
import RoiCalculator from './components/roi/RoiCalculator';

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
  const session = useSession();
  const supabase = useSupabaseClient();
  
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/analise/curto-prazo" element={<RoiShortTermPage />} />
              <Route path="/analise/tom" element={<TomROIPage />} />
              <Route path="/analise/tom/:id" element={<TomROIDetailPage />} />
              <Route path="/meus-rois" element={<TomROIHistoryPage />} />
              <Route path="/calculadora-roi" element={<RoiCalculator />} />
              <Route
                path="/login"
                element={
                  !session ? (
                    <Auth
                      supabaseClient={supabase}
                      appearance={{ theme: ThemeSupa }}
                      providers={['google', 'github']}
                      redirectTo={`${window.location.origin}/`}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
