-- ============================================================
-- UGEL CHOTA - REPOSITORIO DE RECARGAS DE ENERGÍA ELÉCTRICA
-- Ejecutar una sola vez en Supabase SQL Editor.
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_completo text not null,
  rol text not null default 'editor' check (rol in ('admin','editor')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.recargas_energia (
  id bigint generated always as identity primary key,
  suministro text not null,
  institucion_educativa text not null,
  mes smallint not null check (mes between 1 and 12),
  anio integer not null check (anio between 2020 and 2100),
  monto_recarga numeric(12,2),
  observaciones text,
  archivo_path text not null,
  archivo_nombre text not null,
  archivo_size bigint default 0,
  descargas integer not null default 0,
  publicado boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recargas_suministro_idx on public.recargas_energia(suministro);
create index if not exists recargas_ie_idx on public.recargas_energia(institucion_educativa);
create index if not exists recargas_periodo_idx on public.recargas_energia(anio,mes);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('recargas-energia','recargas-energia',true,20971520,array['application/pdf'])
on conflict (id) do update set
  public=true,
  file_size_limit=20971520,
  allowed_mime_types=array['application/pdf'];

create or replace function public.puede_gestionar_recargas()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1 from public.profiles
    where id=auth.uid()
      and activo=true
      and rol in ('admin','editor')
  );
$$;

revoke all on function public.puede_gestionar_recargas() from public;
grant execute on function public.puede_gestionar_recargas() to authenticated;

alter table public.profiles enable row level security;
alter table public.recargas_energia enable row level security;

drop policy if exists "Usuario puede leer su perfil" on public.profiles;
create policy "Usuario puede leer su perfil"
on public.profiles for select
to authenticated
using(id=auth.uid());

drop policy if exists "Publico puede consultar recargas publicadas" on public.recargas_energia;
create policy "Publico puede consultar recargas publicadas"
on public.recargas_energia for select
to anon,authenticated
using(publicado=true or public.puede_gestionar_recargas());

drop policy if exists "Usuarios autorizados pueden insertar recargas" on public.recargas_energia;
create policy "Usuarios autorizados pueden insertar recargas"
on public.recargas_energia for insert
to authenticated
with check(public.puede_gestionar_recargas());

drop policy if exists "Usuarios autorizados pueden actualizar recargas" on public.recargas_energia;
create policy "Usuarios autorizados pueden actualizar recargas"
on public.recargas_energia for update
to authenticated
using(public.puede_gestionar_recargas())
with check(public.puede_gestionar_recargas());

drop policy if exists "Usuarios autorizados pueden eliminar recargas" on public.recargas_energia;
create policy "Usuarios autorizados pueden eliminar recargas"
on public.recargas_energia for delete
to authenticated
using(public.puede_gestionar_recargas());

drop policy if exists "Usuarios autorizados pueden subir PDF recargas" on storage.objects;
create policy "Usuarios autorizados pueden subir PDF recargas"
on storage.objects for insert
to authenticated
with check(bucket_id='recargas-energia' and public.puede_gestionar_recargas());

drop policy if exists "Usuarios autorizados pueden actualizar PDF recargas" on storage.objects;
create policy "Usuarios autorizados pueden actualizar PDF recargas"
on storage.objects for update
to authenticated
using(bucket_id='recargas-energia' and public.puede_gestionar_recargas())
with check(bucket_id='recargas-energia' and public.puede_gestionar_recargas());

drop policy if exists "Usuarios autorizados pueden eliminar PDF recargas" on storage.objects;
create policy "Usuarios autorizados pueden eliminar PDF recargas"
on storage.objects for delete
to authenticated
using(bucket_id='recargas-energia' and public.puede_gestionar_recargas());

create or replace function public.incrementar_descarga_recarga(recarga_id bigint)
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  update public.recargas_energia
  set descargas=coalesce(descargas,0)+1
  where id=recarga_id and publicado=true;
end;
$$;

revoke all on function public.incrementar_descarga_recarga(bigint) from public;
grant execute on function public.incrementar_descarga_recarga(bigint) to anon,authenticated;
