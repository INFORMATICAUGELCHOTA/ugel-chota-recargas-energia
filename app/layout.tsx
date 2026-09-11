import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"Repositorio de Resoluciones | UGEL Chota",description:"Repositorio institucional de recargas de energía eléctrica para instituciones educativas con sistema prepago - UGEL Chota."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
