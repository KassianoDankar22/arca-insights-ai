-- ==================================================================
-- SCHEMA COMPLETO PARA DASHBOARD ADMINISTRATIVO - ARCA AI
-- ==================================================================
-- Executa este SQL no Supabase SQL Editor para criar todas as tabelas necessárias

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ATUALIZAR TABELA USUARIOS (adicionar campos administrativos)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ativo',
ADD COLUMN IF NOT EXISTS data_ultimo_acesso TIMESTAMP,
ADD COLUMN IF NOT EXISTS origem_cadastro VARCHAR(50) DEFAULT 'website',
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS plano_ativo BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plano_tipo VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plano_expira_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS plano_iniciado_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS total_analises_realizadas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS limite_analises_mensal INTEGER DEFAULT 5;

-- 3. TABELA DE ANÁLISES ROI
CREATE TABLE IF NOT EXISTS analises_roi (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    tipo_propriedade VARCHAR(100),
    valor_imovel DECIMAL(15,2),
    valor_entrada DECIMAL(15,2),
    aluguel_mensal DECIMAL(10,2),
    despesas_mensais DECIMAL(10,2),
    roi_calculado DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'concluida',
    dados_completos JSONB, -- Armazena todos os dados da análise
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- 4. TABELA DE PLANOS E ASSINATURAS
CREATE TABLE IF NOT EXISTS assinaturas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    plano VARCHAR(20) NOT NULL, -- free, pro, enterprise
    status VARCHAR(20) DEFAULT 'ativa', -- ativa, cancelada, expirada, pendente
    preco DECIMAL(10,2),
    moeda VARCHAR(3) DEFAULT 'BRL',
    periodo VARCHAR(20), -- monthly, annual
    data_inicio TIMESTAMP DEFAULT NOW(),
    data_fim TIMESTAMP,
    auto_renovar BOOLEAN DEFAULT TRUE,
    metodo_pagamento VARCHAR(50),
    gateway_pagamento VARCHAR(50), -- stripe, pagseguro, etc
    transaction_id VARCHAR(255),
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- 5. TABELA DE LOGS DE ATIVIDADE
CREATE TABLE IF NOT EXISTS logs_atividade (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(100) NOT NULL,
    entidade VARCHAR(50), -- analise, usuario, assinatura, etc
    entidade_id UUID,
    detalhes JSONB,
    ip_address INET,
    user_agent TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 6. TABELA DE TICKETS DE SUPORTE
CREATE TABLE IF NOT EXISTS tickets_suporte (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50), -- tecnico, comercial, sugestao
    prioridade VARCHAR(20) DEFAULT 'media', -- baixa, media, alta, critica
    status VARCHAR(20) DEFAULT 'aberto', -- aberto, em_andamento, resolvido, fechado
    atribuido_a UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    resolucao TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW(),
    resolvido_em TIMESTAMP
);

-- 7. TABELA DE CONFIGURAÇÕES DO SISTEMA
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    descricao TEXT,
    categoria VARCHAR(50),
    editavel BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- 8. TABELA DE MÉTRICAS DIÁRIAS
CREATE TABLE IF NOT EXISTS metricas_diarias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    data DATE NOT NULL,
    usuarios_ativos INTEGER DEFAULT 0,
    novos_usuarios INTEGER DEFAULT 0,
    analises_realizadas INTEGER DEFAULT 0,
    receita_dia DECIMAL(10,2) DEFAULT 0,
    tickets_abertos INTEGER DEFAULT 0,
    tickets_fechados INTEGER DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT NOW(),
    UNIQUE(data)
);

-- 9. TABELA DE NOTIFICAÇÕES ADMIN
CREATE TABLE IF NOT EXISTS notificacoes_admin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- novo_usuario, pagamento, suporte, sistema
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT,
    dados JSONB,
    lida BOOLEAN DEFAULT FALSE,
    usuario_admin_id UUID,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 10. TABELA DE ADMINS
CREATE TABLE IF NOT EXISTS administradores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nivel_acesso VARCHAR(20) DEFAULT 'admin', -- super_admin, admin, moderador
    permissoes JSONB, -- Lista de permissões específicas
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT NOW(),
    criado_por UUID REFERENCES usuarios(id)
);

-- ==================================================================
-- ÍNDICES PARA PERFORMANCE
-- ==================================================================

