# 🎯 PLANO PARA DADOS REAIS - ARCA INSIGHTS AI
*Criado em: 21/05/2025*

## 📋 **SITUAÇÃO ATUAL**

### **Problemas Identificados:**
1. **Chat e Conversações** - Usando dados simulados/mock
2. **Dashboard Admin** - Dados fictícios em todas as métricas
3. **Páginas de Usuários** - Perfis e estatísticas mockados
4. **Financeiro** - Transações e propriedades fictícias
5. **Academy** - Cursos e progresso simulados
6. **CRM** - Leads e pipeline fake
7. **Suporte** - Tickets simulados
8. **Análises ROI** - Mistura de dados reais e mock

---

## 🔧 **PLANO DE CORREÇÃO**

### **FASE 1: INFRAESTRUTURA DE DADOS** ⚡

#### **1.1 Configuração do Banco de Dados (Supabase)**
- [ ] Criar/atualizar schema completo para dados reais
- [ ] Configurar Row Level Security (RLS) 
- [ ] Implementar triggers para timestamps automáticos
- [ ] Configurar índices para performance
- [ ] Setup de backups automáticos

#### **1.2 Autenticação Real** 
```typescript
// Substituir useAuth mock por implementação real
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}
```

---

### **FASE 2: CHAT E CONVERSAÇÕES** 💬

#### **2.1 Chat Principal (TOM AI)**
- [ ] Conectar com OpenAI Assistant API (já funcionando)
- [ ] Salvar histórico de conversas no Supabase
- [ ] Implementar resumos automáticos
- [ ] Sistema de favoritos/bookmarks

```sql
-- Nova tabela para histórico de chat
CREATE TABLE chat_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    thread_id VARCHAR(255), -- OpenAI Thread ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT false,
    summary TEXT
);

CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);
```

#### **2.2 Chat de Suporte ao Vivo**
- [ ] Sistema de tickets integrado
- [ ] Notificações em tempo real (Supabase Realtime)
- [ ] Status de agentes online
- [ ] Histórico de conversas salvo

---

### **FASE 3: DASHBOARD E ANALYTICS** 📊

#### **3.1 Dashboard Principal**
- [ ] Métricas reais de uso da plataforma
- [ ] Gráficos baseados em dados do banco
- [ ] KPIs reais de performance
- [ ] Filtros por período funcional

```typescript
// Substituir dados mock por queries reais
const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [analyses, users, revenue] = await Promise.all([
        supabase.from('roi_analyses').select('*'),
        supabase.from('user_profiles').select('*'),
        supabase.from('transactions').select('*')
      ]);
      
      setData({ analyses, users, revenue });
      setLoading(false);
    };
    
    fetchData();
  }, []);

  return { data, loading };
};
```

#### **3.2 Admin Dashboard**
- [ ] Estatísticas reais de usuários
- [ ] Métricas de uso da IA
- [ ] Performance de análises ROI
- [ ] Monitoramento de sistema

---

### **FASE 4: GESTÃO DE USUÁRIOS** 👥

#### **4.1 Perfis de Usuário**
- [ ] Sistema de planos real (free/pro/enterprise)
- [ ] Limites de uso baseados no plano
- [ ] Histórico de atividades real
- [ ] Configurações personalizadas

```sql
-- Tabela de perfis completos
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR NOT NULL,
    full_name VARCHAR,
    plan_type VARCHAR DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
    plan_expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    usage_limits JSONB DEFAULT '{"analyses_per_month": 5, "exports_per_month": 2}',
    current_usage JSONB DEFAULT '{"analyses_this_month": 0, "exports_this_month": 0}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **4.2 Sistema de Limites**
- [ ] Controle de uso por plano
- [ ] Upgrade automático de planos
- [ ] Notificações de limite
- [ ] Histórico de assinaturas

---

### **FASE 5: MÓDULO FINANCEIRO** 💰

#### **5.1 Gestão de Propriedades**
- [ ] Cadastro real de imóveis
- [ ] Upload de documentos
- [ ] Fotos e galeria
- [ ] Localização (Google Maps)

#### **5.2 Controle Financeiro**
- [ ] Receitas e despesas reais
- [ ] Categorização automática
- [ ] Relatórios mensais/anuais
- [ ] Integração com APIs bancárias (futuro)

```sql
-- Propriedades reais dos usuários
CREATE TABLE properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    address TEXT,
    property_type VARCHAR(50),
    purchase_value DECIMAL(12,2),
    current_value DECIMAL(12,2),
    monthly_rent DECIMAL(10,2),
    expenses JSONB,
    documents JSONB,
    photos JSONB,
    location_coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transações financeiras reais
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    category VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **FASE 6: ACADEMIA E CURSOS** 🎓

