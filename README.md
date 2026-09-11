# Repositorio de Recargas de Energía Eléctrica – UGEL Chota

Proyecto independiente para administrar y publicar constancias PDF de **recargas de energía eléctrica de Instituciones Educativas con sistema prepago**.

## Funciones

- Portal público institucional.
- Filtro por **Suministro**.
- Filtro por **Institución Educativa**.
- Filtro por **Mes**.
- Filtro por **Año**.
- Botón **Ver PDF**.
- Botón **Descargar**.
- Contador de descargas.
- Inicio de sesión administrativo con Supabase Auth.
- Panel administrador/editor.
- Registrar, editar, publicar/ocultar y eliminar recargas.
- Subida y reemplazo de PDF a Supabase Storage.
- RLS y políticas de seguridad.
- Preparado para Vercel + Supabase.

## Campos de cada recarga

- Suministro.
- Institución Educativa.
- Mes.
- Año.
- Monto de recarga (opcional).
- Observaciones (opcional).
- PDF.
- Estado publicado/oculto.

## 1. Crear un NUEVO proyecto Supabase

Se recomienda crear un proyecto independiente, por ejemplo:

`ugel-chota-recargas-energia`

## 2. Crear base de datos, Storage y seguridad

Supabase > SQL Editor.

Ejecuta completo:

`supabase/01_instalacion_completa.sql`

Esto crea:
- `profiles`
- `recargas_energia`
- bucket `recargas-energia`
- RLS
- políticas de lectura/escritura
- contador de descargas

## 3. Crear administrador

Supabase > Authentication > Users > Add user.

Luego copia su UUID, abre:

`supabase/02_crear_perfil_admin.sql`

Reemplaza `UUID-AQUI` y ejecuta.

## 4. GitHub

Crea un repositorio nuevo, recomendado:

`ugel-chota-recargas-energia`

Sube el contenido de este proyecto a la raíz.

## 5. Vercel

Importa el repositorio y configura:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Framework: Next.js  
Root Directory: `./`

Después pulsa Deploy.

## 6. Acceso

Portal público:

`https://TU-PROYECTO.vercel.app/`

Administración:

`https://TU-PROYECTO.vercel.app/login`

## Seguridad

No publiques `service_role`, contraseña de base de datos ni otras claves privadas. La Publishable Key puede utilizarse en el cliente porque el acceso está controlado por RLS.
Despliegue inicial en Vercel
