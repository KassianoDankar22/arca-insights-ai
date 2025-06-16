-- Migração para Dados Reais - Arca Insights AI
-- Criação das tabelas principais para substituir dados mock

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de perfis de usuário (estende auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR NOT NULL,
    name VARCHAR,
    plan VARCHAR DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_access TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_analyses INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    avatar_url VARCHAR
);

-- Tabela de análises ROI
CREATE TABLE IF NOT EXISTS public.roi_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    property_type VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    property_value DECIMAL(12,2) NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    roi_percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR DEFAULT 'completed' CHECK (status IN ('completed', 'draft', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB -- Dados completos da análise
);

-- Tabela de tickets de suporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR NOT NULL CHECK (category IN ('tecnico', 'comercial', 'sugestao', 'bug')),
    priority VARCHAR DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'critica')),
    status VARCHAR DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'fechado')),
    assigned_to VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message TEXT,
    message_count INTEGER DEFAULT 1
);

-- Tabela de transações financeiras
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de propriedades
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    monthly_rent DECIMAL(10,2),
    address TEXT,
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cursos da Academy
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    instructor VARCHAR,
    duration VARCHAR,
    level VARCHAR CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR,
    thumbnail_url VARCHAR,
    video_url VARCHAR,
    content JSONB, -- Conteúdo estruturado do curso
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON public.user_profiles(plan);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

CREATE INDEX IF NOT EXISTS idx_roi_analyses_user_id ON public.roi_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_roi_analyses_created_at ON public.roi_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_roi_analyses_status ON public.roi_analyses(status);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);

CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_premium ON public.courses(is_premium);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roi_analyses_updated_at 
    BEFORE UPDATE ON public.roi_analyses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON public.support_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON public.properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON public.courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil do usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS (Row Level Security) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roi_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policies para user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies para roi_analyses
CREATE POLICY "Users can view own analyses" ON public.roi_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON public.roi_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON public.roi_analyses
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies para support_tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para properties
CREATE POLICY "Users can view own properties" ON public.properties
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties" ON public.properties
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties" ON public.properties
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies para courses (acesso público para leitura)
CREATE POLICY "Anyone can view courses" ON public.courses
    FOR SELECT USING (true);

-- Policies administrativas (acesso total para admins)
CREATE POLICY "Admins can view all user profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND email IN (
                'admin@arcaai.com',
                'suporte@arcaai.com', 
                'kassianomarketing@gmail.com',
                'teste3@teste.com',
                'jimmychagass@gmail.com',
                'jimbotoficial@gmail.com'
            )
        )
    );

CREATE POLICY "Admins can view all analyses" ON public.roi_analyses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND email IN (
                'admin@arcaai.com',
                'suporte@arcaai.com', 
                'kassianomarketing@gmail.com',
                'teste3@teste.com',
                'jimmychagass@gmail.com',
                'jimbotoficial@gmail.com'
            )
        )
    );

CREATE POLICY "Admins can view all tickets" ON public.support_tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND email IN (
                'admin@arcaai.com',
                'suporte@arcaai.com', 
                'kassianomarketing@gmail.com',
                'teste3@teste.com',
                'jimmychagass@gmail.com',
                'jimbotoficial@gmail.com'
            )
        )
    );

CREATE POLICY "Admins can update all tickets" ON public.support_tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND email IN (
                'admin@arcaai.com',
                'suporte@arcaai.com', 
                'kassianomarketing@gmail.com',
                'teste3@teste.com',
                'jimmychagass@gmail.com',
                'jimbotoficial@gmail.com'
            )
        )
    );

-- Inserir dados seed para demonstração
INSERT INTO public.courses (title, description, instructor, duration, level, category, is_premium, content) VALUES
('Fundamentos do Investimento Imobiliário', 'Aprenda os conceitos básicos para começar a investir em imóveis', 'João Silva', '2 horas', 'beginner', 'investimento', false, '{"modules": [{"title": "Introdução", "duration": "30min"}]}'),
('Análise Avançada de ROI', 'Técnicas avançadas para calcular retorno sobre investimento', 'Maria Santos', '3 horas', 'advanced', 'analise', true, '{"modules": [{"title": "ROI Avançado", "duration": "60min"}]}'),
('Mercado Imobiliário Brasileiro', 'Entenda o mercado imobiliário brasileiro e suas oportunidades', 'Carlos Oliveira', '2.5 horas', 'intermediate', 'mercado', false, '{"modules": [{"title": "Visão Geral", "duration": "45min"}]}'),
('Financiamento Imobiliário', 'Como financiar seus investimentos de forma inteligente', 'Ana Costa', '1.5 horas', 'beginner', 'financiamento', true, '{"modules": [{"title": "Tipos de Financiamento", "duration": "30min"}]}')
ON CONFLICT DO NOTHING;

-- Comentários das tabelas
COMMENT ON TABLE public.user_profiles IS 'Perfis estendidos dos usuários';
COMMENT ON TABLE public.roi_analyses IS 'Análises de ROI realizadas pelos usuários';
COMMENT ON TABLE public.support_tickets IS 'Tickets de suporte técnico e comercial';
COMMENT ON TABLE public.transactions IS 'Transações financeiras dos usuários';
COMMENT ON TABLE public.properties IS 'Propriedades gerenciadas pelos usuários';
COMMENT ON TABLE public.courses IS 'Cursos disponíveis na Academy'; 