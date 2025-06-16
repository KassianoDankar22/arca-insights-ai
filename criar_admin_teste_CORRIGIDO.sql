-- ====================================================================
-- SCRIPT FINAL: CRIAR ADMIN FUNCIONAL - admin@teste.com
-- Execute este script no SQL Editor do Supabase
-- ====================================================================

DO $$
DECLARE
    target_email TEXT := 'admin@teste.com';
    target_password TEXT := '123456';
    new_user_id UUID := gen_random_uuid();
    existing_user_id UUID;
BEGIN
    RAISE NOTICE '🚀 Criando super admin: %', target_email;

    -- 1. Verificar se usuário já existe e deletar se existir
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = target_email;

    IF existing_user_id IS NOT NULL THEN
        RAISE NOTICE '⚠️ Usuário existente encontrado. Removendo para recriar...';
        
        -- Deletar perfis relacionados primeiro
        DELETE FROM public.user_profiles WHERE id = existing_user_id;
        DELETE FROM public.usuarios WHERE id = existing_user_id;
        
        -- Deletar usuário do auth
        DELETE FROM auth.users WHERE id = existing_user_id;
        
        RAISE NOTICE '✅ Usuário anterior removido';
    END IF;

    -- 2. Criar novo usuário no auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        target_email,
        crypt(target_password, gen_salt('bf')),
        NOW(),
        NULL,
        NOW(),
        '{"role": "admin", "plan_type": "enterprise", "super_admin": true}'::jsonb,
        '{"full_name": "Super Admin", "plan": "enterprise"}'::jsonb,
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

    RAISE NOTICE '✅ Usuário criado no auth.users com ID: %', new_user_id;

    -- 3. Criar perfil na tabela user_profiles (se existir)
    BEGIN
        INSERT INTO public.user_profiles (
            id,
            email,
            full_name,
            plan_type,
            plan_expires_at,
            status,
            usage_limits,
            current_usage,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            target_email,
            'Super Admin',
            'enterprise',
            NOW() + INTERVAL '100 years',
            'active',
            '{"analyses_per_month": 999999, "exports_per_month": 999999}'::jsonb,
            '{"analyses_this_month": 0, "exports_this_month": 0}'::jsonb,
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Perfil criado em user_profiles';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Tabela user_profiles: %', SQLERRM;
    END;

    -- 4. Criar perfil na tabela usuarios (se existir)
    BEGIN
        INSERT INTO public.usuarios (
            id,
            email,
            nome_completo,
            plano,
            status,
            criado_em,
            atualizado_em
        ) VALUES (
            new_user_id,
            target_email,
            'Super Admin',
            'enterprise',
            'ativo',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Perfil criado em usuarios';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Tabela usuarios: %', SQLERRM;
    END;

    -- 5. Verificar se foi criado corretamente
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = new_user_id AND email = target_email) THEN
        RAISE NOTICE '🎉 SUCESSO! Super Admin criado:';
        RAISE NOTICE '   📧 Email: %', target_email;
        RAISE NOTICE '   🔑 Senha: %', target_password;
        RAISE NOTICE '   🆔 ID: %', new_user_id;
        RAISE NOTICE '   👑 Tipo: Super Admin Enterprise';
        RAISE NOTICE '';
        RAISE NOTICE '🚀 Teste agora: Faça login com as credenciais acima';
    ELSE
        RAISE EXCEPTION 'Falha na criação do usuário';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ ERRO: %', SQLERRM;
        RAISE EXCEPTION 'Falha na criação do Super Admin: %', SQLERRM;
END $$;

-- Verificações finais
SELECT 
    '=== VERIFICAÇÃO FINAL ===' as status,
    id,
    email,
    email_confirmed_at,
    raw_app_meta_data->>'role' as role,
    raw_app_meta_data->>'plan_type' as plan_type,
    created_at
FROM auth.users 
WHERE email = 'admin@teste.com';

-- Verificar se pode fazer login (simulação)
SELECT 
    'TESTE DE SENHA' as status,
    CASE 
        WHEN encrypted_password = crypt('123456', encrypted_password) 
        THEN '✅ Senha correta'
        ELSE '❌ Senha incorreta'
    END as password_check
FROM auth.users 
WHERE email = 'admin@teste.com'; 