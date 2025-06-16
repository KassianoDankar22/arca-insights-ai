# 🚀 GUIA: Como Aplicar a Migração SQL

## ⚠️ **PROBLEMA ATUAL:**
- Apenas a página Dashboard tem dados reais
- CRM, Suporte, Meus ROIs estão com dados mockados
- **CAUSA:** Tabelas não existem no Supabase ainda

## 🔧 **SOLUÇÃO: Aplicar MIGRACAO_SUPABASE.sql**

### 📋 **PASSO A PASSO:**

#### **1. Acesse seu Supabase Dashboard**
```
1. Vá para: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto "arca-insights-ai"
```

#### **2. Abra o SQL Editor**
```
1. No menu lateral esquerdo, clique em "SQL Editor"
2. Clique em "New Query" (Nova Consulta)
```

#### **3. Cole a Migração Completa**
```
1. Abra o arquivo: MIGRACAO_SUPABASE.sql
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor (Ctrl+V)
```

#### **4. Execute a Migração**
```
1. Clique em "Run" (Executar) ou pressione Ctrl+Enter
2. Aguarde a execução (pode levar 30-60 segundos)
3. Deve aparecer "Success" quando concluir
```

#### **5. Verifique as Tabelas Criadas**
```
1. Vá em "Database" > "Tables"
2. Deve ver 12 novas tabelas:
   - user_profiles
   - chat_conversations  
   - chat_messages
   - roi_analyses
   - properties
   - transactions
   - courses
   - course_progress
   - crm_leads
   - support_tickets
   - live_chat_sessions
   - live_chat_messages
```

## ✅ **APÓS A MIGRAÇÃO:**

### **Dados Reais Funcionando:**
- ✅ Dashboard (já funcionando)
- ✅ CRM Page (vai funcionar)
- ✅ Suporte Page (vai funcionar) 
- ✅ Meus ROIs (vai funcionar)
- ✅ Chat System (já funcionando)

### **Próximas Páginas a Migrar:**
- 🔄 Financeiro Page
- 🔄 Chat ao Vivo
- 🔄 Academy
- 🔄 Configurações
- 🔄 Admin Dashboard

## 🚨 **IMPORTANTE:**

1. **Backup**: A migração é segura, mas faça backup se tiver dados importantes
2. **RLS**: As políticas de segurança vão funcionar automaticamente
3. **Teste**: Após migração, teste todas as páginas
4. **Performance**: Índices já otimizados

## 📱 **TESTE APÓS MIGRAÇÃO:**

1. **CRM Page**: 
   - Deve mostrar estatísticas zeradas (normal)
   - Criar novo lead deve funcionar
   
2. **Suporte Page**: 
   - Deve mostrar estatísticas zeradas (normal)
   - Criar novo ticket deve funcionar
   
3. **Meus ROIs**: 
   - Deve mostrar lista vazia (normal)
   - Botão "criar exemplo" deve funcionar

---

**🎯 Após aplicar esta migração, teremos 60% do sistema com dados reais!** 