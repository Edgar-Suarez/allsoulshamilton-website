-- ============================================================================
-- FASE 1 · Voice CMS — Our Lady of All Souls Parish
-- Tabla `parish_content` + Row Level Security
--
-- Dónde ejecutarlo: Supabase Dashboard → SQL Editor → New query → pegar → Run
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tabla única con discriminador de sección (KISS: un shape, tres secciones)
-- ----------------------------------------------------------------------------
create table if not exists public.parish_content (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('sermon', 'quote', 'announcement')),
  content     text not null check (char_length(content) between 1 and 10000),
  published   boolean not null default true,
  created_by  uuid not null default auth.uid() references auth.users(id),
  created_at  timestamptz not null default now()
);

comment on table public.parish_content is
  'Contenido dictado por voz por el párroco: sermón semanal, frase del día y avisos parroquiales';
comment on column public.parish_content.section is
  'Sección del sitio: sermon | quote | announcement';
comment on column public.parish_content.published is
  'Solo el contenido publicado es visible para el público (RLS)';

-- ----------------------------------------------------------------------------
-- 2. Índice para las lecturas del sitio (última fila publicada por sección)
-- ----------------------------------------------------------------------------
create index if not exists idx_parish_content_section_date
  on public.parish_content (section, created_at desc)
  where published = true;

-- ----------------------------------------------------------------------------
-- 3. Row Level Security
--    Regla de oro: el público SOLO lee lo publicado; SOLO el párroco
--    autenticado escribe, y solo sobre sus propias filas.
-- ----------------------------------------------------------------------------
alter table public.parish_content enable row level security;

-- Visitantes anónimos (el sitio web): solo lectura de contenido publicado
create policy "public_read_published"
  on public.parish_content
  for select
  to anon
  using (published = true);

-- Párroco autenticado: puede ver todo (incluye despublicados, para gestionar)
create policy "authenticated_read_all"
  on public.parish_content
  for select
  to authenticated
  using (true);

-- Párroco autenticado: insertar contenido a su nombre
create policy "authenticated_insert_own"
  on public.parish_content
  for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Párroco autenticado: corregir o despublicar solo lo propio
create policy "authenticated_update_own"
  on public.parish_content
  for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Párroco autenticado: borrar solo lo propio
create policy "authenticated_delete_own"
  on public.parish_content
  for delete
  to authenticated
  using (auth.uid() = created_by);

-- ============================================================================
-- POST-INSTALACIÓN (manual, en el Dashboard de Supabase):
--
-- 1. Crear el usuario del párroco:
--    Authentication → Users → Add user → email + password (Auto-confirm ON)
--
-- 2. Cerrar el registro público (solo el párroco debe tener cuenta):
--    Authentication → Sign In / Up → desactivar "Allow new users to sign up"
-- ============================================================================

-- ----------------------------------------------------------------------------
-- VERIFICACIÓN (ejecutar después para validar la Fase 1):
-- ----------------------------------------------------------------------------
-- a) Como anon NO se puede insertar (debe fallar con "row-level security"):
--    set role anon;
--    insert into public.parish_content (section, content) values ('quote', 'test');
--    reset role;
--
-- b) Como anon NO se ven los despublicados:
--    insert into public.parish_content (section, content, published, created_by)
--      values ('quote', 'borrador oculto', false, (select id from auth.users limit 1));
--    set role anon;
--    select count(*) from public.parish_content where published = false; -- → 0
--    reset role;
