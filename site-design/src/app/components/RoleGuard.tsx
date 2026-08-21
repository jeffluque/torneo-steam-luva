import { Navigate,Outlet } from "react-router"; import { getSession } from "../lib/demoStore";
export function RoleGuard(){const session=getSession();const requested=location.pathname.startsWith("/admin")?"admin":"judge";return session?.role===requested?<Outlet/>:<Navigate to="/acceso" replace/>}
