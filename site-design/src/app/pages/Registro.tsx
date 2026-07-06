import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link } from "react-router";
import { CheckCircle2, Rocket, Upload, Plus, Trash2, ArrowLeft, Building2, User, Users } from "lucide-react";

type FormValues = {
  // Proyecto
  nombreProyecto: string;
  categoria: string;
  nivelEscolar: string;
  
  // Institución
  institucion: string;
  provincia: string;
  distrito: string;
  nombreDirector: string;
  emailInstitucion: string;

  // Asesor
  nombreAsesor: string;
  rolAsesor: string;
  generoAsesor: string;
  correoAsesor: string;
  telefonoAsesor: string;

  // Estudiantes
  integrantes: { nombre: string; edad: string; correo: string; genero: string }[];
  
  // Extra
  observaciones: string;
  terminos: boolean;
};

export function Registro() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      integrantes: [{ nombre: "", edad: "", correo: "", genero: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "integrantes"
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError("");
    const endpoint = import.meta.env.VITE_REGISTRATION_ENDPOINT;

    if (!endpoint) {
      setSubmitError("El formulario aún no está conectado. Configurá VITE_REGISTRATION_ENDPOINT antes de publicarlo.");
      return;
    }

    try {
      const body = new URLSearchParams({ payload: JSON.stringify(data) });
      const response = await fetch(endpoint, { method: "POST", body });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "No se pudo registrar el equipo.");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError("No pudimos enviar la inscripción. Revisá tu conexión e intentá nuevamente.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">¡Inscripción Exitosa!</h2>
          <p className="text-text-muted mb-8">
            Hemos recibido los datos de tu equipo. Te hemos enviado un correo electrónico con los siguientes pasos para completar la acreditación.
          </p>
          <Link
            to="/"
            className="inline-flex bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold transition-colors w-full justify-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-text-muted hover:text-white transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-4xl font-bold mb-4">Inscripción de Proyecto</h1>
        <p className="text-text-muted">
          Completá el formulario para registrar a tu equipo en el Torneo STEAM LUVÁ 2026.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-surface border border-border rounded-3xl p-6 md:p-10">
        
        {/* Información del Proyecto */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Información del Proyecto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Nombre del Proyecto o Equipo *</label>
              <input
                {...register("nombreProyecto", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ej. Sistema de Riego Automatizado"
              />
              {errors.nombreProyecto && <span className="text-red-500 text-xs mt-1">Este campo es requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoría *</label>
              <select
                {...register("categoria", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Selecciona una categoría</option>
                <optgroup label="Robomatrix">
                  <option value="seguidor">Seguidor de Línea</option>
                  <option value="sumo">Sumo LEGO</option>
                  <option value="laberinto">Laberinto</option>
                  <option value="electrotec">Electrotec</option>
                </optgroup>
                <optgroup label="Infomatrix">
                  <option value="tecnogame">Tecnogame & Desarrollo</option>
                  <option value="divulgacion">Divulgación Científica</option>
                  <option value="multimedia">Multimedia</option>
                </optgroup>
              </select>
              {errors.categoria && <span className="text-red-500 text-xs mt-1">Selecciona una categoría</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nivel Escolar *</label>
              <select
                {...register("nivelEscolar", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Selecciona el nivel</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Universidad">Universidad</option>
              </select>
              {errors.nivelEscolar && <span className="text-red-500 text-xs mt-1">Selecciona un nivel escolar</span>}
            </div>
          </div>
        </div>

        {/* Institución Educativa */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan" />
            Datos de la Institución
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Nombre de la Escuela/Institución *</label>
              <input
                {...register("institucion", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Nombre oficial del centro educativo"
              />
              {errors.institucion && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Provincia *</label>
              <select
                {...register("provincia", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Selecciona una provincia</option>
                <option value="sanjose">San José</option>
                <option value="alajuela">Alajuela</option>
                <option value="cartago">Cartago</option>
                <option value="heredia">Heredia</option>
                <option value="guanacaste">Guanacaste</option>
                <option value="puntarenas">Puntarenas</option>
                <option value="limon">Limón</option>
              </select>
              {errors.provincia && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Distrito *</label>
              <input
                {...register("distrito", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Ej. Carmen"
              />
              {errors.distrito && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Director(a) de la Institución *</label>
              <input
                {...register("nombreDirector", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Nombre completo"
              />
              {errors.nombreDirector && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email de la Institución *</label>
              <input
                type="email"
                {...register("emailInstitucion", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="correo@institucion.ed.cr"
              />
              {errors.emailInstitucion && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>
          </div>
        </div>

        {/* Asesor / Responsable */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Datos del Asesor / Responsable
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Asesor *</label>
              <input
                {...register("nombreAsesor", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Nombre completo"
              />
              {errors.nombreAsesor && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rol del Asesor *</label>
              <select
                {...register("rolAsesor", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Selecciona el rol</option>
                <option value="Profesor">Profesor</option>
                <option value="Director">Director</option>
                <option value="Padre">Padre de Familia</option>
              </select>
              {errors.rolAsesor && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Género del Asesor *</label>
              <select
                {...register("generoAsesor", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro / Prefiero no decirlo</option>
              </select>
              {errors.generoAsesor && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teléfono / WhatsApp *</label>
              <input
                {...register("telefonoAsesor", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="8888-8888"
              />
              {errors.telefonoAsesor && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Correo Electrónico del Asesor *</label>
              <input
                type="email"
                {...register("correoAsesor", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="correo@ejemplo.com"
              />
              {errors.correoAsesor && <span className="text-red-500 text-xs mt-1">Requerido</span>}
            </div>
          </div>
        </div>

        {/* Estudiantes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Estudiantes Participantes
            </h3>
            <span className="text-sm bg-background px-3 py-1 rounded-full border border-border">
              {fields.length} / 3 Máx.
            </span>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative bg-background p-6 rounded-2xl border border-border">
                <div className="absolute top-4 right-4 text-xs font-bold text-text-muted bg-surface px-2 py-1 rounded-md border border-border">
                  Participante {index + 1}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1 text-text-muted">Nombre Completo *</label>
                    <input
                      {...register(`integrantes.${index}.nombre` as const, { required: true })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Nombre completo del estudiante"
                    />
                    {errors?.integrantes?.[index]?.nombre && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 text-text-muted">Edad *</label>
                    <input
                      type="number"
                      {...register(`integrantes.${index}.edad` as const, { required: true })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Ej. 15"
                    />
                    {errors?.integrantes?.[index]?.edad && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-text-muted">Género *</label>
                    <select
                      {...register(`integrantes.${index}.genero` as const, { required: true })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {errors?.integrantes?.[index]?.genero && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1 text-text-muted">Correo Electrónico *</label>
                    <input
                      type="email"
                      {...register(`integrantes.${index}.correo` as const, { required: true })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="estudiante@ejemplo.com"
                    />
                    {errors?.integrantes?.[index]?.correo && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                  </div>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-24 md:right-auto md:bottom-4 md:top-auto p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="hidden md:inline">Eliminar</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {fields.length < 3 && (
            <button
              type="button"
              onClick={() => append({ nombre: "", edad: "", correo: "", genero: "" })}
              className="mt-4 px-4 py-3 bg-surface hover:bg-surface-hover border border-dashed border-border text-cyan rounded-xl w-full flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" /> Agregar otro estudiante
            </button>
          )}
        </div>

        {/* Documentos */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4">Documentos y Finalización</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Comprobante de Pago o Documento Opcional (próximamente)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 opacity-60">
              <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">La carga de archivos todavía no está habilitada</p>
              <p className="text-xs text-text-muted">La organización indicará cómo entregar el comprobante.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Observaciones</label>
            <textarea
              {...register("observaciones")}
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="¿Alguna necesidad especial, alergias o comentarios adicionales?"
            ></textarea>
          </div>
        </div>

        {/* Términos */}
        <div className="pt-6 border-t border-border">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1">
              <input
                type="checkbox"
                {...register("terminos", { required: true })}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-border rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
              <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm text-text-muted group-hover:text-white transition-colors">
              Declaro que toda la información brindada es verídica y <strong className="text-white">acepto el reglamento y las condiciones</strong> del Torneo STEAM LUVÁ 2026. *
            </span>
          </label>
          {errors.terminos && <span className="text-red-500 text-xs mt-2 block">Debes aceptar los términos</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
        >
          ENVIAR INSCRIPCIÓN
        </button>
        {submitError && (
          <p role="alert" className="text-red-400 text-sm text-center">{submitError}</p>
        )}
      </form>
    </div>
  );
}
