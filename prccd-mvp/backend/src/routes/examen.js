export default async function examenRoutes(fastify) {

  // Iniciar examen: crea sesión y devuelve primera pregunta (siempre Medio)
  fastify.post('/examen/iniciar', async (req, reply) => {
    const { id_candidato } = req.body;
    const pregunta = await getPregunta(fastify.pg, 'Medio', []);

    // Guardar sesión en tabla sesiones_examen
    const { rows } = await fastify.pg.query(
      `INSERT INTO sesiones_examen (id_candidato, nivel_actual, preguntas_ids, historial, numero_pregunta)
       VALUES ($1, 'Medio', ARRAY[$2], '[]'::jsonb, 1)
       RETURNING id`,
      [id_candidato, pregunta.id]
    );

    return { sesion_id: rows[0].id, pregunta, numero: 1, total: 10 };
  });

  // Responder pregunta y obtener la siguiente
  fastify.post('/examen/responder', async (req, reply) => {
    const { sesion_id, pregunta_id, respuesta } = req.body;

    // Cargar sesión
    const { rows: [sesion] } = await fastify.pg.query(
      'SELECT * FROM sesiones_examen WHERE id = $1', [sesion_id]
    );

    const { rows: [preguntaActual] } = await fastify.pg.query(
      'SELECT * FROM preguntas WHERE id = $1', [pregunta_id]
    );

    const correcto = evaluarRespuesta(preguntaActual, respuesta);

    // Actualizar historial
    const historial = [...sesion.historial, {
      pregunta_id, nivel: sesion.nivel_actual, correcto, respuesta
    }];

    if (sesion.numero_pregunta >= TOTAL_PREGUNTAS) {
      // Examen terminado
      const dictamen = calcularDictamen(historial);
      await fastify.pg.query(
        `UPDATE sesiones_examen SET historial=$1, completado=true, dictamen=$2 WHERE id=$3`,
        [JSON.stringify(historial), dictamen.dictamen, sesion_id]
      );
      return { terminado: true, dictamen };
    }

    // Calcular siguiente nivel y pregunta
    const nivelSiguiente = siguienteNivel(sesion.nivel_actual, correcto);
    const siguientePregunta = await getPregunta(fastify.pg, nivelSiguiente, sesion.preguntas_ids);

    await fastify.pg.query(
      `UPDATE sesiones_examen
       SET nivel_actual=$1, preguntas_ids=array_append(preguntas_ids,$2),
           historial=$3, numero_pregunta=numero_pregunta+1
       WHERE id=$4`,
      [nivelSiguiente, siguientePregunta.id, JSON.stringify(historial), sesion_id]
    );

    return {
      terminado: false,
      correcto,
      pregunta: siguientePregunta,
      numero: sesion.numero_pregunta + 1,
      total: TOTAL_PREGUNTAS
    };
  });
}