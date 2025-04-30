
import { useState } from 'react';
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

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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
                <Route path="roi-curto-prazo" element={<RoiShortTermPage />} />
                <Route path="roi-longo-prazo" element={<RoiLongTermPage />} />
                <Route path="tendencias" element={<MarketTrendsPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
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
