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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, X, AlertCircle } from 'lucide-react';

// Constantes de configuração
const SUPABASE_BASE_URL = "https://dkykekkdjqajqfyrgqhi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWtla2tkanFhanFmeXJncWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjQxNjAsImV4cCI6MjA2MTU0MDE2MH0.iC6tio4Uoj2oxwUAvV9kp6QWQG4MxE6RnhBS9_uFwSY";

export function DiagnosticTool() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadResult, setThreadResult] = useState<any>(null);
  const [threadLoading, setThreadLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log("Iniciando diagnóstico de conexão...");
      
      // Teste 1: Verificar CORS com chamada OPTIONS
      console.log("Teste 1: Verificando preflight CORS (OPTIONS)...");
      try {
        const optionsResponse = await fetch(`${SUPABASE_BASE_URL}/functions/v1/tom-assistant`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Accept'
          }
        });
        
        console.log("Resposta OPTIONS:", {
          status: optionsResponse.status,
          statusText: optionsResponse.statusText,
          headers: Object.fromEntries([...optionsResponse.headers])
        });
      } catch (e) {
        console.error("Erro no teste OPTIONS:", e);
      }
      
      // Teste 2: Chamada POST regular
      console.log("Teste 2: Realizando chamada POST...");
      const postResponse = await fetch(`${SUPABASE_BASE_URL}/functions/v1/tom-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({ action: 'ping' })
      });
      
      const responseData = await postResponse.text();
      let jsonData = null;
      
      try {
        jsonData = JSON.parse(responseData);
      } catch (e) {
        console.log("Resposta não é JSON válido:", responseData);
      }
      
      setResult({
        method: 'POST',
        url: `${SUPABASE_BASE_URL}/functions/v1/tom-assistant`,
        status: postResponse.status,
        statusText: postResponse.statusText,
        headers: Object.fromEntries([...postResponse.headers]),
        data: jsonData || responseData
      });
      
    } catch (error) {
      console.error("Erro durante diagnóstico:", error);
      setError(error.message || 'Erro desconhecido durante o diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  // Função para testar especificamente a criação de Thread
  const testCreateThread = async () => {
    setThreadLoading(true);
    setThreadResult(null);
    setError(null);
    
    try {
      console.log("Testando criação direta de thread...");
      
      const response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/tom-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({ 
          action: 'createThread',
          data: {}
        })
      });
      
      const responseBody = await response.text();
      let jsonData = null;
      
      try {
        jsonData = JSON.parse(responseBody);
      } catch (e) {
        console.error("Resposta não é JSON válido:", responseBody);
      }
      
      setThreadResult({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers]),
        data: jsonData || responseBody
      });
      
    } catch (error) {
      console.error("Erro ao testar criação de thread:", error);
      setError(`Erro ao testar criação de thread: ${error.message}`);
    } finally {
      setThreadLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Diagnóstico de Conexão com Supabase</CardTitle>
        <CardDescription>
          Ferramenta para detectar problemas de CORS e conexão com Edge Functions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={runTest} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Executando teste básico...' : 'Testar Conexão Básica'}
            </Button>
            
            <Button 
              onClick={testCreateThread} 
              disabled={threadLoading}
              variant="secondary"
              className="w-full"
            >
              {threadLoading ? 'Testando thread...' : 'Testar Criação de Thread'}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Exibir resultado do teste de thread */}
          {threadResult && (
            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Resultado do Teste de Thread</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Status:</span>
                {threadResult.status >= 200 && threadResult.status < 300 ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" /> Sucesso ({threadResult.status} {threadResult.statusText})
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <X className="w-4 h-4 mr-1" /> Falha ({threadResult.status} {threadResult.statusText})
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Dados da Resposta:</h4>
                <div className="bg-slate-50 p-2 rounded text-sm font-mono overflow-x-auto">
                  {typeof threadResult.data === 'object' ? (
                    <pre>{JSON.stringify(threadResult.data, null, 2)}</pre>
                  ) : (
                    <div>{threadResult.data}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Resultado do teste básico */}
          {result && (
            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Resultado do Teste Básico</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Status:</span>
                {result.status >= 200 && result.status < 300 ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" /> Sucesso ({result.status} {result.statusText})
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <X className="w-4 h-4 mr-1" /> Falha ({result.status} {result.statusText})
                  </span>
                )}
              </div>
              
              <div className="mb-2">
                <span className="font-semibold">URL:</span> {result.url}
              </div>
              
              <div className="mb-4">
                <span className="font-semibold">Método:</span> {result.method}
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Cabeçalhos de Resposta:</h4>
                <div className="bg-slate-50 p-2 rounded text-sm font-mono overflow-x-auto">
                  {Object.entries(result.headers).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-blue-600">{key}:</span> {value as string}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Corpo da Resposta:</h4>
                <div className="bg-slate-50 p-2 rounded text-sm font-mono overflow-x-auto">
                  {typeof result.data === 'object' ? (
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  ) : (
                    <div>{result.data}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 