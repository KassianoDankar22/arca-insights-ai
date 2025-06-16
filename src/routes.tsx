/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React, { Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading para todas as páginas
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PropertyDetails = React.lazy(() => import('./pages/PropertyDetails'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const PlansPage = React.lazy(() => import('./pages/PlansPage'));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const ChatLivePage = React.lazy(() => import('./pages/ChatLivePage'));
const RoiShortTermPage = React.lazy(() => import('./pages/RoiShortTermPage'));
const TomROIPage = React.lazy(() => import('./pages/TomROIPage'));
const TomROIDetailPage = React.lazy(() => import('./pages/TomROIDetailPage'));
const TomROIHistoryPage = React.lazy(() => import('./pages/TomROIHistoryPage'));
const AcademyPage = React.lazy(() => import('./pages/AcademyPage'));
const CourseDetailPage = React.lazy(() => import('./pages/CourseDetailPage'));
const CoursePlayerPage = React.lazy(() => import('./pages/CoursePlayerPage'));
const FinanceiroPage = React.lazy(() => import('./pages/FinanceiroPage'));
const CrmPage = React.lazy(() => import('./pages/CrmPage'));
const CrmAgendaPage = React.lazy(() => import('./pages/CrmAgendaPage'));
const CrmLeadsPage = React.lazy(() => import('./pages/CrmLeadsPage'));
const CrmFunilPage = React.lazy(() => import('./pages/CrmFunilPage'));
const SuportePage = React.lazy(() => import('./pages/SuportePage'));
const ConfiguracoesPage = React.lazy(() => import('./pages/ConfiguracoesPage'));
const UsagePage = React.lazy(() => import('./pages/UsagePage'));

// Admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminLiveChat = React.lazy(() => import('./pages/admin/AdminLiveChat'));
const AdminSupport = React.lazy(() => import('./pages/admin/AdminSupport'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

// Wrapper para lazy loading
const LazyLoad = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: LazyLoad(AuthPage)
  },
  {
    path: '/forgot-password',
    element: LazyLoad(ForgotPasswordPage)
  },
  {
    path: '/reset-password',
    element: LazyLoad(ResetPasswordPage)
  },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: LazyLoad(Dashboard) },
      { path: 'home', element: LazyLoad(HomePage) },
      { path: 'property/:id', element: LazyLoad(PropertyDetails) },
      { path: 'pricing', element: LazyLoad(PricingPage) },
      { path: 'ferramentas', element: LazyLoad(ToolsPage) },
      { path: 'ferramentas/tom', element: <Navigate to="/analise/tom" replace /> },
      { path: 'chat', element: LazyLoad(ChatPage) },
      { path: 'chat-live', element: LazyLoad(ChatLivePage) },
      { path: 'analise/curto-prazo', element: LazyLoad(RoiShortTermPage) },
      { path: 'analise/tom', element: LazyLoad(TomROIPage) },
      { path: 'analise/tom/:id', element: LazyLoad(TomROIDetailPage) },
      { path: 'meus-rois', element: LazyLoad(TomROIHistoryPage) },
      { path: 'academy', element: LazyLoad(AcademyPage) },
      { path: 'academy/:courseId', element: LazyLoad(CourseDetailPage) },
      { path: 'academy/:courseId/player', element: LazyLoad(CoursePlayerPage) },
      { path: 'financeiro', element: LazyLoad(FinanceiroPage) },
      { path: 'plans', element: LazyLoad(PlansPage) },
      { path: 'crm', element: LazyLoad(CrmPage) },
      { path: 'crm/agenda', element: LazyLoad(CrmAgendaPage) },
      { path: 'crm/leads', element: LazyLoad(CrmLeadsPage) },
      { path: 'crm/funil', element: LazyLoad(CrmFunilPage) },
      { path: 'suporte', element: LazyLoad(SuportePage) },
      { path: 'configuracoes', element: LazyLoad(ConfiguracoesPage) },
      { path: 'uso', element: LazyLoad(UsagePage) },
      { path: 'dashboard', element: <Navigate to="/" replace /> },
      
      // Admin routes
      {
        path: 'admin',
        element: <AdminLayout>{LazyLoad(AdminDashboard)}</AdminLayout>
      },
      {
        path: 'admin/users',
        element: <AdminLayout>{LazyLoad(AdminUsers)}</AdminLayout>
      },
      {
        path: 'admin/analytics',
        element: <AdminLayout>{LazyLoad(AdminAnalytics)}</AdminLayout>
      },
      {
        path: 'admin/live-chat',
        element: <AdminLayout>{LazyLoad(AdminLiveChat)}</AdminLayout>
      },
      {
        path: 'admin/support',
        element: <AdminLayout>{LazyLoad(AdminSupport)}</AdminLayout>
      }
    ]
  }
]; 