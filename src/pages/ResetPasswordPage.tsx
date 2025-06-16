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

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import { AnimatedBorderInput } from '@/components/AnimatedBorderInput';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verificar se o token está presente na URL
    const token = searchParams.get('token');
    if (!token) {
      setIsValidToken(false);
      toast.error('Link de recuperação inválido ou expirado');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Senha atualizada com sucesso!');
      navigate('/login', { 
        state: { 
          message: 'Sua senha foi atualizada com sucesso. Faça login com sua nova senha.' 
        }
      });
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      toast.error(error.message || 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
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
              <CardTitle>Link Inválido</CardTitle>
              <CardDescription>
                O link de recuperação de senha é inválido ou expirou.
              </CardDescription>
            </CardHeader>
            
            <CardFooter>
              <Button
                type="button"
                className="w-full"
                onClick={() => navigate('/forgot-password')}
              >
                Solicitar Novo Link
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
            <CardTitle>Nova Senha</CardTitle>
            <CardDescription>
              Digite sua nova senha abaixo
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  Nova Senha
                </label>
                <AnimatedBorderInput>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="border-0 focus-visible:ring-0 bg-transparent"
                  />
                </AnimatedBorderInput>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Nova Senha
                </label>
                <AnimatedBorderInput>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-0 focus-visible:ring-0 bg-transparent"
                  />
                </AnimatedBorderInput>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Atualizar Senha
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
          </form>
        </Card>
      </motion.div>
    </AuroraBackground>
  );
};

export default ResetPasswordPage; 