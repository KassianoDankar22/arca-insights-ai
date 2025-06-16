-- Função para obter estatísticas da Academy
create or replace function public.get_academy_stats()
returns json
language plpgsql
security definer
as $$
declare
  stats json;
begin
  select json_build_object(
    'total_courses', (select count(*) from courses),
    'total_students', (
      select count(distinct user_id) 
      from course_progress
    ),
    'average_rating', (
      select coalesce(round(avg(rating)::numeric, 1), 0)
      from courses
      where rating is not null
    ),
    'total_instructors', (
      select count(distinct instructor)
      from courses
    )
  ) into stats;

  return stats;
end;
$$; 