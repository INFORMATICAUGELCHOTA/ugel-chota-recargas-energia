import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {nombreMes,soles} from "@/lib/utils";
import {deleteRecarga} from "./actions";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const p=await searchParams;
  const one=(v:any)=>Array.isArray(v)?v[0]??"":v??"";
  const q=one(p.q),ok=one(p.ok);
  const s=await createClient();

  let query=s.from("recargas_energia").select("*").order("anio",{ascending:false}).order("mes",{ascending:false}).limit(500);
  if(q){
    const x=q.replace(/[(),]/g," ");
    query=query.or(`suministro.ilike.%${x}%,institucion_educativa.ilike.%${x}%`)
  }
  const{data:rows}=await query;

  return <main className="admin-main">
    <div className="title">
      <div><small>GESTIÓN DE ENERGÍA</small><h1>Recargas de energía eléctrica</h1></div>
      <Link className="btn" href="/admin/recargas/nueva">+ Nueva recarga</Link>
    </div>

    {ok&&<div className="success">{ok}</div>}

    <form className="admin-search">
      <input name="q" defaultValue={q} placeholder="Buscar por suministro o institución educativa..."/>
      <button>Buscar</button>{q&&<a href="/admin/recargas">Limpiar</a>}
    </form>

    <div className="panel table-wrap">
      <table>
        <thead><tr><th>Suministro / Institución Educativa</th><th>Periodo</th><th>Monto</th><th>Estado</th><th>Desc.</th><th>Acciones</th></tr></thead>
        <tbody>
          {(rows??[]).map(r=><tr key={r.id}>
            <td><b>{r.suministro}</b><small>{r.institucion_educativa}</small></td>
            <td>{nombreMes(r.mes)} {r.anio}</td>
            <td>{r.monto_recarga!==null?soles(r.monto_recarga):"—"}</td>
            <td>{r.publicado?"Publicada":"Oculta"}</td>
            <td>{r.descargas}</td>
            <td>
              <Link href={`/admin/recargas/${r.id}/editar`}>Editar</Link> ·{" "}
              <a target="_blank" href={`/api/download/${r.id}?view=1`}>PDF</a> ·{" "}
              <form action={deleteRecarga} style={{display:"inline"}}>
                <input type="hidden" name="id" value={r.id}/>
                <button className="link-danger">Eliminar</button>
              </form>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </main>
}
