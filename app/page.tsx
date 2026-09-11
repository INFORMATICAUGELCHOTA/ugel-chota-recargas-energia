import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {Logo} from "@/components/logo";
import {MESES,nombreMes,soles} from "@/lib/utils";

export const dynamic="force-dynamic";

export default async function Home({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const p=await searchParams;
  const one=(v:any)=>Array.isArray(v)?v[0]??"":v??"";
  const suministro=one(p.suministro).trim();
  const institucion=one(p.institucion).trim();
  const mes=one(p.mes);
  const anio=one(p.anio);

  const supabase=await createClient();
  let query=supabase.from("recargas_energia").select("*").eq("publicado",true)
    .order("anio",{ascending:false}).order("mes",{ascending:false}).limit(300);

  if(suministro)query=query.ilike("suministro",`%${suministro.replace(/[(),]/g," ")}%`);
  if(institucion)query=query.ilike("institucion_educativa",`%${institucion.replace(/[(),]/g," ")}%`);
  if(mes)query=query.eq("mes",Number(mes));
  if(anio)query=query.eq("anio",Number(anio));

  const{data:rows}=await query;
  const{data:f}=await supabase.from("recargas_energia").select("anio").eq("publicado",true);
  const years=[...new Set((f??[]).map(x=>Number(x.anio)))].sort((a,b)=>b-a);

  return <>
    <div className="strip"/>
    <header className="public-header">
      <div className="container head">
        <Logo/>
        <div className="institutional-motto">“Comprometidos con una Educación<br/>de calidad, inclusiva y con identidad”</div>
        <nav>
          <a href="#recargas" className="nav-active"><span className="nav-symbol">⌂</span><span>Recargas</span></a>
          <Link href="/login"><span className="nav-symbol">♟</span><span>Administración</span></Link>
        </nav>
      </div>
    </header>

    <section className="hero hero-final energy-hero">
      <div className="hero-final-bg" aria-hidden="true"/>
      <div className="hero-final-shade" aria-hidden="true"/>
      <div className="container hero-final-content">
        <div className="hero-final-copy">
          <span className="eyebrow hero-eyebrow">ENERGÍA ELÉCTRICA&nbsp;&nbsp; | &nbsp;&nbsp;SISTEMA PREPAGO&nbsp;&nbsp; | &nbsp;&nbsp;INSTITUCIONES EDUCATIVAS</span>
          <h1>Repositorio de<br/>Recargas de Energía Eléctrica</h1>
          <p>Consulta, visualiza y descarga las constancias de recarga de energía eléctrica de las <strong>Instituciones Educativas de la UGEL Chota.</strong></p>
        </div>
      </div>
    </section>

    <main className="container content content-final" id="recargas">
      <form className="search search-modern search-final energy-search">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input name="suministro" defaultValue={suministro} placeholder="Número de suministro..."/>
        </div>
        <div className="search-input-wrap">
          <span className="search-icon">⌂</span>
          <input name="institucion" defaultValue={institucion} placeholder="Institución Educativa..."/>
        </div>
        <select name="mes" defaultValue={mes}>
          <option value="">Todos los meses</option>
          {MESES.slice(1).map((m,i)=><option value={i+1} key={m}>{m}</option>)}
        </select>
        <select name="anio" defaultValue={anio}>
          <option value="">Todos los años</option>
          {years.map(y=><option key={y}>{y}</option>)}
        </select>
        <button>⌕&nbsp;&nbsp; Buscar</button>
        <a href="/">↻&nbsp;&nbsp; Limpiar</a>
      </form>

      <div className="results-info">
        <strong>{(rows??[]).length}</strong> recarga{(rows??[]).length===1?'':'s'} encontrada{(rows??[]).length===1?'':'s'}
      </div>

      <div className="grid public-grid-final energy-grid">
        {(rows??[]).map(r=><article key={r.id} className="energy-card">
          <div className="tag">⚡</div>
          <small>{nombreMes(r.mes)} de {r.anio}</small>
          <h3>Suministro: {r.suministro}</h3>
          <p className="ie-name">{r.institucion_educativa}</p>
          {r.monto_recarga!==null&&<span><b>Monto:</b> {soles(r.monto_recarga)}</span>}
          {r.observaciones&&<span><b>Observación:</b> {r.observaciones}</span>}
          <div className="actions">
            <a className="primary" target="_blank" href={`/api/download/${r.id}?view=1`}>◉&nbsp;&nbsp; Ver PDF</a>
            <a href={`/api/download/${r.id}`}>⇩&nbsp;&nbsp; Descargar</a>
          </div>
        </article>)}
      </div>

      {(rows??[]).length===0&&<div className="empty">No se encontraron recargas con los filtros seleccionados.</div>}
    </main>

    <footer className="public-footer-final">
      <div className="container footer-final">
        <span>© {new Date().getFullYear()} Unidad de Gestión Educativa Local de Chota. Todos los derechos reservados.</span>
        <span>Energía eléctrica &nbsp; | &nbsp; Sistema prepago &nbsp; | &nbsp; Gestión documental</span>
      </div>
    </footer>
  </>
}
