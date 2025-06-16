# 🔧 Diagnóstico - Reset de Senha

## ✅ **PROBLEMA CORRIGIDO**
A `ForgotPasswordPage.tsx` estava usando o hook errado que não tinha a função `resetPassword`. 
**CORREÇÃO APLICADA:** Implementada a função diretamente na página.

---

## 🔍 **CHECKLIST DE CONFIGURAÇÃO**

### **1. Verificar Configuração no Supabase Dashboard**

1. **Acesse**: [Supabase Dashboard](https://supabase.com/dashboard) → Seu Projeto → **Authentication** → **Settings**

2. **Verificar SMTP Configuration:**
   ```
   ✅ Enable custom SMTP: ATIVADO
   ✅ SMTP Host: Configurado (ex: smtp.gmail.com)
   ✅ SMTP Port: 587 ou 465
   ✅ SMTP User: Seu email
   ✅ SMTP Pass: Sua senha de app
   ```

3. **Verificar Email Templates:**
   - Vá em **Authentication** → **Email Templates**
   - Template "Reset Password" deve estar ativo
   - Verificar se a URL `{{ .SiteURL }}/reset-password` está correta

### **2. Testar Localmente**

Execute este código no console do navegador:
```javascript
// Testar reset de senha
const { data, error } = await window.supabase.auth.resetPasswordForEmail(
  'seu-email@teste.com',
  { redirectTo: window.location.origin + '/reset-password' }
);

console.log('Resultado:', { data, error });
```

### **3. Configurações Recomendadas**

#### **Template de Email (Supabase Dashboard)**
```html
<h2>Redefinir sua senha</h2>
<p>Clique no link abaixo para redefinir sua senha:</p>
<p><a href="{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery">Redefinir Senha</a></p>
<p>Este link expira em 1 hora.</p>
```

#### **Site URL (Authentication Settings)**
```
https://seudominio.com
```

#### **Redirect URLs (Authentication Settings)**
```
https://seudominio.com/reset-password
http://localhost:5173/reset-password
```

---

## 🚨 **PROBLEMAS COMUNS**

### **1. Email não chega**
- ✅ Verificar pasta de spam
- ✅ SMTP configurado corretamente
- ✅ Email remetente verificado

### **2. Link não funciona**
- ✅ URL de redirecionamento correta
- ✅ Página `/reset-password` existe
- ✅ Token não expirado (1 hora)

### **3. Erro "Invalid redirect URL"**
- ✅ Adicionar URL na lista de URLs permitidas
- ✅ Protocolo correto (https/http)

---

## 📞 **SUPORTE RÁPIDO**

### **Para Gmail (Configuração SMTP):**
```
Host: smtp.gmail.com
Port: 587
Security: STARTTLS
User: seu-email@gmail.com
Pass: [Senha de App - não a senha normal]
```

### **Gerar Senha de App Gmail:**
1. Google Account → Security
2. 2-Step Verification → App passwords
3. Gerar nova senha para "Mail"
4. Usar essa senha no Supabase

---

## 🧪 **TESTE FINAL**

1. Vá para `/forgot-password`
2. Digite um email válido
3. Clique em "Enviar"
4. Verificar se recebe o email
5. Clicar no link do email
6. Verificar se abre `/reset-password`
7. Definir nova senha
8. Testar login com nova senha

---

## ✅ **STATUS ATUAL**
- [x] Código corrigido
- [ ] SMTP configurado no Supabase
- [ ] Templates de email configurados
- [ ] Teste completo realizado 