-- Índices para tabela usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_plano_tipo ON usuarios(plano_tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_criado_em ON usuarios(criado_em);

-- Índices para tabela analises_roi
CREATE INDEX IF NOT EXISTS idx_analises_usuario_id ON analises_roi(usuario_id);
CREATE INDEX IF NOT EXISTS idx_analises_criado_em ON analises_roi(criado_em);
CREATE INDEX IF NOT EXISTS idx_analises_status ON analises_roi(status);

-- Índices para tabela assinaturas
CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario_id ON assinaturas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_plano ON assinaturas(plano);

-- Índices para tabela logs_atividade
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs_atividade(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acao ON logs_atividade(acao);
CREATE INDEX IF NOT EXISTS idx_logs_criado_em ON logs_atividade(criado_em);

-- Índices para tabela tickets_suporte
CREATE INDEX IF NOT EXISTS idx_tickets_usuario_id ON tickets_suporte(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets_suporte(status);
CREATE INDEX IF NOT EXISTS idx_tickets_prioridade ON tickets_suporte(prioridade);

-- ==================================================================
-- TRIGGERS E FUNÇÕES
-- ==================================================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar timestamp automaticamente
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analises_updated_at BEFORE UPDATE ON analises_roi 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON assinaturas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets_suporte 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes_sistema 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================================
-- DADOS INICIAIS
-- ==================================================================

-- Configurações padrão do sistema
INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao, categoria) VALUES
('limite_analises_gratuito', '5', 'number', 'Limite mensal de análises para usuários gratuitos', 'limites'),
('limite_analises_pro', '999999', 'number', 'Limite mensal de análises para usuários pro', 'limites'),
('preco_plano_pro_mensal', '49.90', 'number', 'Preço mensal do plano Pro', 'precos'),
('preco_plano_enterprise_mensal', '199.90', 'number', 'Preço mensal do plano Enterprise', 'precos'),
('email_suporte', 'suporte@arcaai.com', 'string', 'Email principal de suporte', 'contato'),
('manutencao_ativa', 'false', 'boolean', 'Sistema em manutenção', 'sistema'),
('registros_permitidos', 'true', 'boolean', 'Permitir novos registros', 'sistema')
ON CONFLICT (chave) DO NOTHING;

-- Primeiro usuário admin (ajuste o ID conforme necessário)
-- INSERT INTO administradores (usuario_id, nivel_acesso, permissoes, criado_por) 
-- VALUES ('seu-uuid-aqui', 'super_admin', '["all"]', 'seu-uuid-aqui');

-- ==================================================================
-- VIEWS ÚTEIS PARA DASHBOARD
-- ==================================================================

-- View de usuários com estatísticas
CREATE OR REPLACE VIEW view_usuarios_stats AS
SELECT 
    u.id,
    u.nome_completo,
    u.email,
    u.plano_tipo,
    u.status,
    u.criado_em,
    u.data_ultimo_acesso,
    u.total_analises_realizadas,
    COUNT(a.id) as analises_mes_atual,
    COALESCE(s.status, 'sem_assinatura') as status_assinatura
FROM usuarios u
LEFT JOIN analises_roi a ON u.id = a.usuario_id 
    AND a.criado_em >= date_trunc('month', CURRENT_DATE)
LEFT JOIN assinaturas s ON u.id = s.usuario_id 
    AND s.status = 'ativa'
GROUP BY u.id, u.nome_completo, u.email, u.plano_tipo, u.status, 
         u.criado_em, u.data_ultimo_acesso, u.total_analises_realizadas, s.status;

-- View de métricas gerais
CREATE OR REPLACE VIEW view_metricas_gerais AS
SELECT 
    (SELECT COUNT(*) FROM usuarios WHERE status = 'ativo') as usuarios_ativos,
    (SELECT COUNT(*) FROM usuarios WHERE criado_em >= CURRENT_DATE) as novos_usuarios_hoje,
    (SELECT COUNT(*) FROM analises_roi WHERE criado_em >= CURRENT_DATE) as analises_hoje,
    (SELECT COUNT(*) FROM tickets_suporte WHERE status IN ('aberto', 'em_andamento')) as tickets_pendentes,
    (SELECT COALESCE(SUM(preco), 0) FROM assinaturas WHERE status = 'ativa') as receita_mensal_recorrente;

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Usuários do sistema com informações de planos';
COMMENT ON TABLE analises_roi IS 'Histórico de todas as análises ROI realizadas';
COMMENT ON TABLE assinaturas IS 'Controle de assinaturas e pagamentos';
COMMENT ON TABLE logs_atividade IS 'Log de todas as atividades dos usuários';
COMMENT ON TABLE tickets_suporte IS 'Sistema de tickets de suporte';
COMMENT ON TABLE configuracoes_sistema IS 'Configurações globais do sistema';
COMMENT ON TABLE metricas_diarias IS 'Métricas consolidadas por dia';
COMMENT ON TABLE notificacoes_admin IS 'Notificações para administradores';
COMMENT ON TABLE administradores IS 'Usuários com acesso administrativo';

-- ==================================================================
-- POLICIES DE SEGURANÇA (RLS - Row Level Security)
-- ==================================================================

-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_atividade ENABLE ROW LEVEL SECURITY;

-- Policy para apenas admins acessarem dados administrativos
CREATE POLICY admin_only_policy ON administradores 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administradores a 
            WHERE a.usuario_id = auth.uid() AND a.ativo = true
        )
    );

-- ==================================================================
-- FIM DO SCHEMA
-- ================================================================== 