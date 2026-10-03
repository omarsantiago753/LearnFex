const { HttpsError } = require("firebase-functions/v2/https");

const MAX_RESPUESTAS = 200;
const MAX_LONGITUD_ID = 128;
const MAX_LONGITUD_RESPUESTA = 16;
const MAX_TIEMPO_SEGUNDOS = 86400;

// IDs de Firestore seguros: solo letras, numeros, guion y guion bajo (sin "/", ".", ".."),
// y que no tengan la forma reservada __algo__ (Firestore la rechaza y ademas cubre "__proto__").
// Los IDs reales (seed_N, snake_case del seed y los automaticos de 20 caracteres) lo cumplen.
const FORMATO_ID = /^[A-Za-z0-9_-]+$/;
const FORMATO_ID_RESERVADO = /^__.*__$/;

const invalido = (mensaje) => new HttpsError("invalid-argument", mensaje);

const esObjeto = (valor) =>
	typeof valor === "object" && valor !== null && !Array.isArray(valor);

const esTextoValido = (valor, maxLongitud) =>
	typeof valor === "string" && valor.length > 0 && valor.length <= maxLongitud;

const esIdValido = (valor) =>
	esTextoValido(valor, MAX_LONGITUD_ID) &&
	FORMATO_ID.test(valor) &&
	!FORMATO_ID_RESERVADO.test(valor);

/**
 * Valida y normaliza el payload de calificarPrueba.
 * Nunca lee uid/usuarioId de `data`: la identidad sale solo de request.auth.uid (RF-026).
 * Lanza HttpsError("invalid-argument") en el primer fallo.
 */
const validarEntrada = (data) => {
	if (!esObjeto(data)) {
		throw invalido("La solicitud debe ser un objeto.");
	}

	const { cuestionarioId, respuestasEstudiante, tiempoEmpleado } = data;

	if (!esIdValido(cuestionarioId)) {
		throw invalido(
			`cuestionarioId debe tener hasta ${MAX_LONGITUD_ID} caracteres y usar solo letras, números, "-" y "_".`,
		);
	}

	if (
		!Array.isArray(respuestasEstudiante) ||
		respuestasEstudiante.length < 1 ||
		respuestasEstudiante.length > MAX_RESPUESTAS
	) {
		throw invalido(
			`respuestasEstudiante debe tener entre 1 y ${MAX_RESPUESTAS} elementos.`,
		);
	}

	const idsVistos = new Set();
	const respuestasNormalizadas = respuestasEstudiante.map((respuesta) => {
		if (!esObjeto(respuesta)) {
			throw invalido("Cada respuesta debe ser un objeto.");
		}

		const { preguntaId, respuestaSeleccionada } = respuesta;

		if (!esIdValido(preguntaId)) {
			throw invalido(
				`preguntaId debe tener hasta ${MAX_LONGITUD_ID} caracteres y usar solo letras, números, "-" y "_".`,
			);
		}

		if (
			respuestaSeleccionada !== null &&
			(typeof respuestaSeleccionada !== "string" ||
				respuestaSeleccionada.length > MAX_LONGITUD_RESPUESTA)
		) {
			throw invalido(
				`respuestaSeleccionada debe ser null o un texto de hasta ${MAX_LONGITUD_RESPUESTA} caracteres.`,
			);
		}

		if (idsVistos.has(preguntaId)) {
			throw invalido("No se puede repetir la misma pregunta en una prueba.");
		}
		idsVistos.add(preguntaId);

		return { preguntaId, respuestaSeleccionada };
	});

	if (
		typeof tiempoEmpleado !== "number" ||
		!Number.isFinite(tiempoEmpleado) ||
		tiempoEmpleado < 0 ||
		tiempoEmpleado > MAX_TIEMPO_SEGUNDOS
	) {
		throw invalido(
			`tiempoEmpleado debe ser un número entre 0 y ${MAX_TIEMPO_SEGUNDOS}.`,
		);
	}

	return {
		cuestionarioId,
		respuestasEstudiante: respuestasNormalizadas,
		tiempoEmpleado: Math.round(tiempoEmpleado),
	};
};

module.exports = { validarEntrada, MAX_RESPUESTAS };