#### **6.1 Sistema de Cursos**
- [ ] Catálogo real de cursos
- [ ] Progresso de usuários
- [ ] Certificados digitais
- [ ] Avaliações e reviews

#### **6.2 Conteúdo Educacional**
- [ ] Vídeo-aulas hospedadas
- [ ] Materiais complementares
- [ ] Quizzes interativos
- [ ] Gamificação

```sql
-- Cursos reais
CREATE TABLE courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_name VARCHAR(255),
    duration_minutes INTEGER,
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100),
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(8,2),
    thumbnail_url VARCHAR(500),
    content_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progresso dos usuários
CREATE TABLE course_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    certificate_url VARCHAR(500),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
```

---

### **FASE 7: CRM E LEADS** 🎯

#### **7.1 Gestão de Leads**
- [ ] Pipeline real de vendas
- [ ] Integração com formulários
- [ ] Automação de follow-up
- [ ] Relatórios de conversão

#### **7.2 Agenda e Tarefas**
- [ ] Sistema de agendamento
- [ ] Lembretes automáticos
- [ ] Integração com Google Calendar
- [ ] Histórico de interações

---

### **FASE 8: SUPORTE E TICKETS** 🎧

#### **8.1 Sistema de Tickets**
- [ ] Categorização automática
- [ ] SLA por prioridade
- [ ] Base de conhecimento
- [ ] Satisfação do cliente

#### **8.2 FAQ Dinâmico**
- [ ] Perguntas frequentes atualizadas
- [ ] Busca inteligente
- [ ] Artigos de ajuda
- [ ] Tutoriais em vídeo

---

## 🚀 **CRONOGRAMA DE IMPLEMENTAÇÃO**

### **Semana 1: Infraestrutura** 
- Setup do banco de dados
- Configuração de autenticação
- Migração de dados essenciais

### **Semana 2: Core Features**
- Chat com dados reais
- Dashboard funcional
- Sistema de usuários

### **Semana 3: Módulos Avançados**
- Financeiro real
- Academy funcional
- CRM operacional

### **Semana 4: Polimento**
- Suporte completo
- Otimizações
- Testes finais

---

## ⚠️ **PONTOS CRÍTICOS**

1. **Migração de Dados**: Cuidado para não perder dados existentes
2. **Performance**: Otimizar queries para grande volume
3. **Segurança**: RLS configurado corretamente
4. **UX**: Manter interface fluída durante transição
5. **Backup**: Sempre fazer backup antes de mudanças

---

## 📋 **CHECKLIST FINAL**

### **Dados Substituídos:**
- [ ] Chat conversations
- [ ] User profiles  
- [ ] Dashboard metrics
- [ ] Financial data
- [ ] Course progress
- [ ] CRM leads
- [ ] Support tickets
- [ ] ROI analyses

### **Funcionalidades Reais:**
- [ ] Authentication
- [ ] Real-time updates
- [ ] File uploads
- [ ] Email notifications
- [ ] Payment processing
- [ ] Export features
- [ ] Mobile responsiveness
- [ ] Performance monitoring

---

## 🎯 **RESULTADO ESPERADO**

Após a implementação, a plataforma terá:

✅ **100% dados reais** em todas as páginas  
✅ **Chat funcional** com histórico persistente  
✅ **Dashboard administrativo** com métricas reais  
✅ **Sistema financeiro** completo e funcional  
✅ **Academy** com progresso real de usuários  
✅ **CRM** operacional para gestão de leads  
✅ **Suporte** integrado com ticketing real  
✅ **Performance otimizada** para produção  

---

*Este documento será atualizado conforme o progresso da implementação.* 