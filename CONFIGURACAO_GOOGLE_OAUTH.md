# 🔑 Configuração do Google OAuth - Arca Insights AI

## 📋 **PASSO A PASSO COMPLETO**

### **1. Configurar Google OAuth no Google Cloud Console**

#### **1.1 Criar Projeto no Google Cloud Console**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google+ API** e **Google Identity Services**

#### **1.2 Configurar OAuth Consent Screen**
1. Vá para **APIs & Services** > **OAuth consent screen**
2. Escolha **External** (para usuários públicos)
3. Preencha as informações obrigatórias:
   - **App name**: Arca Insights AI
   - **User support email**: seu-email@dominio.com
   - **Developer contact information**: seu-email@dominio.com
4. Adicione domínios autorizados:
   - `localhost` (para desenvolvimento)
   - Seu domínio de produção
5. Salve e continue

#### **1.3 Criar Credenciais OAuth**
1. Vá para **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**
3. Tipo de aplicação: **Web application**
4. Nome: **Arca Insights AI Web Client**
5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://seudominio.com
   ```
6. **Authorized redirect URIs**:
   ```
   https://dkykekkdjqajqfyrgqhi.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```
7. Salve e copie o **Client ID** e **Client Secret**

---

### **2. Configurar no Supabase Dashboard**

#### **2.1 Ativar Google Provider**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para seu projeto > **Authentication** > **Providers**
3. Encontre **Google** e clique para configurar
4. Ative o toggle **Enable Google provider**

#### **2.2 Configurar Credenciais**
1. Cole o **Google Client ID** no campo correspondente
2. Cole o **Google Client Secret** no campo correspondente
3. **Redirect URL** já será preenchida automaticamente:
   ```
   https://dkykekkdjqajqfyrgqhi.supabase.co/auth/v1/callback
   ```
4. Salve as configurações

#### **2.3 Configurar URLs de Redirecionamento**
1. Vá para **Authentication** > **URL Configuration**
2. **Site URL**: `http://localhost:5173` (desenvolvimento)
3. **Redirect URLs** (adicionar ambas):
   ```
   http://localhost:5173/dashboard
   https://seudominio.com/dashboard
   ```

---

### **3. Configurar RLS (Row Level Security)**

#### **3.1 Política para Auto-inserção de Usuários**
Execute no **SQL Editor** do Supabase:

```sql
-- Função para inserir usuário automaticamente
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (
    id, 
    nome_completo, 
    email, 
    avatar_url, 
    criado_em, 
    atualizado_em
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      NEW.email
    ),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    nome_completo = COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      usuarios.nome_completo
    ),
    avatar_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      usuarios.avatar_url
    ),
    atualizado_em = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();
```

---

### **4. Testar a Configuração**

#### **4.1 Teste Local**
1. Certifique-se que o servidor está rodando: `npm run dev`
2. Acesse `http://localhost:5173`
3. Clique em **"Entrar com Google"**
4. Autorize o aplicativo
5. Deve redirecionar para `/dashboard`

#### **4.2 Verificar Dados**
1. No Supabase Dashboard > **Table Editor** > **usuarios**
2. Verifique se o usuário foi criado automaticamente
3. Confirme se os dados do Google foram importados:
   - **nome_completo**: Nome do perfil Google
   - **email**: Email do Google
   - **avatar_url**: Foto do perfil Google

---

### **5. Troubleshooting**

#### **❌ Erro: "Invalid redirect URI"**
- Verificar se todas as URLs estão configuradas corretamente
- Certificar que não há espaços ou barras extras nas URLs

#### **❌ Erro: "Access blocked"**
- Verificar se o OAuth Consent Screen foi configurado
- Adicionar seu email como usuário de teste se ainda em desenvolvimento

#### **❌ Erro: "User not found in database"**
- Verificar se o trigger `handle_new_user` foi criado
- Executar o SQL de configuração RLS

#### **❌ Redirecionamento não funciona**
- Verificar URLs de redirecionamento no Google Cloud Console
- Confirmar configuração no Supabase > Authentication > URL Configuration

---

### **6. Configuração para Produção**

#### **6.1 Atualizar URLs**
1. **Google Cloud Console**:
   - Adicionar domínio de produção nas Authorized Origins
   - Adicionar redirect URI de produção
2. **Supabase Dashboard**:
   - Atualizar Site URL para domínio de produção
   - Adicionar Redirect URL de produção

#### **6.2 Segurança**
- Manter Client Secret seguro e privado
- Configurar CORS adequadamente
- Usar HTTPS em produção

---

## ✅ **CHECKLIST FINAL**

- [ ] Google Cloud Console configurado
- [ ] OAuth Consent Screen preenchido
- [ ] Credenciais OAuth criadas
- [ ] Supabase Provider habilitado
- [ ] Client ID e Secret configurados
- [ ] URLs de redirecionamento configuradas
- [ ] Trigger de auto-inserção criado
- [ ] Teste local funcionando
- [ ] Dados sendo salvos corretamente

---

## 🎯 **RESULTADO ESPERADO**

Após a configuração completa:
1. ✅ Botão "Entrar com Google" visível na tela de login
2. ✅ Redirecionamento para Google OAuth funcional
3. ✅ Usuário criado automaticamente na tabela `usuarios`
4. ✅ Dados do perfil Google importados
5. ✅ Redirecionamento para dashboard após login
6. ✅ Sessão mantida entre recarregamentos

**🚀 Agora seus usuários podem fazer login com Google de forma segura e prática!** 