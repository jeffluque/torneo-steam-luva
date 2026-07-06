import { useState } from "react";
import { QrCode, Scan, CheckCircle2, XCircle, Search } from "lucide-react";

export function CheckIn() {
  const [scanMode, setScanMode] = useState(false);
  const [scannedResult, setScannedResult] = useState<"success" | "error" | null>(null);

  const simulateScan = () => {
    setScannedResult("success");
    setTimeout(() => setScannedResult(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Check-in del Evento</h1>
          <p className="text-text-muted">Escaneo de códigos QR y acreditación de participantes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Scan className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Escáner QR</h3>
            <p className="text-sm text-text-muted mb-6">
              Utiliza la cámara para escanear el código QR del equipo y registrar su ingreso.
            </p>
            
            {!scanMode ? (
              <button 
                onClick={() => setScanMode(true)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Activar Cámara
              </button>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square bg-black rounded-xl border border-border flex items-center justify-center relative overflow-hidden group cursor-pointer" onClick={simulateScan}>
                  {/* Simulated camera feed */}
                  <div className="absolute inset-0 border-2 border-primary/50 m-8 rounded-lg">
                    <div className="w-full h-0.5 bg-primary absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
                  </div>
                  <span className="text-xs text-white/50">Clic para simular escaneo</span>
                </div>
                <button 
                  onClick={() => setScanMode(false)}
                  className="w-full bg-background hover:bg-surface border border-border text-white py-2.5 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Scan Results */}
            {scannedResult === "success" && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-emerald-500">¡Ingreso Registrado!</h4>
                <p className="text-sm text-emerald-500/80">Equipo: RoboTicos</p>
              </div>
            )}
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-2xl border border-border overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold">Listado del Día</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar equipo..."
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background text-text-muted sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-medium">Equipo</th>
                    <th className="px-6 py-3 font-medium">Categoría</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">RoboTicos</p>
                      <p className="text-xs text-text-muted">CTP Don Bosco</p>
                    </td>
                    <td className="px-6 py-4 text-text-muted">Seguidor de Línea</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Presente
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-text-muted hover:text-white transition-colors">Ver Info</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">CyberKids</p>
                      <p className="text-xs text-text-muted">Escuela República</p>
                    </td>
                    <td className="px-6 py-4 text-text-muted">Sumo LEGO</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-border"></span> Ausente
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors">Ingresar Manual</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
