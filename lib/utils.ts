export function slugFileName(name:string){
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/-+/g,"-").toLowerCase();
}
export const MESES=[
  "","Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];
export function nombreMes(mes:number){return MESES[mes]??String(mes)}
export function soles(v:number|null|undefined){
  if(v===null||v===undefined||Number.isNaN(Number(v)))return "";
  return new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}).format(Number(v));
}
