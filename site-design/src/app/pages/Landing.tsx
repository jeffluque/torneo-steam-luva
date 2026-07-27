import { Link } from "react-router";
import { ArrowRight, Trophy, Code2, Lightbulb, Globe2, ChevronDown, CheckCircle2, Calendar, MapPin, Clock, Download } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import luvaLogo from "../../imports/LUV_-LOGO-UN-COLOR-B.png";
import luvaLogoColor from "../../imports/LUV_-LOGO.png";
import solacytLogo from "../../imports/image__3_.png";
import akamaiNewLogo from "../../imports/image__4_.png";
import alternateLogo from "../../imports/image.png";
import cedesLogo from "../../imports/logocedes.png";
import robomatrixLogo from "../../imports/logo_rm.png";
import infomatrixLogoWhite from "../../imports/infomatrix-logo-white.png";
import roboticaNino from "../../imports/fotos/robotica-nino.webp";
import roboticaNinaProgramacion from "../../imports/fotos/robotica-nina-programacion.webp";
import roboticaConcentracion from "../../imports/fotos/robotica-concentracion.webp";
import roboticaNinoCarro from "../../imports/fotos/robotica-nino-carro.webp";
import competenciaRobotica from "../../imports/fotos/competencia-robotica.webp";
import robotOmni from "../../imports/fotos/robot-omni.webp";
import seguidorLinea2025 from "../../imports/fotos/seguidor-linea-2025.webp";
import sumoLego2025 from "../../imports/fotos/sumo-lego-2025.webp";
import laberinto2025 from "../../imports/fotos/laberinto-2025.webp";
import electrotec2025 from "../../imports/fotos/electrotec-2025.webp";
import retoRobotica2025 from "../../imports/fotos/reto-robotica-2025.webp";
import tecnogameDesarrollo2025 from "../../imports/fotos/tecnogame-desarrollo-2025.webp";
import divulgacionCientifica2025 from "../../imports/fotos/divulgacion-cientifica-2025.webp";

