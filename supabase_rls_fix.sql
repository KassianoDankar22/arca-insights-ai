-- Desabilitar temporariamente RLS para fazer alterações seguras
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes na tabela 'usuarios' que possam estar causando a recursão
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON usuarios;
DROP POLICY IF EXISTS "Administradores têm acesso total" ON usuarios;
DROP POLICY IF EXISTS "Enable read access for all users" ON usuarios;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON usuarios;
DROP POLICY IF EXISTS "Enable update for users based on id" ON usuarios;

-- Criar políticas simples que não causem recursão
-- Política que permite a todos os usuários autenticados visualizar todos os registros
-- Isso evita recursão porque não usa condições que consultam a própria tabela
CREATE POLICY "Allow select for authenticated users" 
ON usuarios
FOR SELECT
TO authenticated
USING (true);

-- Política que permite aos usuários criar seu próprio perfil
CREATE POLICY "Allow insert own profile" 
ON usuarios
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política que permite aos usuários atualizar seu próprio perfil
CREATE POLICY "Allow update own profile" 
ON usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Habilitar RLS novamente
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Conceder permissões explícitas ao role 'authenticated'
GRANT SELECT, INSERT, UPDATE ON usuarios TO authenticated;

-- Opcional: Adicionar acesso anônimo para facilitar debugging
-- Comente esta linha em ambiente de produção
GRANT SELECT ON usuarios TO anon;

-- Checar se existe um índice na coluna id para otimizar consultas
CREATE INDEX IF NOT EXISTS usuarios_id_idx ON usuarios(id); 