import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

export default async function Dashboard(){
  const s=await createClient();
  const[{count:t},{count:p},{data:d}]=await Promise.all([
    s.from("recargas_energia").select("id",{count:"exact",head:true}),
    s.from("recargas_energia").select("id",{count:"exact",head:true}).eq("publicado",true),
    s.from("recargas_energia").select("descargas")
  ]);
  const downloads=(d??[]).reduce((n,r)=>n+(r.descargas??0),0);

  return <main className="admin-main">
    <div className="title">
      <div><small>GESTIÓN DE ENERGÍA ELÉCTRICA</small><h1>Panel de control</h1></div>
      <Link className="btn" href="/admin/recargas/nueva">+ Nueva recarga</Link>
    </div>
    <div className="stats">
      <div><span>Total registradas</span><b>{t??0}</b></div>
      <div><span>Publicadas</span><b>{p??0}</b></div>
      <div><span>Descargas</span><b>{downloads}</b></div>
    </div>
    <div className="panel">
      <h2>Recargas de energía eléctrica</h2>
      <p>Registra, edita, publica u oculta constancias de recarga para instituciones educativas con sistema prepago y administra sus PDF desde Supabase Storage.</p>
      <Link href="/admin/recargas">Administrar recargas →</Link>
    </div>
  </main>
}
