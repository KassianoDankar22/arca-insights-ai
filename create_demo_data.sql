-- Script para criar dados de demonstração
-- Execute no SQL Editor do Supabase Dashboard

-- Inserir alguns usuários demo (se não existirem)
INSERT INTO public.usuarios (id, email, nome_completo, criado_em, atualizado_em, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'demo1@arcaai.com', 'Maria Silva Santos', NOW() - INTERVAL '30 days', NOW(), null),
  ('550e8400-e29b-41d4-a716-446655440002', 'demo2@arcaai.com', 'João Carlos Oliveira', NOW() - INTERVAL '25 days', NOW(), null),
  ('550e8400-e29b-41d4-a716-446655440003', 'demo3@arcaai.com', 'Ana Paula Costa', NOW() - INTERVAL '20 days', NOW(), null),
  ('550e8400-e29b-41d4-a716-446655440004', 'demo4@arcaai.com', 'Carlos Roberto Lima', NOW() - INTERVAL '15 days', NOW(), null),
  ('550e8400-e29b-41d4-a716-446655440005', 'demo5@arcaai.com', 'Fernanda Alves', NOW() - INTERVAL '10 days', NOW(), null)
ON CONFLICT (id) DO NOTHING;

-- Inserir algumas análises ROI demo
INSERT INTO public.roi_analises (
  user_id, 
  tipo_investimento, 
  localizacao, 
  valor_imovel, 
  quartos, 
  piscina, 
  condominio, 
  entrada_percentual, 
  entrada_valor,
  criado_em,
  expira_em,
  modelo
) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Apartamento', 'São Paulo - SP', 650000, 2, false, 'Residencial Villa Park', 30, 195000, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 'Residencial'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Casa', 'Rio de Janeiro - RJ', 850000, 3, true, 'Condomínio Barra da Tijuca', 25, 212500, NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', 'Casa'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Apartamento', 'Belo Horizonte - MG', 480000, 2, false, 'Edifício Central Park', 35, 168000, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', 'Residencial'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Comercial', 'São Paulo - SP', 1200000, 0, false, 'Centro Empresarial', 40, 480000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days', 'Comercial'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Apartamento', 'Florianópolis - SC', 720000, 2, true, 'Residencial Praia', 30, 216000, NOW(), NOW() + INTERVAL '30 days', 'Residencial'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Casa', 'Campinas - SP', 590000, 3, false, 'Residencial Jardim', 20, 118000, NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days', 'Casa'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Apartamento', 'Porto Alegre - RS', 420000, 1, false, 'Edifício Torre Sul', 35, 147000, NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days', 'Residencial');

-- Inserir alguns tickets de suporte demo
INSERT INTO public.tickets (
  user_id, 
  assunto, 
  prioridade, 
  status, 
  data_abertura, 
  ultima_atualizacao,
  created_at
) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Dúvida sobre cálculo de ROI', 'media', 'aberto', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Problema no login', 'alta', 'em_andamento', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 day'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Sugestão de melhoria', 'baixa', 'resolvido', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Bug na calculadora', 'critica', 'em_andamento', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 days'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Informações sobre planos', 'media', 'fechado', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '7 days'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Dúvida sobre financiamento', 'baixa', 'aberto', NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '1 day'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Erro ao gerar relatório', 'alta', 'resolvido', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 days');

-- Verificar se os dados foram inseridos
SELECT 'Usuários criados:' as info, count(*) as quantidade FROM usuarios;
SELECT 'Análises ROI criadas:' as info, count(*) as quantidade FROM roi_analises;
SELECT 'Tickets criados:' as info, count(*) as quantidade FROM tickets; 