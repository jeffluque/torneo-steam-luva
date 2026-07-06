import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Users, Tags, QrCode, Settings, LogOut, Menu, X, Rocket } from "lucide-react";
import { useState } from "react";

export function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/equipos", icon: Users, label: "Inscripciones" },
    { to: "/admin/categorias", icon: Tags, label: "Categorías" },
    { to: "/admin/check-in", icon: QrCode, label: "Check-in QR" },
  ];

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar Mobile Toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-surface rounded-lg border border-border"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold tracking-tight">Admin LUVÁ</h2>
            <span className="text-xs text-cyan">Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-text-muted hover:bg-background hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => navigate("/admin/login")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-text-muted hover:bg-red-500/10 hover:text-red-500 w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <header className="h-16 border-b border-border bg-surface/50 backdrop-blur flex items-center justify-end px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold">Administrador</p>
              <p className="text-xs text-text-muted">admin@steamluva.cr</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Settings className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
