
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StarBorder } from '@/components/ui/star-border';
import Logo from './Logo';
import { BackgroundBeams } from '@/components/ui/background-beams';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Enhanced blue gradient background effects */}
      <BackgroundBeams className="opacity-70" />
      
      <div className="w-full max-w-md p-4 z-10">
        <div className="flex justify-center mb-10">
          <Logo className="h-20" />
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
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
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <StarBorder as="button" type="submit" className="w-full" color="#1EAEDB">
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </StarBorder>
              <p className="mt-4 text-center text-sm">
                {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-arca-blue hover:underline"
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
