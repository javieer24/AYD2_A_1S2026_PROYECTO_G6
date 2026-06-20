export const institucionesIngesta = [
  {
    id: "USAC",
    nombre: "Universidad de San Carlos de Guatemala",
    pais: "Guatemala",
    protocolo: "LDAP",
    formato: "CSV",
    adaptador: "usac.adapter",
    estado: "Disponible"
  },
  {
    id: "UCR",
    nombre: "Universidad de Costa Rica",
    pais: "Costa Rica",
    protocolo: "SAML 2.0",
    formato: "JSON",
    adaptador: "ucr.adapter",
    estado: "Disponible"
  },
  {
    id: "UES",
    nombre: "Universidad de El Salvador",
    pais: "El Salvador",
    protocolo: "OAuth2",
    formato: "XML",
    adaptador: "ues.adapter",
    estado: "Disponible"
  }
];

export const expedienteNormalizadoMock = {
  USAC: [
    {
      id_candidato: "GT-USAC-2026-001",
      nombre_completo: "María López Martínez",
      universidad_origen: "USAC",
      carrera: "Ingeniería en Sistemas",
      cursos_aprobados: [
        { codigo: "IPC1", nota: 86 },
        { codigo: "BD1", nota: 91 },
        { codigo: "AYD1", nota: 88 }
      ]
    }
  ],
  UCR: [
    {
      id_candidato: "CR-UCR-2026-014",
      nombre_completo: "Carlos Méndez Rojas",
      universidad_origen: "UCR",
      carrera: "Ciencias de la Computación",
      cursos_aprobados: [
        { codigo: "CI-0112", nota: 88 },
        { codigo: "CI-1320", nota: 82 },
        { codigo: "CI-2414", nota: 90 }
      ]
    }
  ],
  UES: [
    {
      id_candidato: "SV-UES-2026-027",
      nombre_completo: "Andrea Ramírez Castillo",
      universidad_origen: "UES",
      carrera: "Ingeniería Informática",
      cursos_aprobados: [
        { codigo: "INF115", nota: 90 },
        { codigo: "INF221", nota: 84 },
        { codigo: "INF312", nota: 87 }
      ]
    }
  ]
};

export const pipelineIngesta = [
  {
    numero: "01",
    titulo: "Recepción del archivo",
    texto: "El portal recibe el archivo académico sin exigir cambios en los sistemas de origen."
  },
  {
    numero: "02",
    titulo: "Detección de institución",
    texto: "El flujo identifica universidad, protocolo institucional y formato esperado para el adaptador."
  },
  {
    numero: "03",
    titulo: "Transformación",
    texto: "El adaptador convierte CSV, JSON o XML hacia una estructura interna procesable."
  },
  {
    numero: "04",
    titulo: "Normalización",
    texto: "Los campos académicos se homologan al esquema canónico requerido por PRCCD."
  },
  {
    numero: "05",
    titulo: "Validación",
    texto: "Se verifica completitud, formato, identificador regional y cursos aprobados con nota final."
  },
  {
    numero: "06",
    titulo: "Persistencia",
    texto: "El resultado queda preparado para almacenamiento y uso posterior por examen, auditoría y analítica."
  }
];

export const trazabilidadIngesta = [
  {
    codigo: "RF-06",
    titulo: "Importación de datos",
    descripcion: "Compatibilidad con expedientes académicos en CSV, JSON y XML."
  },
  {
    codigo: "RF-07",
    titulo: "Integración universitaria",
    descripcion: "Integración nativa con USAC, UCR y UES sin modificar sus sistemas internos."
  },
  {
    codigo: "EaC-04",
    titulo: "Interoperabilidad",
    descripcion: "Procesamiento de registros heredados sin pérdida de información académica."
  },
  {
    codigo: "R-08",
    titulo: "Sistemas legados",
    descripcion: "Respeto a procesos existentes de las universidades integradas."
  }
];