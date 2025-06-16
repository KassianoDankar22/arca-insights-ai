-- Políticas especiais para administradores
-- Permite que usuários com plano = 'admin' vejam dados de todos os usuários

-- Função helper para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND plano = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Admins can view all profiles" ON usuarios;
DROP POLICY IF EXISTS "Admins can view all analyses" ON roi_analises;
DROP POLICY IF EXISTS "Admins can view all tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;

-- Políticas administrativas para usuarios
CREATE POLICY "Admins can view all profiles" ON usuarios 
  FOR SELECT USING (is_admin());

-- Políticas administrativas para roi_analises  
CREATE POLICY "Admins can view all analyses" ON roi_analises 
  FOR SELECT USING (is_admin());

-- Políticas administrativas para tickets
CREATE POLICY "Admins can view all tickets" ON tickets 
  FOR SELECT USING (is_admin());

-- Políticas administrativas para leads
CREATE POLICY "Admins can view all leads" ON leads 
  FOR SELECT USING (is_admin()); 