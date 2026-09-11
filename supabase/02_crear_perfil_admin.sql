-- PASO PREVIO:
-- 1. Supabase > Authentication > Users > Add user.
-- 2. Crea tu usuario con correo y contraseña.
-- 3. Copia el UUID del usuario.
-- 4. Reemplaza UUID-AQUI y ejecuta este bloque.

insert into public.profiles(id,nombre_completo,rol,activo)
values(
  'UUID-AQUI',
  'Bilelmo Campos Clavo',
  'admin',
  true
);
