import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {Logo} from "@/components/logo";
import {logout} from "@/app/login/actions";

export const dynamic="force-dynamic";

export default async function AdminLayout({children}:{children:React.ReactNode}){
  const s=await createClient();
  const{data}=await s.auth.getClaims();
  const id=data?.claims?.sub as string|undefined;
  if(!id)redirect("/login");

  const{data:p}=await s.from("profiles").select("nombre_completo,rol,activo").eq("id",id).single();
  if(!p?.activo||!["admin","editor"].includes(p.rol))redirect("/login?error=Acceso+no+autorizado");

  return <div className="admin-shell">
    <aside>
      <Logo/>
      <div className="profile"><small>Sesión iniciada</small><b>{p.nombre_completo}</b><span>{p.rol}</span></div>
      <nav>
        <Link href="/admin">Inicio</Link>
        <Link href="/admin/recargas">Recargas</Link>
        <Link href="/admin/recargas/nueva">Nueva recarga</Link>
        <Link href="/" target="_blank">Portal público</Link>
      </nav>
      <form action={logout}><button className="logout">Cerrar sesión</button></form>
    </aside>
    <section>{children}</section>
  </div>
}
