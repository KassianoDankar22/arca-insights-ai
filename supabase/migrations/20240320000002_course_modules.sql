-- Tabela de módulos
create table public.course_modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  duration text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de aulas
create table public.course_lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.course_modules(id) on delete cascade,
  title text not null,
  description text,
  duration text not null,
  video_url text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de progresso das aulas
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete cascade,
  completed boolean default false,
  progress numeric default 0,
  last_watched timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- Habilitar RLS
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_progress enable row level security;

-- Políticas para course_modules
create policy "Módulos visíveis para todos os usuários autenticados"
  on public.course_modules for select
  to authenticated
  using (true);

create policy "Apenas administradores podem criar módulos"
  on public.course_modules for insert
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Apenas administradores podem atualizar módulos"
  on public.course_modules for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Apenas administradores podem deletar módulos"
  on public.course_modules for delete
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

-- Políticas para course_lessons
create policy "Aulas visíveis para todos os usuários autenticados"
  on public.course_lessons for select
  to authenticated
  using (true);

create policy "Apenas administradores podem criar aulas"
  on public.course_lessons for insert
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Apenas administradores podem atualizar aulas"
  on public.course_lessons for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Apenas administradores podem deletar aulas"
  on public.course_lessons for delete
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

-- Políticas para lesson_progress
create policy "Usuários podem ver seu próprio progresso nas aulas"
  on public.lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Usuários podem criar seu próprio progresso nas aulas"
  on public.lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seu próprio progresso nas aulas"
  on public.lesson_progress for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seu próprio progresso nas aulas"
  on public.lesson_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- Função para calcular o progresso geral do curso
create or replace function public.calculate_course_progress(p_course_id uuid, p_user_id uuid)
returns numeric
language plpgsql
security definer
as $$
declare
  total_lessons integer;
  completed_lessons integer;
begin
  -- Contar total de aulas do curso
  select count(*)
  into total_lessons
  from course_lessons cl
  join course_modules cm on cl.module_id = cm.id
  where cm.course_id = p_course_id;

  -- Contar aulas completadas
  select count(*)
  into completed_lessons
  from course_lessons cl
  join course_modules cm on cl.module_id = cm.id
  join lesson_progress lp on lp.lesson_id = cl.id
  where cm.course_id = p_course_id
  and lp.user_id = p_user_id
  and lp.completed = true;

  -- Retornar porcentagem de progresso
  if total_lessons = 0 then
    return 0;
  else
    return (completed_lessons::numeric / total_lessons::numeric) * 100;
  end if;
end;
$$; 