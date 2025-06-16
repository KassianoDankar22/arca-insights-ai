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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Logo from './Logo';
import { AnimatedBorderInput } from './AnimatedBorderInput';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { AuroraBackground } from './ui/aurora-background';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em uma implementação real, aqui chamaríamos a API de autenticação do Supabase
    console.log('Login/cadastro simulado:', { email, password, name });
    onLogin();
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
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <AnimatedBorderInput>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="border-0 focus-visible:ring-0 bg-transparent"
                    />
                  </AnimatedBorderInput>
                </div>
              )}
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <RainbowButton 
                type="submit"
                className="w-full transition-transform duration-300 hover:scale-[1.02]"
              >
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </RainbowButton>
              <p className="mt-4 text-center text-sm">
                {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-arca-main hover:underline font-medium"
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

export default Login;
