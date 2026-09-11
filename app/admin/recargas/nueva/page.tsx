import {RecargaForm} from "@/components/recarga-form";
import {createRecarga} from "../actions";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const p=await searchParams;
  const e=Array.isArray(p.error)?p.error[0]:p.error;
  return <main className="admin-main">
    <div className="title"><div><small>NUEVO REGISTRO</small><h1>Registrar recarga de energía</h1></div></div>
    <RecargaForm action={createRecarga} error={e}/>
  </main>
}
