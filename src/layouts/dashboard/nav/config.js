// component
import { mdiAccountWrenchOutline, mdiHome } from "@mdi/js";
import { Icon } from "@mdi/react";

// ----------------------------------------------------------------------

export default function navConfig() {
  const navConfig = [
    {
      title: "INICIO",
      path: "/dashboard",
      icon: <Icon size={1} path={mdiHome} />,
      haveAccess: true,
      enabled: true,
    },
    {
      title: "Consulta Clientes",
      path: "/dashboard/clients",
      icon: <Icon size={1} path={mdiAccountWrenchOutline} />,
      // haveAccess: auth.rol === "Administrador",
      haveAccess: true,
      enabled: true,
    },
  ];

  return navConfig;
}