export function Landing() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
        {/* Background Image/Video Fallback */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1742767069929-0c663150b164?q=80&w=2000&auto=format&fit=crop"
            alt="Robotics Competition Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
              <span className="text-sm font-medium text-cyan">Inscripciones Abiertas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              TORNEO STEAM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-cyan">
                LUVÁ 2026
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-2xl font-light">
              Competí, innová y representá a Costa Rica en eventos internacionales de ciencia, tecnología y robótica.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                to="/registro"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              >
                INSCRIBIR EQUIPO
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#categorias"
                className="bg-surface hover:bg-surface-hover border border-border text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors"
              >
                VER CATEGORÍAS
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50">
              <div>
                <div className="text-3xl font-black text-white mb-1">+400</div>
                <div className="text-sm text-text-muted font-medium">Estudiantes</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">+100</div>
                <div className="text-sm text-text-muted font-medium">Equipos</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">8</div>
                <div className="text-sm text-text-muted font-medium">Categorías</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">3</div>
                <div className="text-sm text-text-muted font-medium">Acreditaciones Int.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ PARTICIPAR */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Por qué participar?</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Más que una competencia, es el inicio de tu carrera en el mundo de la tecnología.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Trophy,
                title: "Competí",
                desc: "Poné a prueba tus habilidades frente a estudiantes de todo el país.",
                color: "text-primary",
                bg: "bg-primary/10"
              },
              {
                icon: Code2,
                title: "Aprendé",
                desc: "Desarrollá programación, ingeniería y pensamiento crítico.",
                color: "text-accent",
                bg: "bg-accent/10"
              },
              {
                icon: Lightbulb,
                title: "Innová",
                desc: "Convertí tus ideas en proyectos reales y soluciones tangibles.",
                color: "text-cyan",
                bg: "bg-cyan/10"
              },
              {
                icon: Globe2,
                title: "Representá a CR",
                desc: "Obtené acreditaciones internacionales para competir en el exterior.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10"
              }
            ].map((item, i) => (
              <div key={i} className="bg-surface p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors group">
                <div className={`${item.bg} ${item.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCIA INTERNACIONAL */}
      <section id="internacional" className="py-24 bg-surface border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border mb-6">
                <Globe2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Proyección Global</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Tu talento puede llegar al mundo.
              </h2>
              <p className="text-lg text-text-muted mb-8">
                Los mejores equipos podrán obtener acreditaciones internacionales gracias a nuestras alianzas con 
                <strong className="text-white"> Infomatrix</strong> y 
                <strong className="text-white"> Robomatrix</strong>.
              </p>
              
              <ul className="space-y-4 mb-10">
                {['México', 'Ecuador', 'Rumania', 'China', 'España'].map((country) => (
                  <li key={country} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan" />
                    <span className="text-lg font-medium">{country}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/registro"
                className="bg-white text-background hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition-colors"
              >
                QUIERO PARTICIPAR
              </Link>
            </div>
            
            <div className="relative">
              {/* Map visualization mock */}
              <div className="aspect-square bg-[#0B1121] rounded-full border border-primary/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                {/* Lat/Long Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]"></div>
                
                {/* Central Node: Costa Rica */}
                <div className="absolute top-[55%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(37,99,235,1)] z-10">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap text-white">Costa Rica</span>
                </div>
                
                {/* Connections & Other Nodes */}
                
                {/* México */}
                <div className="absolute top-[45%] left-[18%] w-3 h-3 bg-cyan rounded-full z-10">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan">México</span>
                </div>
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <path d="M 25% 55% Q 20% 50% 18% 45%" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                </svg>

                {/* Ecuador */}
                <div className="absolute top-[65%] left-[28%] w-3 h-3 bg-emerald-400 rounded-full z-10">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-400">Ecuador</span>
                </div>
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <path d="M 25% 55% Q 26% 60% 28% 65%" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                </svg>

                {/* España */}
                <div className="absolute top-[35%] left-[45%] w-3 h-3 bg-purple-500 rounded-full z-10">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-purple-500">España</span>
                </div>
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <path d="M 25% 55% Q 35% 40% 45% 35%" fill="none" stroke="#A855F7" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                </svg>

                {/* Rumania */}
                <div className="absolute top-[30%] left-[55%] w-3 h-3 bg-accent rounded-full z-10">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-accent">Rumania</span>
                </div>
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <path d="M 25% 55% Q 40% 45% 55% 30%" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                </svg>

                {/* China */}
                <div className="absolute top-[40%] left-[75%] w-3 h-3 bg-orange-400 rounded-full z-10">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-orange-400">China</span>
                </div>
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <path d="M 25% 55% Q 50% 60% 75% 40%" fill="none" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="categorias" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Categorías de Competencia</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Encuentra el reto perfecto para tu equipo, desde robótica básica hasta desarrollo de software e investigación.
            </p>
            <a
              href="/reglamentos/guia-oficial-participacion.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-border text-white px-6 py-3 rounded-full font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              Ver guía oficial de participación
            </a>
          </div>

          <Tabs defaultValue="robomatrix" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-surface/50 border border-border p-1 rounded-2xl h-auto">
                <TabsTrigger value="robomatrix" className="rounded-xl px-8 py-3 text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-3">
                  Robomatrix
                  <ImageWithFallback src={robomatrixLogo} alt="Robomatrix" className="h-8 object-contain rounded-md bg-white p-1" />
                </TabsTrigger>
                <TabsTrigger value="infomatrix" className="rounded-xl px-8 py-3 text-lg font-bold data-[state=active]:bg-accent data-[state=active]:text-white flex items-center gap-3">
                  Infomatrix
                  <ImageWithFallback src={infomatrixLogoWhite} alt="Infomatrix" className="h-8 object-contain rounded-md" />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="robomatrix" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[
                  {
                    name: "Seguidor de Línea",
                    desc: "Robot autónomo que sigue una pista en el menor tiempo posible.",
                    level: "Secundaria",
                    img: seguidorLinea2025,
                    rules: "seguidor-de-linea.pdf"
                  },
                  {
                    name: "Sumo LEGO",
                    desc: "Robot diseñado para empujar a sus oponentes fuera del área de combate.",
                    level: "Secundaria",
                    img: sumoLego2025,
                    rules: "sumo-lego.pdf"
                  },
                  {
                    name: "Laberinto",
                    desc: "Robot autónomo capaz de resolver un recorrido complejo mediante sensores.",
                    level: "Secundaria",
                    img: laberinto2025,
                    rules: "laberinto.pdf"
                  },
                  {
                    name: "Electrotec",
                    desc: "Basada en el uso de robots DIYGO IA para resolver retos tecnológicos.",
                    level: "Secundaria",
                    img: electrotec2025,
                    rules: "electrotec.pdf"
                  },
                  {
                    name: "Reto de Robótica",
                    desc: "Los equipos resuelven un desafío sorpresa de robótica el mismo día del evento.",
                    level: "Primaria",
                    img: retoRobotica2025,
                    rules: "reto-de-robotica.pdf"
                  }
                ].map((cat, i) => (
                  <div key={i} className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col group">
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={cat.img} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full border border-border">
                        {cat.level}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-2">{cat.name}</h3>
                      <p className="text-text-muted text-sm mb-6 flex-1">{cat.desc}</p>
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/registro"
                          className="w-full bg-primary hover:bg-primary-hover text-white text-center py-2.5 rounded-lg font-medium transition-colors text-sm"
                        >
                          Inscribirme
                        </Link>
                        <a href={`/reglamentos/${cat.rules}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-background hover:bg-border border border-border text-white text-center py-2.5 rounded-lg font-medium transition-colors text-sm">
                          <Download className="w-4 h-4" />
                          Reglamento PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="infomatrix" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    name: "Tecnogame y Desarrollo de Software",
                    desc: "Diseño y desarrollo de videojuegos y soluciones de software innovadoras.",
                    level: "Primaria-Universidad",
                    img: tecnogameDesarrollo2025,
                    rules: "tecnogame-y-desarrollo.pdf"
                  },
                  {
                    name: "Divulgación Científica",
                    desc: "Presentación de investigaciones, prototipos e ideas científicas.",
                    level: "Primaria-Universidad",
                    img: divulgacionCientifica2025,
                    rules: "divulgacion-cientifica.pdf"
                  },
                  {
                    name: "Multimedia",
                    desc: "Creación de contenido digital, animación y producciones audiovisuales.",
                    level: "Primaria - Universidad",
                    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
                    rules: "multimedia.pdf"
                  }
                ].map((cat, i) => (
                  <div key={i} className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={cat.img} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full border border-border">
                        {cat.level}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                      <p className="text-text-muted text-sm mb-6 flex-1">{cat.desc}</p>
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/registro"
                          className="w-full bg-accent hover:bg-accent/80 text-white text-center py-2.5 rounded-lg font-medium transition-colors text-sm"
                        >
                          Inscribirme
                        </Link>
                        <a href={`/reglamentos/${cat.rules}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-background hover:bg-border border border-border text-white text-center py-2.5 rounded-lg font-medium transition-colors text-sm">
                          <Download className="w-4 h-4" />
                          Reglamento PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* GALERÍA / MASONRY */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Vive la Experiencia</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Momentos inolvidables de nuestras ediciones anteriores.
            </p>
          </div>
          
          <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
            <Masonry gutter="16px">
              {[
                roboticaNino,
                roboticaNinaProgramacion,
                roboticaConcentracion,
                roboticaNinoCarro,
                competenciaRobotica,
                robotOmni,
              ].map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden group">
                  <img 
                    src={img} 
                    alt={`Galería ${i}`} 
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </section>

      {/* CRONOGRAMA */}
      <section id="cronograma" className="py-24 bg-background relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Cronograma 2026</h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {[
              { date: "13 Julio", title: "Apertura de inscripciones", desc: "Inicio de registro para todos los equipos a nivel nacional." },
              { date: "01 de Setiembre", title: "Cierre de inscripciones", desc: "Último día para registrar equipos y proyectos." },
              { date: "18 de Setiembre", title: "Entrega de Documentos", desc: "Cada categoría tiene un entregable, revisar contra reglamento." },
              { date: "10 Octubre", title: "Competencia Nacional", desc: "El gran evento presencial en Cedes Don Bosco." },
            ].map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-cyan shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Calendar className="w-4 h-4 text-background" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface p-6 rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-lg">{item.title}</h4>
                  </div>
                  <div className="text-cyan text-sm font-bold mb-2">{item.date}</div>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section id="faq" className="py-24 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h2>
            <p className="text-text-muted text-lg">
              Todo lo que necesitas saber antes de inscribirte al torneo.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-background border border-border rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">¿Cuál es el medio de pago?</AccordionTrigger>
              <AccordionContent className="text-text-muted text-base pb-6">
                Los medios de pago se encuentran disponibles en las reglas generales del evento.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-background border border-border rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">¿De cuántos estudiantes es el equipo?</AccordionTrigger>
              <AccordionContent className="text-text-muted text-base pb-6">
                Hay categorías de máximo 2 estudiantes, como otras de 3. Por favor leer las reglas de cada categoría.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background border border-border rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">¿Qué pasa si no tengo experiencia previa?</AccordionTrigger>
              <AccordionContent className="text-text-muted text-base pb-6">
                ¡No hay problema! El torneo está diseñado tanto para principiantes como para expertos. Contamos con categorías para diferentes niveles y durante el proceso se estarán brindando recursos de apoyo.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-background border border-border rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">¿Dónde será el evento presencial?</AccordionTrigger>
              <AccordionContent className="text-text-muted text-base pb-6">
                La gran final y competencia nacional se llevará a cabo en las instalaciones de Cedes Don Bosco el próximo 10 de Octubre.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ORGANIZADORES Y PATROCINADORES */}
      <section className="py-20 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Respaldado por</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center">
            {/* Organizadores - Luvá & Solacyt */}
            <div className="flex flex-col items-center gap-6 w-full">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Organizadores</span>
              <div className="flex items-center gap-8">
                <ImageWithFallback src={luvaLogoColor} alt="Luvá Organizador" className="h-20 md:h-24 w-auto object-contain hover:scale-105 transition-transform duration-300" />
                <ImageWithFallback src={solacytLogo} alt="Solacyt Organizador" className="h-10 md:h-14 w-auto object-contain hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Patrocinador Oficial - Akamai (Centro) */}
            <div className="flex flex-col items-center gap-6 w-full">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Patrocinador Oficial</span>
              <ImageWithFallback src={akamaiNewLogo} alt="Akamai" className="h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </div>

            {/* Sede y Aliado - Cedes */}
            <div className="flex flex-col items-center gap-6 w-full">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sede y Aliado</span>
              <ImageWithFallback src={cedesLogo} alt="Cedes Don Bosco" className="h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1742767069929-0c663150b164?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            El próximo equipo acreditado podría ser el tuyo.
          </h2>
          <p className="text-xl text-text-muted mb-10">
            No dejés pasar la oportunidad de demostrar tu talento. Los cupos son limitados.
          </p>
          <Link
            to="/registro"
            className="inline-flex bg-white text-primary hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-3 transition-transform hover:scale-105 shadow-2xl"
          >
            INSCRIBIR EQUIPO AHORA
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
