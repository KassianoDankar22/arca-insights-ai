'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit3, Loader2, KeyRound, UserCircle, SettingsIcon } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Interface unificada para o estado do perfil e para os dados que podem vir da tabela
interface UserProfile {
  nome_completo: string | null;
  email: string | null; 
  telefone: string | null;
  avatar_url: string | null;
}

const ConfiguracoesPage = () => {
  const [user, setUser] = useState<User | null>(null);
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

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setIsLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || !session.user) {
        toast.error("Erro ao buscar sessão", { description: sessionError?.message || 'Usuário não autenticado.'});
        setIsLoading(false);
        return;
      }
      const currentAuthUser = session.user;
      setUser(currentAuthUser);

      // Tipagem para os dados esperados da tabela 'usuarios'
      type TableProfileData = Pick<UserProfile, 'nome_completo' | 'telefone' | 'avatar_url'>;

      const { data: tableData, error: profileError } = await supabase
        .from('usuarios')
        .select('nome_completo, telefone, avatar_url')
        .eq('id', currentAuthUser.id)
        .single<TableProfileData>(); 

      const initialProfileState: UserProfile = {
        nome_completo: currentAuthUser.user_metadata?.full_name || tableData?.nome_completo || '',
        email: currentAuthUser.email || '', // Email sempre do Auth
        telefone: tableData?.telefone || '',
        avatar_url: currentAuthUser.user_metadata?.avatar_url || tableData?.avatar_url || null,
      };

      if (profileError && profileError.code !== 'PGRST116') {
        toast.error("Erro ao buscar perfil do banco de dados", { description: profileError.message });
        // Mesmo com erro, o initialProfileState já tem fallbacks do Auth e tableData (se houver)
      }
      // Se tableData for nulo (PGRST116 ou outro caso), os fallbacks do Auth já foram aplicados.
      
      setProfile(initialProfileState);
      setIsLoading(false);
    };
    fetchUserAndProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    const updates = {
      id: user.id,
      nome_completo: profile.nome_completo,
      telefone: profile.telefone,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('usuarios').upsert(updates).eq('id', user.id);
    if (error) {
      toast.error("Erro ao atualizar perfil", { description: error.message });
    } else {
      toast.success("Perfil atualizado com sucesso!");
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: { full_name: profile.nome_completo }
      });
      if (userUpdateError) {
        toast.warning("Perfil salvo, mas erro ao atualizar metadados do usuário Auth.", { description: userUpdateError.message });
      }
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
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("Erro ao atualizar senha", { description: error.message });
    } else {
      toast.success("Senha atualizada com sucesso!");
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setIsUpdatingPassword(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = fileName;
    setIsUploadingAvatar(true);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Erro no upload do avatar", { description: uploadError.message });
      setIsUploadingAvatar(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    if (!publicUrlData?.publicUrl) {
        toast.error("Erro ao obter URL pública do avatar.");
        setIsUploadingAvatar(false);
        return;
    }
    const newAvatarUrl = publicUrlData.publicUrl;

    const newAvatarUrlWithCacheBust = `${newAvatarUrl}?t=${new Date().getTime()}`;

    const { error: dbError } = await supabase
      .from('usuarios')
      .update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    const { error: userUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl }
    });

    if (dbError || userUpdateError) {
      toast.error("Avatar enviado, mas erro ao salvar URL no perfil.", { description: dbError?.message || userUpdateError?.message });
    } else {
      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrlWithCacheBust }));
      toast.success("Avatar atualizado com sucesso!");
    }
    setIsUploadingAvatar(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-8 bg-arca-base min-h-screen flex justify-center items-center">
          <Loader2 className="h-12 w-12 text-arca-main animate-spin" />
          <p className="ml-4 text-xl text-gray-500">Carregando dados...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 py-8 md:p-8 bg-arca-base">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-arca-dark flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-arca-blue" /> Configurações da Conta
          </h1>
          <p className="text-gray-600 mt-1 ml-11">Gerencie suas informações pessoais e de segurança.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 cursor-pointer relative group" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.nome_completo || user?.email || 'User'} />
                  <AvatarFallback className="text-3xl tracking-wider">
                    {profile.nome_completo ? profile.nome_completo.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
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
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar} className='w-full'>
                  {isUploadingAvatar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
                  Alterar Foto
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'><UserCircle className="mr-2 h-6 w-6 text-arca-blue" /> Informações Pessoais</CardTitle>
                <CardDescription>Atualize seu nome, e-mail e telefone.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome_completo">Nome Completo</Label>
                    <Input id="nome_completo" value={profile.nome_completo || ''} onChange={(e) => setProfile({ ...profile, nome_completo: e.target.value })} placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={profile.email || ''} readOnly disabled className="cursor-not-allowed bg-gray-100" />
                    <p className="text-xs text-gray-500">Para alterar seu e-mail, entre em contato com o suporte.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" type="tel" value={profile.telefone || ''} onChange={(e) => setProfile({ ...profile, telefone: e.target.value })} placeholder="(XX) XXXXX-XXXX" />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button type="submit" disabled={isUpdatingProfile} className='bg-arca-blue hover:bg-arca-dark-blue'>
                    {isUpdatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
                    Salvar Informações
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'><KeyRound className="mr-2 h-6 w-6 text-arca-blue" /> Alterar Senha</CardTitle>
                <CardDescription>Escolha uma senha forte e que você não use em outro lugar.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Pelo menos 6 caracteres" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Repita a nova senha" />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button type="submit" disabled={isUpdatingPassword} className='bg-arca-blue hover:bg-arca-dark-blue'>
                    {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                    Atualizar Senha
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConfiguracoesPage; 