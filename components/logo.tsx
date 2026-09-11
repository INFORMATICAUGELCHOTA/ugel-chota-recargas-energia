import Image from "next/image";

export function Logo(){
  return <div className="brand">
    <div className="official-logo-wrap">
      <Image
        src="/logo-ugel-chota.jpg"
        alt="Logo oficial de la Unidad de Gestión Educativa Local Chota"
        width={82}
        height={82}
        className="official-logo"
        priority
      />
    </div>
    <div className="brand-copy">
      <strong>UNIDAD DE GESTIÓN<br className="brand-break"/> EDUCATIVA LOCAL <b>CHOTA</b></strong>
      <span>Recargas de Energía Eléctrica</span>
    </div>
  </div>
}
