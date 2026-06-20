export const candidatoExamenMock = {
  id_candidato: "GT-USAC-2026-001",
  nombre: "María López Martínez",
  universidad: "USAC",
  carrera: "Ingeniería en Sistemas",
  certificacion: "Competencias Digitales Avanzadas",
  bloque: "Bloque 2"
};

export const bancoPreguntasMock = [
  {
    id: 1,
    nivel: "Medio",
    pregunta: "¿Cuál estrategia es más adecuada para gestionar consistencia eventual en microservicios distribuidos?",
    opciones: [
      { clave: "A", texto: "Patrón Saga con compensación transaccional distribuida" },
      { clave: "B", texto: "Transacciones ACID distribuidas mediante Two-Phase Commit" },
      { clave: "C", texto: "Sincronización síncrona entre todos los servicios en cada operación" },
      { clave: "D", texto: "Replicación de base de datos centralizada en tiempo real" }
    ],
    correcta: "A"
  },
  {
    id: 2,
    nivel: "Avanzado",
    pregunta: "¿Qué técnica permite desacoplar la auditoría inmutable del flujo principal de evaluación?",
    opciones: [
      { clave: "A", texto: "Bloqueo pesimista de todas las transacciones" },
      { clave: "B", texto: "Publicación de eventos asincrónicos hacia un bus de mensajes" },
      { clave: "C", texto: "Ejecución monolítica con base de datos compartida" },
      { clave: "D", texto: "Validación manual posterior a cada respuesta" }
    ],
    correcta: "B"
  },
  {
    id: 3,
    nivel: "Básico",
    pregunta: "¿Cuál es el objetivo principal de un examen adaptativo?",
    opciones: [
      { clave: "A", texto: "Mostrar siempre preguntas del mismo nivel" },
      { clave: "B", texto: "Ajustar la dificultad según el desempeño del candidato" },
      { clave: "C", texto: "Evitar el registro de respuestas" },
      { clave: "D", texto: "Eliminar la ponderación final" }
    ],
    correcta: "B"
  },
  {
    id: 4,
    nivel: "Avanzado",
    pregunta: "¿Qué atributo de calidad se relaciona directamente con calcular la siguiente pregunta en menos de 2 segundos?",
    opciones: [
      { clave: "A", texto: "Auditabilidad" },
      { clave: "B", texto: "Interoperabilidad" },
      { clave: "C", texto: "Rendimiento" },
      { clave: "D", texto: "Portabilidad" }
    ],
    correcta: "C"
  },
  {
    id: 5,
    nivel: "Básico",
    pregunta: "¿Qué dato debe almacenarse en el historial de una respuesta?",
    opciones: [
      { clave: "A", texto: "Pregunta, respuesta, nivel y resultado de evaluación" },
      { clave: "B", texto: "Únicamente el nombre del candidato" },
      { clave: "C", texto: "Solamente el tiempo del navegador" },
      { clave: "D", texto: "El color de la interfaz" }
    ],
    correcta: "A"
  }
];

export const trazabilidadExamen = [
  {
    codigo: "RF-02",
    titulo: "Evaluación adaptativa",
    descripcion: "Ajuste de dificultad en tiempo real según la respuesta inmediata anterior."
  },
  {
    codigo: "EaC-05",
    titulo: "Rendimiento",
    descripcion: "El motor debe calcular y presentar la siguiente pregunta sin degradar la sesión."
  },
  {
    codigo: "RF-12",
    titulo: "Período de certificación",
    descripcion: "El examen pertenece a un período operativo habilitado para certificación."
  },
  {
    codigo: "UC-2.4",
    titulo: "Ajustar dificultad",
    descripcion: "Caso de uso encargado de decidir el siguiente nivel de pregunta."
  }
];