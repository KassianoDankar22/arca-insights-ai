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

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug, Lightbulb } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorData = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('Error Report:', errorData);
    
    // Aqui você pode enviar para um serviço de monitoramento de erros
    // como Sentry, LogRocket, ou seu próprio endpoint
    alert('Relatório de erro copiado para o console. Entre em contato com o suporte.');
  };

  public render() {
    if (this.state.hasError) {
      // Renderizar fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de erro padrão melhorada
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oops! Algo deu errado
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada automaticamente.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Informações do erro para desenvolvedores */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Detalhes do erro (modo desenvolvimento):
                  </h3>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto">
                    {this.state.error?.message}
                  </pre>
                  {this.state.error?.stack && (
                    <details className="mt-2">
                      <summary className="text-sm font-medium text-red-800 cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap overflow-auto">
                        {this.state.error.stack}
                      </pre>
            </details>
          )}
                </div>
              )}

              {/* Possíveis soluções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  <Lightbulb className="inline w-4 h-4 mr-1" /> Possíveis soluções:
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Atualize a página (F5 ou Ctrl+R)</li>
                  <li>• Verifique sua conexão com a internet</li>
                  <li>• Limpe o cache do navegador</li>
                  <li>• Tente novamente em alguns minutos</li>
                </ul>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRefresh}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Atualizar Página
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Ir para Home
                </Button>
                
                <Button 
                  onClick={this.handleReportError}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  Reportar Erro
                </Button>
              </div>

              {/* Informações de contato */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  Se o problema persistir, entre em contato conosco em{' '}
                  <a 
                    href="mailto:suporte@arcainsights.com" 
                    className="text-blue-600 hover:underline"
                  >
                    suporte@arcainsights.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 