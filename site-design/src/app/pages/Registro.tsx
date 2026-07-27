import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link } from "react-router";
import { CheckCircle2, Rocket, Upload, Plus, Trash2, ArrowLeft, Building2, User, Users } from "lucide-react";

type Student = {
  nombre: string;
  edad: string;
  correo: string;
  genero: string;
};

type FormValues = {
  nombreProyecto: string;
  categoria: string;
  nivelEscolar: string;
  institucion: string;
  provincia: string;
  distrito: string;
  nombreDirector: string;
  emailInstitucion: string;
  nombreAsesor: string;
  rolAsesor: string;
  generoAsesor: string;
  correoAsesor: string;
  telefonoAsesor: string;
  integrantes: Student[];
  comprobantePago: FileList;
  observaciones: string;
  terminos: boolean;
};

type FilePayload = {
  name: string;
  type: string;
  size: number;
  base64: string;
};

const MAX_PAYMENT_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PAYMENT_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ALLOWED_PAYMENT_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileToPayload(file: File): Promise<FilePayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        base64
      });
    };

    reader.onerror = () => reject(new Error("No se pudo leer el comprobante."));
    reader.readAsDataURL(file);
  });
}

function isAllowedPaymentFile(file: File) {
  const lowerName = file.name.toLowerCase();
  return ALLOWED_PAYMENT_FILE_TYPES.includes(file.type) ||
    ALLOWED_PAYMENT_FILE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

export function Registro() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      integrantes: [{ nombre: "", edad: "", correo: "", genero: "" }]
    }
  });
  const selectedPaymentFile = watch("comprobantePago")?.[0];

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
      const paymentFile = data.comprobantePago?.[0];

      if (!paymentFile) {
        setSubmitError("Debés adjuntar el comprobante de pago para completar la inscripción.");
        return;
      }

      if (!isAllowedPaymentFile(paymentFile)) {
        setSubmitError("El comprobante debe ser PDF, JPG, PNG o WebP.");
        return;
      }

      if (paymentFile.size > MAX_PAYMENT_FILE_SIZE) {
        setSubmitError("El comprobante no puede pesar más de 5 MB.");
        return;
      }

      const payload = {
        ...data,
        comprobantePago: await fileToPayload(paymentFile)
      };

      const body = new URLSearchParams({ payload: JSON.stringify(payload) });
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
          <h2 className="text-3xl font-bold mb-4">¡Inscripción exitosa!</h2>
          <p className="text-text-muted mb-8">
            Hemos recibido los datos de tu equipo y el comprobante de pago. Te enviamos un correo electrónico de confirmación al asesor responsable.
          </p>
          <Link
            to="/"
            className="inline-flex bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold transition-colors w-full justify-center"
          >
            Volver al inicio
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
          Completá el formulario para registrar a tu equipo en el Torneo STEAM LUVÁ 2026. Tené listo el comprobante de pago en PDF o imagen.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-surface border border-border rounded-3xl p-6 md:p-10">
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
                <option value="">Seleccioná una categoría</option>
                <optgroup label="Robomatrix">
                  <option value="seguidor">Seguidor de Línea</option>
                  <option value="sumo">Sumo LEGO</option>
                  <option value="laberinto">Laberinto</option>
                  <option value="electrotec">Electrotec</option>
                  <option value="reto-robotica">Reto de Robótica</option>
                </optgroup>
                <optgroup label="Infomatrix">
                  <option value="tecnogame">Tecnogame y Desarrollo de Software</option>
                  <option value="divulgacion">Divulgación Científica</option>
                  <option value="multimedia">Multimedia</option>
                </optgroup>
              </select>
              {errors.categoria && <span className="text-red-500 text-xs mt-1">Seleccioná una categoría</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nivel Escolar *</label>
              <select
                {...register("nivelEscolar", { required: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Seleccioná el nivel</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Universidad">Universidad</option>
              </select>
              {errors.nivelEscolar && <span className="text-red-500 text-xs mt-1">Seleccioná un nivel escolar</span>}
            </div>
          </div>
        </div>

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
                <option value="">Seleccioná una provincia</option>
                <option value="San José">San José</option>
                <option value="Alajuela">Alajuela</option>
                <option value="Cartago">Cartago</option>
                <option value="Heredia">Heredia</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Puntarenas">Puntarenas</option>
                <option value="Limón">Limón</option>
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
                <option value="">Seleccioná el rol</option>
                <option value="Profesor">Profesor</option>
                <option value="Director">Director</option>
                <option value="Padre de Familia">Padre de Familia</option>
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
                <option value="Otro / Prefiero no decirlo">Otro / Prefiero no decirlo</option>
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
                      <option value="Otro / Prefiero no decirlo">Otro / Prefiero no decirlo</option>
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

        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-border pb-4">Documentos y Finalización</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Comprobante de Pago *</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 hover:border-primary/60 transition-colors">
              <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-sm font-medium mb-3">Adjuntá el comprobante para confirmar la inscripción</p>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                Seleccionar archivo
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  {...register("comprobantePago", { required: true })}
                  className="sr-only"
                />
              </label>
              {selectedPaymentFile ? (
                <div className="mx-auto mt-4 flex max-w-xl items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-left">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{selectedPaymentFile.name}</p>
                    <p className="text-xs text-emerald-200">Archivo agregado · {formatFileSize(selectedPaymentFile.size)}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-amber-200">Aún no has seleccionado ningún archivo.</p>
              )}
              <p className="text-xs text-text-muted mt-3">Formatos permitidos: PDF, JPG, PNG o WebP. Tamaño máximo: 5 MB.</p>
            </div>
            {errors.comprobantePago && <span className="text-red-500 text-xs mt-2 block">El comprobante es requerido</span>}
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
              Declaro que toda la información brindada es verídica y acepto el{" "}
              <a
                href="/reglamentos/guia-oficial-participacion.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-cyan hover:text-white underline underline-offset-4"
              >
                reglamento y las condiciones
              </a>{" "}
              del Torneo STEAM LUVÁ 2026. *
            </span>
          </label>
          {errors.terminos && <span className="text-red-500 text-xs mt-2 block">Debés aceptar los términos</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
        >
          {isSubmitting ? "ENVIANDO INSCRIPCIÓN..." : "ENVIAR INSCRIPCIÓN"}
        </button>
        {submitError && (
          <p role="alert" className="text-red-400 text-sm text-center">{submitError}</p>
        )}
      </form>
    </div>
  );
}
