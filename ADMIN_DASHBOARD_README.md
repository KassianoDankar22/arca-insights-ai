# Dashboard Administrativo - Arca AI

## 🎯 Visão Geral

Sistema completo de dashboard administrativo para gerenciar usuários, análises ROI, assinaturas e todas as operações do Arca AI. O sistema foi implementado com controles de acesso baseados em níveis de permissão.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **administradores** - Controle de acesso administrativo
2. **usuarios** - Dados estendidos dos usuários
3. **analises_roi** - Histórico de análises realizadas
4. **assinaturas** - Controle de planos e pagamentos
5. **logs_atividade** - Auditoria de ações do sistema
6. **tickets_suporte** - Sistema de suporte
7. **configuracoes_sistema** - Configurações globais
8. **metricas_diarias** - Dados consolidados por dia
9. **notificacoes_admin** - Notificações para administradores

### Views Úteis

- **view_usuarios_stats** - Usuários com estatísticas agregadas
- **view_metricas_gerais** - Métricas consolidadas do sistema

## 🔐 Sistema de Permissões

### Níveis de Acesso

1. **Super Admin**
   - Acesso total a todas as funcionalidades
   - Permissão: `["all"]`

2. **Admin**
   - Acesso à maioria dos recursos
   - Permissões: `["users", "analytics", "support", "settings"]`

3. **Moderador**
   - Acesso limitado a suporte e usuários
   - Permissões: `["support", "users:read"]`

### Como Usar

```typescript
import { useAdmin } from '@/hooks/useAdmin';

const { isAdmin, canAccess, adminLevel } = useAdmin();

// Verificar se é admin
if (isAdmin) {
  // Mostrar conteúdo administrativo
}

// Verificar permissão específica
if (canAccess('users')) {
  // Mostrar gestão de usuários
}
```

## 🏗️ Estrutura de Componentes

### Layout Administrativo

```
src/components/admin/
├── AdminLayout.tsx          # Layout principal do admin
└── AdminTestControls.tsx    # Controles de teste (dev)

src/pages/admin/
├── AdminDashboard.tsx       # Dashboard principal
├── AdminUsers.tsx          # Gerenciamento de usuários
└── AdminAnalytics.tsx      # Análises e relatórios
```

### Hooks Personalizados

- **useAdmin()** - Gerencia permissões administrativas
- **useUserPlan()** - Controla planos dos usuários

## 📊 Funcionalidades Implementadas

### 1. Dashboard Principal (/admin)
- **Métricas em tempo real**: usuários ativos, análises, receita, conversão
- **Gráficos interativos**: crescimento de usuários, receita mensal
- **Distribuição de planos**: gráfico de pizza com planos
- **Atividade recente**: feed de ações importantes
- **Tickets de suporte**: resumo de status

### 2. Gerenciamento de Usuários (/admin/users)
- **Lista completa** com busca e filtros
- **Estatísticas por usuário**: análises realizadas, receita gerada
- **Ações rápidas**: editar, bloquear, enviar email
- **Filtros avançados**: por status, plano, data de cadastro
- **Export de dados**: CSV/Excel

### 3. Análises ROI (/admin/analytics)
- **Visualização de todas as análises** realizadas no sistema
- **Métricas agregadas**: ROI médio, análises por dia
- **Gráficos por tipo** de propriedade
- **Filtros por status**: concluída, rascunho, erro
- **Detalhes completos**: usuário, localização, valores

## 🚀 Como Configurar

### 1. Executar o SQL

Execute o arquivo `admin_dashboard_schema.sql` no Supabase SQL Editor:

```sql
-- O arquivo contém todas as tabelas, índices, triggers e dados iniciais
```

### 2. Configurar Primeiro Admin

Após criar as tabelas, defina o primeiro usuário admin:

```sql
-- Substitua 'seu-uuid-aqui' pelo ID do usuário
INSERT INTO administradores (usuario_id, nivel_acesso, permissoes, criado_por) 
VALUES ('seu-uuid-aqui', 'super_admin', '["all"]', 'seu-uuid-aqui');
```

### 3. Testar em Desenvolvimento

Use os controles de teste no dashboard principal:

```typescript
// Simular nível admin
simulateAdminLevel('super_admin');
simulateAdminLevel('admin');
simulateAdminLevel('moderador');

// Remover acesso
simulateAdminLevel(null);
```

## 🎨 Interface e UX

### Design System
- **Tema escuro** para sidebar administrativa
- **Cards com hover effects** e animações suaves
- **Gráficos responsivos** com Recharts
- **Tabelas com filtros** e paginação
- **Badges coloridos** para status e planos

### Responsividade
- **Mobile-first**: design adaptável para todas as telas
- **Sidebar colapsível** em dispositivos móveis
- **Tabelas responsivas** com scroll horizontal
- **Navegação touch-friendly**

## 🔧 Controles de Desenvolvimento

Durante o desenvolvimento, você pode:

1. **Simular níveis de admin** usando os controles de teste
2. **Alternar entre planos** para testar interfaces
3. **Visualizar diferentes permissões** em tempo real

### Controles Disponíveis

```typescript
// Planos de usuário
window.simulateUpgrade('free' | 'pro' | 'enterprise');

// Níveis administrativos
window.simulateAdminLevel('super_admin' | 'admin' | 'moderador' | null);
```

## 📈 Métricas e Relatórios

### Dados Disponíveis
- **Usuários**: cadastros, ativações, retenção
- **Análises**: volume diário, ROI médio, tipos de propriedade
- **Receita**: MRR, conversões, churn
- **Suporte**: tickets por status, tempo de resolução

### Gráficos Implementados
- **Linha**: crescimento de usuários
- **Barras**: receita mensal, análises por tipo
- **Pizza**: distribuição de planos
- **Cards**: métricas principais com tendências

## 🔄 Fluxo de Dados

```
1. Usuário faz login → Verificação de permissões admin
2. Hook useAdmin() → Consulta tabela administradores
3. Retorna nível de acesso → Interface se adapta
4. Componentes verificam permissões → Mostram/ocultam recursos
5. Ações administrativas → Log de auditoria
```

## 🛡️ Segurança

- **Row Level Security (RLS)** habilitado em tabelas sensíveis
- **Verificação de permissões** em cada componente
- **Logs de auditoria** para todas as ações administrativas
- **Sanitização de inputs** em formulários
- **Controle de acesso** baseado em JWT do Supabase

## 🚀 Próximos Passos

### Funcionalidades Planejadas
1. **Gerenciamento de Assinaturas** (/admin/subscriptions)
2. **Sistema de Tickets** (/admin/support)
3. **Logs de Atividade** (/admin/logs)
4. **Configurações do Sistema** (/admin/settings)
5. **Relatórios Avançados** (/admin/reports)

### Melhorias Técnicas
- Integração real com Supabase
- Cache de dados para performance
- Notificações em tempo real
- Export de relatórios em PDF
- Sistema de backup automático

## 📝 Notas de Desenvolvimento

- Use `process.env.NODE_ENV === 'development'` para controles de teste
- Componentes administrativos usam layout separado
- Todas as permissões são verificadas client-side e server-side
- Mock data pode ser substituído por dados reais do Supabase

---

**Sistema desenvolvido com:**
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts para gráficos
- Supabase para backend
- React Router para navegação

Para dúvidas ou melhorias, consulte a documentação dos componentes individuais. 