import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const UNIVERSITY_COUNTRY = {
  USAC: 'Guatemala',
  UCR: 'Costa Rica',
  UES: 'El Salvador',
}

const SAMPLE_RECORDS = [
  { pais: 'Guatemala', universidad: 'USAC', carrera: 'Ingenieria en Sistemas', genero: 'Femenino', competencia: 'Programacion', evaluaciones: 46, aprobados: 38, certificados: 34, fecha: '2026-06-15' },
  { pais: 'Guatemala', universidad: 'USAC', carrera: 'Ingenieria Industrial', genero: 'Masculino', competencia: 'Datos', evaluaciones: 33, aprobados: 24, certificados: 20, fecha: '2026-06-16' },
  { pais: 'Costa Rica', universidad: 'UCR', carrera: 'Ingenieria en Sistemas', genero: 'Masculino', competencia: 'Ciberseguridad', evaluaciones: 41, aprobados: 31, certificados: 28, fecha: '2026-06-16' },
  { pais: 'Costa Rica', universidad: 'UCR', carrera: 'Administracion', genero: 'Femenino', competencia: 'Ofimatica', evaluaciones: 28, aprobados: 22, certificados: 18, fecha: '2026-06-17' },
  { pais: 'El Salvador', universidad: 'UES', carrera: 'Ingenieria en Sistemas', genero: 'No especificado', competencia: 'Redes', evaluaciones: 37, aprobados: 26, certificados: 24, fecha: '2026-06-17' },
  { pais: 'El Salvador', universidad: 'UES', carrera: 'Mercadeo', genero: 'Femenino', competencia: 'Analitica', evaluaciones: 21, aprobados: 17, certificados: 15, fecha: '2026-06-18' },
  { pais: 'Guatemala', universidad: 'USAC', carrera: 'Administracion', genero: 'Masculino', competencia: 'Ofimatica', evaluaciones: 24, aprobados: 18, certificados: 14, fecha: '2026-06-18' },
  { pais: 'Costa Rica', universidad: 'UCR', carrera: 'Ingenieria Industrial', genero: 'No especificado', competencia: 'Programacion', evaluaciones: 19, aprobados: 14, certificados: 12, fecha: '2026-06-19' },
  { pais: 'El Salvador', universidad: 'UES', carrera: 'Ingenieria en Sistemas', genero: 'Masculino', competencia: 'Ciberseguridad', evaluaciones: 29, aprobados: 19, certificados: 17, fecha: '2026-06-19' },
]

const INITIAL_FILTERS = {
  pais: 'Todos',
  carrera: 'Todas',
  genero: 'Todos',
  desde: '2026-06-15',
  hasta: '2026-06-19',
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;