
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ChatPage from "./pages/ChatPage";
import RoiShortTermPage from "./pages/RoiShortTermPage";
import RoiLongTermPage from "./pages/RoiLongTermPage";
import MarketTrendsPage from "./pages/MarketTrendsPage";
import SettingsPage from "./pages/SettingsPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/MainLayout";
import ToolsPage from "./pages/ToolsPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add viewport meta tag for responsive design
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
    
    setIsReady(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="ferramentas" element={<ToolsPage />} />
                <Route path="academy" element={<HomePage />} />
                <Route path="financeiro" element={<HomePage />} />
                <Route path="integracoes" element={<SettingsPage />} />
                <Route path="roi-curto-prazo" element={<RoiShortTermPage />} />
                <Route path="roi-longo-prazo" element={<RoiLongTermPage />} />
                <Route path="tendencias" element={<MarketTrendsPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="ajuda" element={<HomePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
