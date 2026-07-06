import { useState } from "react";
import { useNavigate } from "react-router";
import { Rocket, Lock, Mail } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-cyan"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border shadow-lg">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portal Administrativo</h1>
          <p className="text-text-muted mt-2">Torneo STEAM LUVÁ 2026</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-muted">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="admin@steamluva.cr"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-muted">Contraseña</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            INGRESAR
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-text-muted">
          <p>&copy; 2026 STEAM LUVÁ. Sistema Restringido.</p>
          <a href="/" className="hover:text-white transition-colors mt-2 inline-block">Volver al sitio público</a>
        </div>
      </div>
    </div>
  );
}
