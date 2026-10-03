/**
 * Calificación pura: sin Firestore ni red.
 * Se asume que todas las preguntas de `respuestasEstudiante` existen en `preguntasPorId`
 * (el handler rechaza antes los preguntaId inexistentes).
 *
 * @param {Array<{preguntaId: string, respuestaSeleccionada: string|null}>} respuestasEstudiante
 * @param {Object<string, {respuestaCorrecta: string}>} preguntasPorId
 */
const calificar = (respuestasEstudiante, preguntasPorId) => {
	let respuestasCorrectas = 0;
	let respuestasIncorrectas = 0;

	const respuestasCalificadas = respuestasEstudiante.map(
		({ preguntaId, respuestaSeleccionada }) => {
			const pregunta = preguntasPorId[preguntaId];
			const esCorrecta =
				respuestaSeleccionada !== null &&
				respuestaSeleccionada === pregunta.respuestaCorrecta;

			if (esCorrecta) {
				respuestasCorrectas += 1;
			} else {
				respuestasIncorrectas += 1;
			}

			return { preguntaId, respuestaSeleccionada, esCorrecta };
		},
	);

	const total = respuestasEstudiante.length;
	const puntaje =
		total > 0 ? Math.round((respuestasCorrectas / total) * 100) : 0;

	return {
		respuestasCalificadas,
		respuestasCorrectas,
		respuestasIncorrectas,
		puntaje,
	};
};

module.exports = { calificar };
