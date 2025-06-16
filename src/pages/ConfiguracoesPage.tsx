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
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit3, Loader2, KeyRound, UserCircle, Settings } from 'lucide-react';
import AdminDebugPanel from '@/components/AdminDebugPanel';

// Interface para o perfil do usuário
interface UserProfile {
  nome_completo: string | null;
  email: string | null; 
  telefone: string | null;
  avatar_url: string | null;
}

const ConfiguracoesPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>({ 
    nome_completo: '', 
    email: '', 
    telefone: '', 
    avatar_url: null 
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Simular dados do usuário para demonstração
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setIsLoading(true);
      
      // Simulando dados do usuário
      const currentUser = {
        id: 'user-123',
        email: 'usuario@exemplo.com',
        user_metadata: {
          full_name: 'João Silva Santos',
          avatar_url: null
        }
      };

      const initialProfileState: UserProfile = {
        nome_completo: currentUser.user_metadata?.full_name || 'João Silva Santos',
        email: currentUser.email || 'usuario@exemplo.com',
        telefone: '(11) 99999-9999',
        avatar_url: currentUser.user_metadata?.avatar_url || null,
      };

      setUser(currentUser);
      setProfile(initialProfileState);
      setIsLoading(false);
    };

    fetchUserAndProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdatingProfile(true);
    
    // Simular atualização do perfil
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API
      toast.success("Perfil atualizado com sucesso!");
      console.log('Perfil atualizado:', {
        nome_completo: profile.nome_completo,
        telefone: profile.telefone
      });
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
    
    setIsUpdatingProfile(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API
      toast.success("Senha atualizada com sucesso!");
      setNewPassword('');
      setConfirmNewPassword('');
      console.log('Senha atualizada');
    } catch (error) {
      toast.error("Erro ao atualizar senha");
    }
    
    setIsUpdatingPassword(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    
    const file = event.target.files[0];
    setIsUploadingAvatar(true);

    try {
      // Simular upload do avatar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular URL do avatar
      const newAvatarUrl = `https://via.placeholder.com/150?text=${encodeURIComponent(profile.nome_completo?.charAt(0) || 'U')}`;
      const newAvatarUrlWithCacheBust = `${newAvatarUrl}&t=${new Date().getTime()}`;

      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrlWithCacheBust }));
      toast.success("Avatar atualizado com sucesso!");
      console.log('Avatar atualizado:', file.name);
    } catch (error) {
      toast.error("Erro ao atualizar avatar");
    }
    
    setIsUploadingAvatar(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="ml-4 text-xl text-gray-500 mt-4">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 h-8 w-8 text-blue-600" />
            Configurações da Conta
          </h1>
          <p className="text-gray-600 mt-1 ml-11">Gerencie suas informações pessoais e de segurança.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna da Foto de Perfil */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar 
                  className="h-32 w-32 cursor-pointer relative group" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AvatarImage 
                    src={profile.avatar_url || undefined} 
                    alt={profile.nome_completo || user?.email || 'User'} 
                  />
                  <AvatarFallback className="text-3xl tracking-wider">
                    {profile.nome_completo 
                      ? profile.nome_completo.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                      : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')
                    }
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-200">
                    {isUploadingAvatar ? 
                      <Loader2 className="h-8 w-8 text-white animate-spin" /> :
                      <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    }
                  </div>
                </Avatar>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploadingAvatar} 
                  className='w-full'
                >
                  {isUploadingAvatar ? 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                    <Edit3 className="mr-2 h-4 w-4" />
                  }
                  Alterar Foto
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Coluna das Configurações */}
          <div className="lg:col-span-2 space-y-8">
            {/* Card de Informações Pessoais */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <UserCircle className="mr-2 h-6 w-6 text-blue-600" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>Atualize seu nome, e-mail e telefone.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome_completo">Nome Completo</Label>
                    <Input 
                      id="nome_completo" 
                      value={profile.nome_completo || ''} 
                      onChange={(e) => setProfile({ ...profile, nome_completo: e.target.value })} 
                      placeholder="Seu nome completo" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email || ''} 
                      readOnly 
                      disabled 
                      className="cursor-not-allowed bg-gray-100" 
                    />
                    <p className="text-xs text-gray-500">Para alterar seu e-mail, entre em contato com o suporte.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      type="tel" 
                      value={profile.telefone || ''} 
                      onChange={(e) => setProfile({ ...profile, telefone: e.target.value })} 
                      placeholder="(XX) XXXXX-XXXX" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button 
                    type="submit" 
                    disabled={isUpdatingProfile} 
                    className='bg-arca-main hover:bg-arca-dark'
                  >
                    {isUpdatingProfile ? 
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                      <Edit3 className="mr-2 h-4 w-4" />
                    }
                    Salvar Informações
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Card de Alterar Senha */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <KeyRound className="mr-2 h-6 w-6 text-blue-600" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>Escolha uma senha forte e que você não use em outro lugar.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Pelo menos 6 caracteres" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirmNewPassword" 
                      type="password" 
                      value={confirmNewPassword} 
                      onChange={(e) => setConfirmNewPassword(e.target.value)} 
                      placeholder="Repita a nova senha" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button 
                    type="submit" 
                    disabled={isUpdatingPassword} 
                    className='bg-arca-main hover:bg-arca-dark'
                  >
                    {isUpdatingPassword ? 
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                      <KeyRound className="mr-2 h-4 w-4" />
                    }
                    Atualizar Senha
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Panel de Debug Admin */}
      <AdminDebugPanel />
    </div>
  );
};

export default ConfiguracoesPage; 