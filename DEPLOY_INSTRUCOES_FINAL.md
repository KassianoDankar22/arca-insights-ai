# 🚀 INSTRUÇÕES DE DEPLOY FINAL

## 📋 **CHECKLIST PRÉ-DEPLOY**

### ✅ **Arquivos Preparados:**
- `deploy_producao_final/` - Build completo
- `.htaccess` - Configuração SPA corrigida
- Scripts SQL prontos para execução

### ✅ **Edge Functions:**
- `set-admin-role` - Funcionalidade de admin
- `reset-user-password` - Reset de senhas

---

## 🎯 **PASSO 1: DEPLOY DAS EDGE FUNCTIONS**

### **No Supabase Dashboard:**

1. **Acesse:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Vá em:** Functions → Create Function
3. **Crie as seguintes funções:**

#### **Função: set-admin-role**
```typescript
// Cole o conteúdo de: supabase/functions/set-admin-role/index.ts
```

#### **Função: reset-user-password**
```typescript
// Cole o conteúdo de: supabase/functions/reset-user-password/index.ts
```

### **Teste as Functions:**
```bash
# Teste no terminal após deploy
curl -X POST 'https://SEU_PROJETO.supabase.co/functions/v1/set-admin-role' \
  -H 'Authorization: Bearer ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"userId": "test-user-id"}'
```

---

## 🗄️ **PASSO 2: CONFIGURAR BANCO DE DADOS**

### **Execute no SQL Editor do Supabase:**

#### **2.1. Criar Super Admin**
```sql
-- Cole o conteúdo completo de: criar_admin_teste.sql
-- Isso criará admin@teste.com com senha 123456
```

#### **2.2. Corrigir Kelsey (Opcional)**
```sql
-- Cole o conteúdo de: corrigir_login_kelsey.sql
-- Para dar acesso de super admin à Kelsey
```

### **Verificar Criação:**
- ✅ Login com `admin@teste.com` / `123456`
- ✅ Acesso ao painel administrativo
- ✅ Todos os botões funcionando

---

## 🌐 **PASSO 3: DEPLOY DO FRONTEND**

### **Opção A: Upload Manual (Hostinger/cPanel)**

1. **Acesse o File Manager** do seu hosting
2. **Vá para a pasta public_html** (ou equivalente)
3. **Delete arquivos antigos** (faça backup antes)
4. **Upload todos os arquivos** da pasta `deploy_producao_final/`
5. **Certifique-se** que o `.htaccess` foi enviado

### **Opção B: FTP**
```bash
# Exemplo com FileZilla ou similar
# Conecte-se ao servidor
# Navegue até public_html
# Upload da pasta deploy_producao_final/*
```

### **Opção C: Git Deploy (se configurado)**
```bash
# Se você tem deploy automático via Git
git add deploy_producao_final/
git commit -m "Deploy final com todas as funcionalidades"
git push origin main
```

---

## 🔧 **PASSO 4: VERIFICAÇÕES PÓS-DEPLOY**

### **4.1. Teste de Roteamento SPA**
- ✅ Visite: `gaiaflow.io/ferramentas`
- ✅ Pressione F5 (não deve dar 404)
- ✅ Navegue: `gaiaflow.io/analise/tom`
- ✅ Teste todas as rotas principais

### **4.2. Teste de Autenticação**
- ✅ Login: `admin@teste.com` / `123456`
- ✅ Acesso ao dashboard admin
- ✅ Teste "Esqueci senha" 
- ✅ Geração de senha temporária

### **4.3. Teste Painel Admin**
- ✅ Botão "Tornar Admin"
- ✅ Botão "Promover para Pro"
- ✅ Botão "Resetar Senha"
- ✅ Botão "Exportar Dados"
- ✅ Todos os filtros e buscas

### **4.4. Teste de Performance**
- ✅ Carregamento rápido das páginas
- ✅ Assets comprimidos carregando
- ✅ Cache headers funcionando

---

## ⚠️ **TROUBLESHOOTING**

### **Problema: 404 em rotas**
```apache
# Verifique se o .htaccess está no lugar certo:
# public_html/.htaccess (não em subpasta)

# Conteúdo mínimo necessário:
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### **Problema: Edge Functions não funcionam**
1. Verifique se foram deployadas corretamente
2. Confirme as URLs das functions
3. Teste com curl diretamente
4. Verifique logs no Supabase

### **Problema: Login não funciona**
1. Execute novamente o SQL de criação do admin
2. Verifique se o email foi confirmado
3. Teste reset de senha
4. Verifique logs de erro no console

### **Problema: Painel admin sem funcionalidades**
1. Confirme que as Edge Functions estão ativas
2. Verifique permissões do usuário
3. Teste em aba anônima (limpar cache)

---

## 📊 **MONITORAMENTO PÓS-DEPLOY**

### **Supabase Dashboard:**
- 📈 **Database:** Monitorar queries e performance
- 🔧 **Functions:** Verificar invocações e erros
- 👥 **Auth:** Acompanhar logins e registros
- 📋 **Logs:** Verificar erros em tempo real

### **Google Analytics (se configurado):**
- 📈 Tráfego nas novas páginas
- ⏱️ Tempo de carregamento
- 🚪 Taxa de rejeição
- 🔄 Fluxo de usuários

---

## 🎉 **SUCESSO DO DEPLOY**

### **✅ Confirmação Final:**
Quando tudo estiver funcionando, você deve ter:

1. **Site carregando** em todas as rotas
2. **Login funcionando** com admin@teste.com
3. **Painel admin completo** com todos os botões
4. **Reset de senha** funcionando nas duas modalidades
5. **Performance otimizada** com assets comprimidos

### **🚀 Próximos Passos:**
- Configurar monitoramento contínuo
- Backup regular do banco de dados
- Atualizações incrementais quando necessário
- Training dos usuários admin nas novas funcionalidades

---

## 📞 **SUPORTE**

Se algo não funcionar:

1. **Verifique logs** do Supabase Dashboard
2. **Console do navegador** para erros JavaScript
3. **Network tab** para erros de API
4. **Compare com arquivos locais** que funcionam

**🎯 O sistema está PRONTO PARA PRODUÇÃO!** 