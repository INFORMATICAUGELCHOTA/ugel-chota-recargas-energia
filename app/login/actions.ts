"use server";import {createClient} from "@/lib/supabase/server";import {redirect} from "next/navigation";
export async function login(fd:FormData){const s=await createClient();const email=String(fd.get("email")??"").trim(),password=String(fd.get("password")??"");const{error}=await s.auth.signInWithPassword({email,password});if(error)redirect("/login?error=Credenciales+incorrectas");redirect("/admin")}
export async function logout(){const s=await createClient();await s.auth.signOut();redirect("/login")}
