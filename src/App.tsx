import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PricingPage from './pages/PricingPage';
import RoiShortTermPage from './pages/RoiShortTermPage';
import TomROIPage from './pages/TomROIPage';
import TomROIHistoryPage from './pages/TomROIHistoryPage';
import RoiCalculator from './components/roi/RoiCalculator';
import { Toaster } from 'sonner';

// Add the Toaster component to the App component
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
