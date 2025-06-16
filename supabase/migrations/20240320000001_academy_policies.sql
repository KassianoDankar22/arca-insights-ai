-- Habilitar RLS para as tabelas
alter table public.courses enable row level security;
alter table public.course_progress enable row level security;

-- Políticas para courses
create policy "Cursos visíveis para todos os usuários autenticados"
  on public.courses for select
  to authenticated
  using (true);

create policy "Apenas administradores podem criar cursos"
  on public.courses for insert
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Apenas administradores podem atualizar cursos"
  on public.courses for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Apenas administradores podem deletar cursos"
  on public.courses for delete
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

-- Políticas para course_progress
create policy "Usuários podem ver seu próprio progresso"
  on public.course_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Usuários podem criar seu próprio progresso"
  on public.course_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seu próprio progresso"
  on public.course_progress for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seu próprio progresso"
  on public.course_progress for delete
  to authenticated
  using (auth.uid() = user_id); 