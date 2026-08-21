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
import { Access } from "./pages/Access";
import { RoleGuard } from "./components/RoleGuard";
import { JudgeLayout } from "./pages/judge/JudgeLayout";
import { EvaluationForm } from "./pages/judge/EvaluationForm";
import { JudgeHistory } from "./pages/judge/JudgeHistory";
import { Evaluaciones } from "./pages/admin/Evaluaciones";
import { Ganadores } from "./pages/admin/Ganadores";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "registro", Component: Registro },
    ],
  },
  { path: "/acceso", Component: Access },
  { path: "/admin/login", Component: Access },
  {
    Component: RoleGuard,
    children: [{ path: "/admin", Component: AdminLayout, children: [
      { index: true, Component: Dashboard }, { path: "equipos", Component: Equipos },
      { path: "equipos/:id", Component: EquipoDetalle }, { path: "categorias", Component: Categorias },
      { path: "check-in", Component: CheckIn }, { path: "evaluaciones", Component: Evaluaciones },
      { path: "ganadores", Component: Ganadores },
    ]}],
  },
  { Component: RoleGuard, children: [{ path: "/juez", Component: JudgeLayout, children: [
    { index: true, Component: EvaluationForm }, { path: "historial", Component: JudgeHistory },
  ]}]},
]);
