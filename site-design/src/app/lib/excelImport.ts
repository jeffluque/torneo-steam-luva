import * as XLSX from "xlsx";
import { addTeams, getSession, Team } from "./demoStore";

const clean=(v:unknown)=>String(v??"").trim();
const normalized=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const categoryAliases:Record<string,string>={seguidordelinea:"seguidor",seguidor:"seguidor",sumolego:"sumo",sumo:"sumo",laberinto:"laberinto",electrotec:"electrotec",robotec:"reto-robotica",retorobotica:"reto-robotica",tecnokids:"tecnokids",tecnogameydesarrollo:"tecnogame",tecnogameydesarrollodesoftware:"tecnogame",desarrollodesoftware:"tecnogame",tecnogame:"tecnogame",multimedia:"multimedia",animaciondigital:"multimedia",animacionycortometraje:"multimedia",divulgacioncientifica:"divulgacion",divulgacion:"divulgacion",robotica:"robotica-proyectos",roboticaproyectos:"robotica-proyectos",roboticaexposiciondeproyectosroboticosconprototipo:"robotica-proyectos"};
const pick=(row:Record<string,unknown>,...names:string[])=>{const map=Object.fromEntries(Object.entries(row).map(([k,v])=>[normalized(k),v]));for(const name of names){const value=map[normalized(name)];if(value!==undefined&&clean(value))return clean(value)}return""};
const parseCombinedStudents=(value:string)=>value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).map(line=>{const parts=line.replace(/^\s*\d+\.\s*/,"").split("|").map(part=>part.trim());return{name:parts[0]||"",age:Number((parts[1]||"").replace(/\D/g,"")),email:parts[2]||"",gender:parts[3]||""}}).filter(student=>student.name);

export type ImportReport={added:number;duplicates:number;errors:string[]};
const MAX_FILE_SIZE=10*1024*1024;
async function syncInBackground(endpoint:string,teams:Team[]){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{const body=new URLSearchParams({payload:JSON.stringify({action:"importTeams",token:getSession()?.token,teams})});await fetch(endpoint,{method:"POST",body,signal:controller.signal})}catch{localStorage.setItem("luva-pending-team-sync",JSON.stringify(teams))}finally{clearTimeout(timer)}}
export async function importTeamsFile(file:File):Promise<ImportReport>{
 if(file.size>MAX_FILE_SIZE)throw new Error("El archivo supera el máximo de 10 MB.");
 await new Promise(resolve=>setTimeout(resolve,30));
 const data=await file.arrayBuffer(),book=XLSX.read(data,{dense:true,sheetRows:5001,cellStyles:false,cellHTML:false}),sheet=book.Sheets[book.SheetNames[0]];
 if(!sheet)throw new Error("El archivo no contiene hojas.");
 const rows=XLSX.utils.sheet_to_json<Record<string,unknown>>(sheet,{defval:"",raw:false});
 if(rows.length>5000)throw new Error("El archivo supera el máximo de 5000 equipos por importación.");
 const valid:Team[]=[],errors:string[]=[];
 rows.forEach((row,index)=>{const line=index+2,name=pick(row,"Nombre de equipo","Equipo","Proyecto/Equipo"),categoryRaw=pick(row,"Categoría","Categoria"),category=categoryAliases[normalized(categoryRaw)],institution=pick(row,"Nombre de la institución","Nombre de la institucion","Institución","Institucion");
  const combined=pick(row,"Estudiantes");
  const students=combined?parseCombinedStudents(combined):[1,2,3].map(n=>({name:pick(row,`Nombre completo del participante ${n}`,`Participante ${n} nombre`,n===1?"Nombre completo del participante":""),age:Number(pick(row,`Edad ${n}`,`Participante ${n} edad`,n===1?"Edad":"")||0),gender:pick(row,`Género ${n}`,`Genero ${n}`,`Participante ${n} género`,n===1?"Género":""),email:pick(row,`Correo ${n}`,`Participante ${n} correo`,n===1?"Correo":"")})).filter(s=>s.name);
  if(!name||!category||!institution||students.length<1){errors.push(`Fila ${line}: requiere equipo, categoría válida, institución y al menos un participante.`);return}
  if(students.some(s=>!s.age||!s.gender||!s.email)){errors.push(`Fila ${line}: cada participante necesita edad, género y correo.`);return}
  valid.push({id:`XL-${Date.now()}-${index+1}`,name,category,level:pick(row,"Nivel escolar","Nivel"),institution,province:pick(row,"Provincia"),district:pick(row,"Distrito"),director:pick(row,"Nombre del director","Director(a)"),institutionEmail:pick(row,"Correo de la institución","Correo de la institucion","Correo institución"),advisor:pick(row,"Nombre del asesor","Asesor(a)"),advisorRole:pick(row,"Rol del asesor","Rol"),advisorGender:pick(row,"Género del asesor","Genero del asesor","Género asesor(a)"),advisorPhone:pick(row,"Teléfono del asesor","Telefono del asesor","Teléfono"),advisorEmail:pick(row,"Correo del asesor","Correo asesor(a)"),students,source:"excel",createdAt:new Date().toISOString()});
 });
 const result=addTeams(valid);
 const endpoint=import.meta.env.VITE_REGISTRATION_ENDPOINT;
 if(endpoint&&valid.length)void syncInBackground(endpoint,valid);
 return{...result,errors};
}

export function downloadTeamsTemplate(){const headers=["Nombre de equipo","Categoría","Nivel escolar","Nombre de la institución","Provincia","Distrito","Nombre del director","Correo de la institución","Nombre del asesor","Rol del asesor","Género del asesor","Teléfono del asesor","Correo del asesor","Nombre completo del participante 1","Edad 1","Género 1","Correo 1","Nombre completo del participante 2","Edad 2","Género 2","Correo 2","Nombre completo del participante 3","Edad 3","Género 3","Correo 3"];const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([headers]),"Equipos");XLSX.writeFile(book,"Plantilla-equipos-STEAM-LUVA.xlsx")}
