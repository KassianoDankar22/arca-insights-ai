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

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { checkSupabaseConnection } from '@/lib/supabase';

interface EnvironmentStatus {
  supabaseUrl: boolean;
  supabaseKey: boolean;
  openaiKey: boolean;
  supabaseConnection: boolean | null;
}

const EnvironmentCheck: React.FC = () => {
  const [status, setStatus] = useState<EnvironmentStatus>({
    supabaseUrl: false,
    supabaseKey: false,
    openaiKey: false,
    supabaseConnection: null
  });
  const [loading, setLoading] = useState(true);

  const checkEnvironment = async () => {
    setLoading(true);
    
    // Verificar variáveis de ambiente
    const envStatus = {
      supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      openaiKey: !!import.meta.env.OPENAI_API_KEY,
      supabaseConnection: null as boolean | null
    };

    // Testar conexão com Supabase
    if (envStatus.supabaseUrl && envStatus.supabaseKey) {
      try {
        envStatus.supabaseConnection = await checkSupabaseConnection();
      } catch (error) {
        envStatus.supabaseConnection = false;
      }
    } else {
      envStatus.supabaseConnection = false;
    }

    setStatus(envStatus);
    setLoading(false);
  };

  useEffect(() => {
    checkEnvironment();
  }, []);

  const getStatusIcon = (isOk: boolean | null) => {
    if (isOk === null) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return isOk ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (isOk: boolean | null) => {
    if (isOk === null) return <Badge variant="secondary">Verificando...</Badge>;
    return isOk ? 
      <Badge className="bg-green-100 text-green-800">OK</Badge> : 
      <Badge variant="destructive">Erro</Badge>;
  };

  const allGood = status.supabaseUrl && status.supabaseKey && status.supabaseConnection;

  if (allGood && !loading) {
    return null; // Não mostrar se tudo estiver OK
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              getStatusIcon(allGood)
            )}
            Verificação do Ambiente
          </CardTitle>
          <p className="text-gray-600">
            Verificando configurações necessárias para o funcionamento da aplicação...
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status das variáveis de ambiente */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.supabaseUrl)}
                <span>URL do Supabase</span>
              </div>
              {getStatusBadge(status.supabaseUrl)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.supabaseKey)}
                <span>Chave do Supabase</span>
              </div>
              {getStatusBadge(status.supabaseKey)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.openaiKey)}
                <span>Chave da OpenAI</span>
              </div>
              {getStatusBadge(status.openaiKey)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.supabaseConnection)}
                <span>Conexão com Supabase</span>
              </div>
              {getStatusBadge(status.supabaseConnection)}
            </div>
          </div>

          {/* Instruções para correção */}
          {(!status.supabaseUrl || !status.supabaseKey) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                <AlertTriangle className="inline w-4 h-4 mr-1" /> Configuração necessária:
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                Algumas variáveis de ambiente estão faltando. Siga estes passos:
              </p>
              <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Verifique se o arquivo <code>.env</code> existe na raiz do projeto</li>
                <li>Adicione as seguintes variáveis:</li>
              </ol>
              <div className="bg-yellow-100 p-2 rounded mt-2 text-xs font-mono">
                VITE_SUPABASE_URL=https://dkykekkdjqajqfyrgqhi.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            <Button 
              onClick={checkEnvironment}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Verificar Novamente
            </Button>
            
            {allGood && (
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Continuar
              </Button>
            )}
          </div>

          {/* Modo desenvolvimento */}
          {import.meta.env.DEV && (
            <div className="text-xs text-gray-500 border-t pt-3">
              <p><strong>Modo:</strong> Desenvolvimento</p>
              <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Não definida'}</p>
              <p><strong>Chave:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentCheck; 