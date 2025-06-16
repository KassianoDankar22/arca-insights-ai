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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Settings className="mr-2" />
        Configurações
      </h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue="Carlos Oliveira" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="carlos@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Imobiliária</Label>
              <Input id="company" defaultValue="Oliveira Imóveis" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" defaultValue="(11) 98765-4321" />
            </div>
          </div>
          
          <Button className="bg-arca-purple hover:bg-arca-dark-purple">
            Atualizar Perfil
          </Button>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notificationsEmail" className="flex-1">
                Receber notificações por email
              </Label>
              <Switch id="notificationsEmail" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketUpdates" className="flex-1">
                Atualizações semanais de mercado
              </Label>
              <Switch id="marketUpdates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dataSharing" className="flex-1">
                Compartilhar dados anônimos para melhorar o sistema
              </Label>
              <Switch id="dataSharing" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex-1">
                Modo escuro
              </Label>
              <Switch id="darkMode" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input id="currentPassword" type="password" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input id="newPassword" type="password" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          
          <Button className="bg-arca-purple hover:bg-arca-dark-purple">
            Alterar Senha
          </Button>
          
          <hr />
          
          <div>
            <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              Excluir Conta
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
