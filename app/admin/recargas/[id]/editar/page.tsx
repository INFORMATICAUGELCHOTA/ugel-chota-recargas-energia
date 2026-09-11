import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {RecargaForm} from "@/components/recarga-form";
import {updateRecarga} from "../../actions";
import type {RecargaEnergia} from "@/lib/types";

export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const{id}=await params;
  const p=await searchParams;
  const e=Array.isArray(p.error)?p.error[0]:p.error;
  const s=await createClient();
  const{data}=await s.from("recargas_energia").select("*").eq("id",Number(id)).single();
  if(!data)notFound();

  return <main className="admin-main">
    <div className="title"><div><small>EDICIÓN</small><h1>Editar recarga de energía</h1></div></div>
    <RecargaForm r={data as RecargaEnergia} action={updateRecarga} error={e}/>
  </main>
}
