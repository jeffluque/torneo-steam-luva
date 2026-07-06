import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Registro } from "./pages/Registro";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Equipos } from "./pages/admin/Equipos";
import { EquipoDetalle } from "./pages/admin/EquipoDetalle";
import { Categorias } from "./pages/admin/Categorias";
import { CheckIn } from "./pages/admin/CheckIn";
import { Login } from "./pages/admin/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "registro", Component: Registro },
    ],
  },
  {
    path: "/admin/login",
    Component: Login,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "equipos", Component: Equipos },
      { path: "equipos/:id", Component: EquipoDetalle },
      { path: "categorias", Component: Categorias },
      { path: "check-in", Component: CheckIn },
    ],
  }
]);
