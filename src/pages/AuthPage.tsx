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
import { useAuth } from '@/lib/auth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { AnimatedBorderInput } from '@/components/AnimatedBorderInput';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar status de autenticação - redirecionar se já estiver logado
  if (user) {
    const from = location.state?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email e senha são obrigatórios');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Login realizado com sucesso!');
      } else {
        await signUp(email, password);
        toast.success('Conta criada com sucesso!');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    
    try {
      await signInWithGoogle();
      // O redirecionamento será automático
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error.message || 'Erro ao fazer login com Google');
      setGoogleLoading(false);
    }
  };

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
            <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Acesse sua conta para continuar' : 'Crie uma nova conta'}
            </CardDescription>
          </CardHeader>
          
          {/* Botão Google */}
          <CardContent className="pb-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 transition-all duration-200 hover:shadow-md"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'Conectando...' : `${isLogin ? 'Entrar' : 'Cadastrar'} com Google`}
            </Button>
          </CardContent>

          {/* Divisor */}
          <CardContent className="pt-0 pb-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500 dark:text-gray-400">
                  ou continue com email
                </span>
              </div>
            </div>
          </CardContent>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0">
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
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <AnimatedBorderInput>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-0 focus-visible:ring-0 bg-transparent"
                  />
                </AnimatedBorderInput>
                {isLogin && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-arca-main hover:text-arca-dark p-0 h-auto"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Esqueceu sua senha?
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <button 
                type="submit"
                className="w-full shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear"
                disabled={loading || googleLoading}
              >
                {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
              <p className="mt-4 text-center text-sm">
                {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-arca-main hover:underline font-medium"
                  disabled={loading || googleLoading}
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </AuroraBackground>
  );
};

export default AuthPage;
