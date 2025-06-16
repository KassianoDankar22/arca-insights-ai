-- ====================================================================
-- SCRIPT FINAL: TORNAR KELSEY SUPER ADMIN COM ACESSO ILIMITADO
-- Execute este script no SQL Editor do Supabase
-- ====================================================================

DO $$
DECLARE
    target_email TEXT := 'kelseycarvalho.realtor@gmail.com';
    user_id_found UUID;
BEGIN
    RAISE NOTICE '🚀 Iniciando processo para tornar % Super Admin...', target_email;

    -- 1. Encontrar o ID do usuário pelo email
    SELECT id INTO user_id_found 
    FROM auth.users 
    WHERE email = target_email;

    -- 2. Se o usuário for encontrado, aplicar todas as correções e permissões
    IF user_id_found IS NOT NULL THEN
        RAISE NOTICE '✅ Usuário encontrado com ID: %', user_id_found;

        -- 2.1. Confirmar o email e reativar a conta (garantia)
        UPDATE auth.users
        SET
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            banned_until = NULL,
            updated_at = NOW()
        WHERE id = user_id_found;
        RAISE NOTICE '  - Email confirmado e conta ativada.';

        -- 2.2. Definir metadados como SUPER ADMIN com plano enterprise e limites ilimitados
        UPDATE auth.users
        SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || 
            '{
                "role": "admin", 
                "plan": "enterprise", 
                "plan_type": "enterprise", 
                "is_super_admin": true,
                "analysis_limit": 9999999
             }'::jsonb
        WHERE id = user_id_found;
        RAISE NOTICE '  - Metadados atualizados para Super Admin (Role: admin, Plan: enterprise).';

        -- 2.3. Criar ou atualizar o perfil na tabela de perfis de usuário
        INSERT INTO public.user_profiles (
            id, 
            email, 
            full_name,
            plan_type,
            status,
            plan_expires_at, -- Adicionado para dar acesso "infinito"
            created_at, 
            updated_at
        ) VALUES (
            user_id_found,
            target_email,
            'Kelsey Carvalho',
            'enterprise',
            'active',
            NOW() + INTERVAL '100 years',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            plan_type = 'enterprise',
            status = 'active',
            plan_expires_at = NOW() + INTERVAL '100 years',
            updated_at = NOW();
        RAISE NOTICE '  - Perfil na tabela `user_profiles` criado/atualizado para Enterprise.';

        -- 2.4. REMOVIDO: Inserção na tabela `subscriptions` que não existe.
        RAISE NOTICE '  - Lógica de assinatura agora é gerenciada em `user_profiles`.';
        
        RAISE NOTICE '🎉 SUCESSO! % agora é Super Admin com acesso total e ilimitado.', target_email;

    ELSE
        RAISE NOTICE '❌ ERRO: Usuário com email % não encontrado na tabela `auth.users`.', target_email;
        RAISE NOTICE '   Por favor, verifique se a conta foi criada com este email antes de rodar o script.';
    END IF;
END $$;

-- ====================================================================
-- INSTRUÇÕES PARA KELSEY APÓS EXECUTAR O SCRIPT:
-- 1. Faça logout se estiver logada.
-- 2. Vá para a tela de login.
-- 3. Use o email: kelseycarvalho.realtor@gmail.com
-- 4. Se não lembrar a senha, clique em "Esqueci minha senha" para criar uma nova.
-- 5. Após o login, você terá acesso total.
-- ==================================================================== 