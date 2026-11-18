-- Zancal · sincronización cifrada. Ejecutar una vez en Supabase → SQL Editor.
-- El servidor solo guarda texto cifrado en el dispositivo del cliente (no puede leerlo).

create table if not exists vault (
  id text primary key check (length(id) = 64),
  blob text not null check (length(blob) <= 3000000),
  rev bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table vault enable row level security;      -- sin políticas: nadie accede a la tabla directamente
revoke all on vault from anon, authenticated;

-- Leer: devuelve el bloque cifrado (o null si el cliente ya tiene esa versión)
create or replace function vault_get(p_id text, p_have bigint default -1)
returns table(blob text, rev bigint)
language sql security definer set search_path = public as $$
  select case when v.rev = p_have then null else v.blob end, v.rev from vault v where v.id = p_id
$$;

-- Guardar: solo si el cliente partía de la versión que hay en el servidor (evita pisar cambios de otro dispositivo)
create or replace function vault_put(p_id text, p_blob text, p_rev bigint, p_prev bigint default 0)
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if length(p_id) <> 64 or length(p_blob) > 3000000 then raise exception 'datos no válidos'; end if;
  insert into vault(id, blob, rev) values (p_id, p_blob, p_rev)
  on conflict (id) do update set blob = excluded.blob, rev = excluded.rev, updated_at = now()
  where vault.rev = p_prev and excluded.rev > vault.rev;
  get diagnostics n = row_count;
  return n > 0;
end $$;

-- Borrar los datos de la nube de un cliente (derecho de supresión)
create or replace function vault_del(p_id text)
returns void language sql security definer set search_path = public as $$
  delete from vault where id = p_id
$$;

grant execute on function vault_get(text, bigint), vault_put(text, text, bigint, bigint), vault_del(text) to anon;
