-- =====================================
-- SCRIPT DIAGNÓSTICO E CORREÇÃO PARA KELSEY
-- kelseycarvalho.realtor@gmail.com
-- =====================================

-- PARTE 1: DIAGNÓSTICO COMPLETO
DO $$
DECLARE
    target_email TEXT := 'kelseycarvalho.realtor@gmail.com';
    user_id_found UUID;
    user_metadata JSONB;
    app_metadata JSONB;
    user_exists BOOLEAN := FALSE;
    profile_exists BOOLEAN := FALSE;
    subscription_exists BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO DIAGNÓSTICO PARA % ===', target_email;
    
    -- 1. Verificar se usuário existe na auth.users
    SELECT id, raw_user_meta_data, raw_app_meta_data 
    INTO user_id_found, user_metadata, app_metadata
    FROM auth.users 
    WHERE email = target_email;
    
    IF user_id_found IS NOT NULL THEN
        user_exists := TRUE;
        RAISE NOTICE '✓ Usuário encontrado no auth.users com ID: %', user_id_found;
        RAISE NOTICE '  - User metadata: %', user_metadata;
        RAISE NOTICE '  - App metadata: %', app_metadata;
    ELSE
        RAISE NOTICE '✗ Usuário NÃO encontrado no auth.users';
        RAISE NOTICE '  - Email procurado: %', target_email;
        RAISE NOTICE '  - Verifique se o email está correto ou se a conta foi criada';
        RETURN;
    END IF;
    
    -- 2. Verificar se existe perfil na tabela usuarios
    PERFORM 1 FROM public.usuarios WHERE id = user_id_found;
    IF FOUND THEN
        profile_exists := TRUE;
        RAISE NOTICE '✓ Perfil encontrado na tabela usuarios';
    ELSE
        RAISE NOTICE '✗ Perfil NÃO encontrado na tabela usuarios';
    END IF;
    
    -- 3. Verificar se existe subscription
    PERFORM 1 FROM public.subscriptions WHERE user_id = user_id_found;
    IF FOUND THEN
        subscription_exists := TRUE;
        RAISE NOTICE '✓ Subscription encontrada';
    ELSE
        RAISE NOTICE '✗ Subscription NÃO encontrada';
    END IF;
    
    RAISE NOTICE '=== RESUMO DO DIAGNÓSTICO ===';
    RAISE NOTICE 'Usuário existe: %', user_exists;
    RAISE NOTICE 'Perfil existe: %', profile_exists;
    RAISE NOTICE 'Subscription existe: %', subscription_exists;
    
    -- PARTE 2: CORREÇÕES AUTOMÁTICAS
    IF user_exists THEN
        RAISE NOTICE '=== INICIANDO CORREÇÕES ===';
        
        -- 2.1. Atualizar metadados do usuário (SEMPRE)
        UPDATE auth.users
        SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || 
            '{"role": "admin", "plan_type": "enterprise", "plan": "enterprise", "is_super_admin": true}'::jsonb
        WHERE id = user_id_found;
        
        RAISE NOTICE '✓ Metadados do usuário atualizados com role admin e plano enterprise';
        
        -- 2.2. Criar/atualizar perfil na tabela usuarios
        INSERT INTO public.usuarios (
            id, 
            email, 
            nome_completo, 
            criado_em, 
            atualizado_em
        ) VALUES (
            user_id_found,
            target_email,
            'Kelsey Carvalho',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            nome_completo = CASE 
                WHEN usuarios.nome_completo IS NULL OR usuarios.nome_completo = '' 
                THEN EXCLUDED.nome_completo 
                ELSE usuarios.nome_completo 
            END,
            atualizado_em = NOW();
            
        RAISE NOTICE '✓ Perfil criado/atualizado na tabela usuarios';
        
        -- 2.3. Criar/atualizar subscription
        INSERT INTO public.subscriptions (
            user_id, 
            plan_id, 
            status, 
            current_period_start, 
            current_period_end,
            created_at,
            updated_at
        ) VALUES (
            user_id_found,
            NULL, -- Enterprise não precisa de plan_id específico
            'active',
            NOW(),
            NOW() + INTERVAL '100 years', -- Praticamente ilimitado
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            plan_id = NULL,
            status = 'active',
            current_period_end = NOW() + INTERVAL '100 years',
            updated_at = NOW();
            
        RAISE NOTICE '✓ Subscription criada/atualizada com plano enterprise';
        
        RAISE NOTICE '=== CORREÇÕES CONCLUÍDAS ===';
        RAISE NOTICE 'A usuária % agora tem:' , target_email;
        RAISE NOTICE '- Role: admin (super admin)';
        RAISE NOTICE '- Plano: enterprise';
        RAISE NOTICE '- Status: active';
        RAISE NOTICE '- Acesso: ilimitado até %', NOW() + INTERVAL '100 years';
    END IF;
    
END $$;

-- PARTE 3: VERIFICAÇÃO FINAL
DO $$
DECLARE
    target_email TEXT := 'kelseycarvalho.realtor@gmail.com';
    final_user_data RECORD;
    final_profile_data RECORD;
    final_subscription_data RECORD;
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO FINAL ===';
    
    -- Dados finais do auth.users
    SELECT id, email, raw_app_meta_data 
    INTO final_user_data
    FROM auth.users 
    WHERE email = target_email;
    
    IF final_user_data.id IS NOT NULL THEN
        RAISE NOTICE 'Auth User ID: %', final_user_data.id;
        RAISE NOTICE 'Auth App Metadata: %', final_user_data.raw_app_meta_data;
    END IF;
    
    -- Dados finais do perfil
    SELECT * INTO final_profile_data
    FROM public.usuarios 
    WHERE email = target_email;
    
    IF final_profile_data.id IS NOT NULL THEN
        RAISE NOTICE 'Profile: Nome=%, Email=%', final_profile_data.nome_completo, final_profile_data.email;
    END IF;
    
    -- Dados finais da subscription
    SELECT * INTO final_subscription_data
    FROM public.subscriptions 
    WHERE user_id = final_user_data.id;
    
    IF final_subscription_data.user_id IS NOT NULL THEN
        RAISE NOTICE 'Subscription: Status=%, Fim=%', final_subscription_data.status, final_subscription_data.current_period_end;
    END IF;
    
    RAISE NOTICE '=== SCRIPT CONCLUÍDO ===';
    RAISE NOTICE 'Execute este script no Supabase SQL Editor para aplicar as correções.';
    
END $$; 