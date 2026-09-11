import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const{id}=await params;
  const s=await createClient();
  const{data:r}=await s.from("recargas_energia")
    .select("id,archivo_path,archivo_nombre")
    .eq("id",Number(id))
    .eq("publicado",true)
    .single();

  if(!r)return new NextResponse("Documento no encontrado",{status:404});

  await s.rpc("incrementar_descarga_recarga",{recarga_id:Number(id)});
  const{data}=s.storage.from("recargas-energia").getPublicUrl(r.archivo_path);

  const url=new URL(request.url);
  const view=url.searchParams.get("view")==="1";
  if(view)return NextResponse.redirect(data.publicUrl,302);

  const res=NextResponse.redirect(data.publicUrl,302);
  res.headers.set("Content-Disposition",`attachment; filename="${encodeURIComponent(r.archivo_nombre||"recarga.pdf")}"`);
  return res
}
