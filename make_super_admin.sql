-- SCRIPT FINAL (v4) - A SOLUÇÃO CORRETA E SIMPLES
-- Define a role e o tipo de plano diretamente nos metadados do usuário.
-- O sistema de planos do app é simulado e lê estas informações.

DO $$
DECLARE
    target_email TEXT := 'kelseycarvalho.realtor@gmail.com';
    user_id_to_update UUID;
BEGIN
    -- Encontrar o ID do usuário.
    SELECT id INTO user_id_to_update FROM auth.users WHERE email = target_email;

    -- Somente executa se o usuário foi encontrado.
    IF user_id_to_update IS NOT NULL THEN

        -- Atualiza a role e o tipo de plano diretamente nos metadados de autenticação.
        -- Esta é a única alteração necessária.
        UPDATE auth.users
        SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin", "plan_type": "enterprise", "plan": "enterprise"}'::jsonb
        WHERE id = user_id_to_update;
            
    END IF;
END $$; 