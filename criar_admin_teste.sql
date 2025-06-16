-- ====================================================================
-- SCRIPT: CRIAR SUPER ADMIN - admin@teste.com (ULTRA-ROBUSTA v3)
-- Execute este script no SQL Editor do Supabase
-- ====================================================================

DO $$
DECLARE
    target_email TEXT := 'admin@teste.com';
    target_password TEXT := '123456';
    new_user_id UUID;
    existing_user_id UUID;
    table_exists BOOLEAN;
    col_full_name_exists BOOLEAN;
    col_nome_completo_exists BOOLEAN;
    col_plan_type_exists BOOLEAN;
    col_plano_exists BOOLEAN;
BEGIN
    RAISE NOTICE '🚀 Iniciando criação do Super Admin: %', target_email;

    -- 1. Verificar se o usuário já existe
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = target_email;

    IF existing_user_id IS NOT NULL THEN
        RAISE NOTICE '⚠️  Usuário já existe. Atualizando permissões...';
        new_user_id := existing_user_id;
        
        -- Atualizar senha e metadados do usuário existente
        UPDATE auth.users
        SET
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            last_sign_in_at = COALESCE(last_sign_in_at, NOW()),
            raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || 
                               '{"role": "admin", "plan_type": "enterprise", "super_admin": true}'::jsonb,
            raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                                '{"full_name": "Super Admin", "plan": "enterprise"}'::jsonb,
            updated_at = NOW()
        WHERE id = new_user_id;
        
        -- Atualizar senha
        UPDATE auth.users
        SET encrypted_password = crypt(target_password, gen_salt('bf'))
        WHERE id = new_user_id;
        
    ELSE
        RAISE NOTICE '✨ Criando novo usuário Super Admin...';
        
        -- Gerar ID único para o novo usuário
        new_user_id := gen_random_uuid();
        
        -- Criar novo usuário com campos mínimos necessários
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            aud,
            role
        ) VALUES (
            new_user_id,
            target_email,
            crypt(target_password, gen_salt('bf')),
            NOW(),
            '{"role": "admin", "plan_type": "enterprise", "super_admin": true}'::jsonb,
            '{"full_name": "Super Admin", "plan": "enterprise"}'::jsonb,
            NOW(),
            NOW(),
            'authenticated',
            'authenticated'
        );
    END IF;

    RAISE NOTICE '✅ Usuário processado com ID: %', new_user_id;

    -- 2. Verificar se a tabela user_profiles existe
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) INTO table_exists;

    IF table_exists THEN
        RAISE NOTICE '✅ Tabela user_profiles encontrada';
        
        -- Verificar se as colunas existem
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'full_name'
        ) INTO col_full_name_exists;

        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'plan_type'
        ) INTO col_plan_type_exists;

        IF col_full_name_exists AND col_plan_type_exists THEN
            -- Versão completa com todas as colunas
            INSERT INTO public.user_profiles (
                id,
                email,
                full_name,
                plan_type,
                plan_expires_at,
                status,
                created_at,
                updated_at
            ) VALUES (
                new_user_id,
                target_email,
                'Super Admin',
                'enterprise',
                NOW() + INTERVAL '100 years',
                'active',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = target_email,
                full_name = 'Super Admin',
                plan_type = 'enterprise',
                plan_expires_at = NOW() + INTERVAL '100 years',
                status = 'active',
                updated_at = NOW();
            
            RAISE NOTICE '✅ Perfil criado/atualizado na tabela user_profiles (versão completa)';
        ELSE
            -- Versão simplificada apenas com colunas básicas
            INSERT INTO public.user_profiles (
                id,
                email
            ) VALUES (
                new_user_id,
                target_email
            )
            ON CONFLICT (id) DO UPDATE SET
                email = target_email;
            
            RAISE NOTICE '✅ Perfil criado/atualizado na tabela user_profiles (versão básica)';
        END IF;
    ELSE
        RAISE NOTICE '⚠️  Tabela user_profiles não existe';
    END IF;

    -- 3. Tentar criar/atualizar perfil na tabela usuarios (se existir - tabela legada)
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
    ) INTO table_exists;

    IF table_exists THEN
        RAISE NOTICE '✅ Tabela usuarios encontrada';
        
        -- Verificar colunas da tabela usuarios
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'usuarios' 
            AND column_name = 'nome_completo'
        ) INTO col_nome_completo_exists;

        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'usuarios' 
            AND column_name = 'plano'
        ) INTO col_plano_exists;

        IF col_nome_completo_exists AND col_plano_exists THEN
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
            )
            ON CONFLICT (id) DO UPDATE SET
                email = target_email,
                nome_completo = 'Super Admin',
                plano = 'enterprise',
                status = 'ativo',
                atualizado_em = NOW();

            RAISE NOTICE '✅ Perfil criado/atualizado na tabela usuarios (versão completa)';
        ELSE
            -- Versão básica
            INSERT INTO public.usuarios (
                id,
                email
            ) VALUES (
                new_user_id,
                target_email
            )
            ON CONFLICT (id) DO UPDATE SET
                email = target_email;

            RAISE NOTICE '✅ Perfil criado/atualizado na tabela usuarios (versão básica)';
        END IF;
    ELSE
        RAISE NOTICE '⚠️  Tabela usuarios não existe';
    END IF;

    RAISE NOTICE '🎉 SUCESSO! Super Admin criado:';
    RAISE NOTICE '   📧 Email: %', target_email;
    RAISE NOTICE '   🔑 Senha: %', target_password;
    RAISE NOTICE '   👑 Tipo: Super Admin com acesso ilimitado';
    RAISE NOTICE '   🆔 ID: %', new_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Próximos passos:';
    RAISE NOTICE '   1. Faça login com as credenciais acima';
    RAISE NOTICE '   2. Acesse o painel de administração';
    RAISE NOTICE '   3. Verifique se todos os recursos estão disponíveis';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ ERRO ao criar Super Admin: %', SQLERRM;
        RAISE EXCEPTION 'Falha na criação do Super Admin: %', SQLERRM;
END $$;

-- Verificar se o usuário foi criado corretamente
SELECT 
    'VERIFICAÇÃO FINAL' as status,
    id,
    email,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at
FROM auth.users 
WHERE email = 'admin@teste.com';

-- Verificar todas as tabelas de perfil possíveis
DO $$
BEGIN
    -- Verificar user_profiles se existir
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        RAISE NOTICE 'VERIFICANDO TABELA user_profiles:';
        PERFORM * FROM public.user_profiles WHERE email = 'admin@teste.com';
    END IF;

    -- Verificar usuarios se existir
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usuarios') THEN
        RAISE NOTICE 'VERIFICANDO TABELA usuarios:';
        PERFORM * FROM public.usuarios WHERE email = 'admin@teste.com';
    END IF;
END $$; 