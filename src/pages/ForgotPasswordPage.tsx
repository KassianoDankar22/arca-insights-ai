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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import { AnimatedBorderInput } from '@/components/AnimatedBorderInput';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { ArrowLeft, Loader2, Key, AlertCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const navigate = useNavigate();

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'Temp' + result;
  };

  const handleGeneratePassword = async () => {
    if (!email) {
      toast.error('Por favor, insira seu email');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verificar se o usuário existe
      const { data: users } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();

      if (!users) {
        toast.error('Email não encontrado no sistema');
        setLoading(false);
        return;
      }

      // Gerar senha temporária
      const newTempPassword = generateTempPassword();
      
      // Tentar resetar a senha via Edge Function
      const { data, error } = await supabase.functions.invoke('reset-user-password', {
        body: { 
          userId: users.id, 
          newPassword: newTempPassword,
          userEmail: email 
        },
      });

      if (error) {
        throw error;
      }

      setTempPassword(newTempPassword);
      setShowTempPassword(true);
      toast.success('Senha temporária gerada com sucesso!');
      
    } catch (error: any) {
      console.error('Erro ao gerar senha temporária:', error);
      toast.error('Não foi possível gerar senha temporária. Entre em contato com o suporte.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    toast.success('Senha copiada para a área de transferência!');
  };

  if (showTempPassword) {
    return (
      <AuroraBackground>
        <motion.div 
          className="w-full max-w-md p-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-10">
            <Logo className="h-20" />
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-zinc-900/80 shadow-xl border-white/20 dark:border-zinc-700/30">
            <CardHeader>
              <CardTitle className="text-center">Senha Temporária Gerada</CardTitle>
              <CardDescription className="text-center">
                Use esta senha para fazer login e depois altere para uma senha de sua preferência
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Sua nova senha temporária:</span>
                </div>
                <div className="bg-white p-3 rounded border font-mono text-lg tracking-wider text-center border-dashed border-green-300">
                  {tempPassword}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium mb-1">Próximos passos:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Copie a senha acima</li>
                      <li>Vá para a tela de login</li>
                      <li>Use seu email: <strong>{email}</strong></li>
                      <li>Digite a senha temporária</li>
                      <li>Após o login, vá em Configurações para alterar sua senha</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={copyToClipboard}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Key className="mr-2 h-4 w-4" />
                Copiar Senha
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Ir para Login
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <motion.div 
        className="w-full max-w-md p-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-10">
          <Logo className="h-20" />
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-zinc-900/80 shadow-xl border-white/20 dark:border-zinc-700/30">
          <CardHeader>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>
              Digite seu email para gerar uma nova senha temporária
            </CardDescription>
          </CardHeader>
          
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <AnimatedBorderInput>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-0 focus-visible:ring-0 bg-transparent"
                  />
                </AnimatedBorderInput>
              </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-blue-800 text-sm">
                  <p className="font-medium">Como funciona:</p>
                  <p>Será gerada uma senha temporária que você poderá usar imediatamente para fazer login. Depois, altere para uma senha de sua preferência.</p>
                </div>
              </div>
            </div>
            </CardContent>
            
          <CardFooter className="flex flex-col space-y-3">
              <Button
              onClick={handleGeneratePassword}
              className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                  </>
                ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Gerar Nova Senha
                </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
              </Button>
            </CardFooter>
        </Card>
      </motion.div>
    </AuroraBackground>
  );
};

export default ForgotPasswordPage; 