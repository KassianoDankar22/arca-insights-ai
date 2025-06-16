-- ==================================================================
-- TRIGGER PARA AUTO-INSERÇÃO DE USUÁRIOS NA TABELA 'usuarios'
-- ==================================================================
-- Este SQL deve ser executado no Supabase SQL Editor
-- Executa automaticamente quando um novo usuário se cadastra via Auth

-- 1. Criar uma função que será executada pelo trigger
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Inserir na tabela usuarios com os dados do novo usuário
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar o trigger que executa a função após inserção na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();

-- ==================================================================
-- POLÍTICAS RLS PARA A TABELA 'usuarios'
-- ==================================================================

-- Desabilitar RLS temporariamente para limpar políticas existentes
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Remover políticas antigas que podem causar conflito
DROP POLICY IF EXISTS "Allow select for authenticated users" ON usuarios;
DROP POLICY IF EXISTS "Allow insert own profile" ON usuarios;
DROP POLICY IF EXISTS "Allow update own profile" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON usuarios;

-- Criar políticas RLS otimizadas
CREATE POLICY "Enable read for authenticated users" 
ON usuarios
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for service role" 
ON usuarios
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Enable update for own profile" 
ON usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Habilitar RLS novamente
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- ==================================================================
-- PERMISSÕES
-- ==================================================================

-- Conceder permissões necessárias
GRANT SELECT, UPDATE ON usuarios TO authenticated;
GRANT INSERT ON usuarios TO service_role;

-- Criar índice para otimizar consultas por ID
CREATE INDEX IF NOT EXISTS usuarios_id_idx ON usuarios(id);
CREATE INDEX IF NOT EXISTS usuarios_email_idx ON usuarios(email);

-- ==================================================================
-- FUNÇÃO PARA SINCRONIZAR USUÁRIOS EXISTENTES (EXECUTAR UMA VEZ)
-- ==================================================================

-- Esta função pode ser executada UMA VEZ para sincronizar usuários 
-- que já existem no auth.users mas não estão na tabela usuarios
CREATE OR REPLACE FUNCTION sync_existing_users() 
RETURNS TEXT AS $$
DECLARE
  user_record RECORD;
  inserted_count INTEGER := 0;
BEGIN
  -- Para cada usuário no auth.users que não existe na tabela usuarios
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data, au.created_at
    FROM auth.users au
    LEFT JOIN usuarios u ON au.id = u.id
    WHERE u.id IS NULL
  LOOP
    -- Inserir na tabela usuarios
    INSERT INTO usuarios (
      id, 
      nome_completo, 
      email, 
      avatar_url, 
      criado_em, 
      atualizado_em
    )
    VALUES (
      user_record.id,
      COALESCE(user_record.raw_user_meta_data->>'full_name', user_record.raw_user_meta_data->>'name'),
      user_record.email,
      user_record.raw_user_meta_data->>'avatar_url',
      user_record.created_at,
      NOW()
    );
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  RETURN 'Sincronizados ' || inserted_count || ' usuários existentes.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a sincronização uma vez (descomente a linha abaixo se necessário)
-- SELECT sync_existing_users();

-- ==================================================================
-- EXEMPLO DE USO E TESTE
-- ==================================================================

-- Para testar se o trigger está funcionando, você pode:
-- 1. Criar um novo usuário via Supabase Auth (signup)
-- 2. Verificar se ele aparece automaticamente na tabela usuarios:
--    SELECT * FROM usuarios ORDER BY criado_em DESC LIMIT 5;

-- Para ver usuários que faltam sincronizar:
-- SELECT au.id, au.email, au.created_at 
-- FROM auth.users au 
-- LEFT JOIN usuarios u ON au.id = u.id 
-- WHERE u.id IS NULL; 