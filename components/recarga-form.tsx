import type {RecargaEnergia} from "@/lib/types";
import {MESES} from "@/lib/utils";

export function RecargaForm({
  r,action,error
}:{
  r?:RecargaEnergia;
  action:(f:FormData)=>void|Promise<void>;
  error?:string
}){
  const currentYear=new Date().getFullYear();
  return <form action={action} className="panel form">
    {r&&<input type="hidden" name="id" value={r.id}/>}
    {error&&<div className="error full">{error}</div>}

    <label>Suministro *
      <input name="suministro" required defaultValue={r?.suministro??""} placeholder="Ej.: 12345678"/>
    </label>

    <label>Institución Educativa *
      <input name="institucion_educativa" required defaultValue={r?.institucion_educativa??""} placeholder="Ej.: I.E. N.° 12345 - Chota"/>
    </label>

    <label>Mes *
      <select name="mes" required defaultValue={r?.mes??new Date().getMonth()+1}>
        {MESES.slice(1).map((m,i)=><option value={i+1} key={m}>{m}</option>)}
      </select>
    </label>

    <label>Año *
      <input type="number" name="anio" min="2020" max="2100" required defaultValue={r?.anio??currentYear}/>
    </label>

    <label>Monto de recarga (S/)
      <input type="number" name="monto_recarga" min="0" step="0.01" defaultValue={r?.monto_recarga??""} placeholder="Opcional"/>
    </label>

    <label className="full">Observaciones
      <textarea name="observaciones" defaultValue={r?.observaciones??""} placeholder="Información adicional de la recarga"/>
    </label>

    <label className="full">Archivo PDF {r?"(opcional para reemplazar)":"*"}
      <input type="file" name="pdf" accept="application/pdf,.pdf" required={!r}/>
      <small>Máximo 20 MB. El documento será almacenado en Supabase Storage.</small>
    </label>

    <label className="check full">
      <input type="checkbox" name="publicado" defaultChecked={r?r.publicado:true}/>
      Publicar en el portal
    </label>

    <div className="full">
      <button>Guardar recarga</button> <a href="/admin/recargas">Cancelar</a>
    </div>
  </form>
}
