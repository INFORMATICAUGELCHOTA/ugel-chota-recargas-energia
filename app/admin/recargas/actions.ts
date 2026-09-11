"use server";

import {createClient} from "@/lib/supabase/server";
import {slugFileName} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const MAX=20*1024*1024;
const v=(f:FormData,k:string)=>String(f.get(k)??"").trim();

async function auth(){
  const s=await createClient();
  const{data}=await s.auth.getClaims();
  const id=data?.claims?.sub as string|undefined;
  if(!id)redirect("/login");
  const{data:p}=await s.from("profiles").select("rol,activo").eq("id",id).single();
  if(!p?.activo||!["admin","editor"].includes(p.rol))redirect("/login");
  return{s,id}
}

function valid(file:File){
  if(!file||!file.size)return"Selecciona un PDF";
  if(file.size>MAX)return"El PDF supera 20 MB";
  if(file.type!=="application/pdf"||!file.name.toLowerCase().endsWith(".pdf"))return"Solo se permiten archivos PDF";
  return null
}

export async function createRecarga(f:FormData){
  const{s,id}=await auth();
  const pdf=f.get("pdf") as File;
  const er=valid(pdf);
  if(er)redirect(`/admin/recargas/nueva?error=${encodeURIComponent(er)}`);

  const anio=Number(v(f,"anio"));
  const mes=Number(v(f,"mes"));
  const montoTxt=v(f,"monto_recarga");
  const path=`${anio}/${String(mes).padStart(2,"0")}/${Date.now()}-${crypto.randomUUID().slice(0,8)}-${slugFileName(pdf.name)}`;

  const up=await s.storage.from("recargas-energia").upload(path,pdf,{contentType:"application/pdf"});
  if(up.error)redirect(`/admin/recargas/nueva?error=${encodeURIComponent(up.error.message)}`);

  const{error}=await s.from("recargas_energia").insert({
    suministro:v(f,"suministro"),
    institucion_educativa:v(f,"institucion_educativa"),
    mes,
    anio,
    monto_recarga:montoTxt?Number(montoTxt):null,
    observaciones:v(f,"observaciones")||null,
    archivo_path:path,
    archivo_nombre:pdf.name,
    archivo_size:pdf.size,
    publicado:f.get("publicado")==="on",
    created_by:id
  });

  if(error){
    await s.storage.from("recargas-energia").remove([path]);
    redirect(`/admin/recargas/nueva?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/recargas?ok=Recarga+registrada+correctamente")
}

export async function updateRecarga(f:FormData){
  const{s}=await auth();
  const id=Number(v(f,"id"));

  const{data:cur}=await s.from("recargas_energia")
    .select("archivo_path,archivo_nombre,archivo_size")
    .eq("id",id).single();

  if(!cur)redirect("/admin/recargas");

  let path=cur.archivo_path,name=cur.archivo_nombre,size=cur.archivo_size;
  const pdf=f.get("pdf") as File|null;
  const anio=Number(v(f,"anio"));
  const mes=Number(v(f,"mes"));
  const montoTxt=v(f,"monto_recarga");

  if(pdf&&pdf.size){
    const er=valid(pdf);
    if(er)redirect(`/admin/recargas/${id}/editar?error=${encodeURIComponent(er)}`);
    const np=`${anio}/${String(mes).padStart(2,"0")}/${Date.now()}-${crypto.randomUUID().slice(0,8)}-${slugFileName(pdf.name)}`;
    const up=await s.storage.from("recargas-energia").upload(np,pdf,{contentType:"application/pdf"});
    if(up.error)redirect(`/admin/recargas/${id}/editar?error=${encodeURIComponent(up.error.message)}`);
    path=np;name=pdf.name;size=pdf.size
  }

  const{error}=await s.from("recargas_energia").update({
    suministro:v(f,"suministro"),
    institucion_educativa:v(f,"institucion_educativa"),
    mes,anio,
    monto_recarga:montoTxt?Number(montoTxt):null,
    observaciones:v(f,"observaciones")||null,
    archivo_path:path,
    archivo_nombre:name,
    archivo_size:size,
    publicado:f.get("publicado")==="on",
    updated_at:new Date().toISOString()
  }).eq("id",id);

  if(error)redirect(`/admin/recargas/${id}/editar?error=${encodeURIComponent(error.message)}`);
  if(path!==cur.archivo_path)await s.storage.from("recargas-energia").remove([cur.archivo_path]);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/recargas?ok=Cambios+guardados")
}

export async function deleteRecarga(f:FormData){
  const{s}=await auth();
  const id=Number(v(f,"id"));
  const{data:r}=await s.from("recargas_energia").select("archivo_path").eq("id",id).single();
  await s.from("recargas_energia").delete().eq("id",id);
  if(r?.archivo_path)await s.storage.from("recargas-energia").remove([r.archivo_path]);
  revalidatePath("/");
  revalidatePath("/admin/recargas")
}
