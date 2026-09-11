export type RecargaEnergia={
  id:number;
  suministro:string;
  institucion_educativa:string;
  mes:number;
  anio:number;
  monto_recarga:number|null;
  observaciones:string|null;
  archivo_path:string;
  archivo_nombre:string;
  archivo_size:number|null;
  descargas:number;
  publicado:boolean;
  created_by:string|null;
  created_at:string;
  updated_at:string;
};
