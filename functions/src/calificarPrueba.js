const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { validarEntrada } = require("./validacion");
const { calificar } = require("./calificacion");
const { aplicarGamificacion } = require("./gamificacion");

// Codigo gRPC ALREADY_EXISTS: lo devuelve batch.create() si el documento ya existe.
const GRPC_ALREADY_EXISTS = 6;

exports.calificarPrueba = onCall(async (request) => {
	// 1. Autenticacion: la identidad sale SOLO de request.auth.uid (RF-026).
	if (!request.auth) {
		throw new HttpsError(
			"unauthenticated",
			"Debés iniciar sesión para enviar una prueba.",
		);
	}
	const uid = request.auth.uid;

	// 2. Validacion de la entrada (lanza invalid-argument).
	const { cuestionarioId, respuestasEstudiante, tiempoEmpleado } =
		validarEntrada(request.data);

	const db = getFirestore();

	// 3. El cuestionario existe (no se valida la pertenencia de las preguntas: ver diseno 0.1).
	const cuestionarioSnap = await db
		.collection("cuestionarios")
		.doc(cuestionarioId)
		.get();
	if (!cuestionarioSnap.exists) {
		throw new HttpsError("not-found", "El cuestionario no existe.");
	}

	// 4. Todas las preguntas en un solo viaje (Admin SDK: no pasa por las reglas).
	const refs = respuestasEstudiante.map((r) =>
		db.collection("preguntas").doc(r.preguntaId),
	);
	const snaps = await db.getAll(...refs);
	const faltante = snaps.find((s) => !s.exists);
	if (faltante) {
		throw new HttpsError(
			"not-found",
			"Una de las preguntas enviadas no existe.",
			{ preguntaId: faltante.id },
		);
	}
	const preguntasPorId = Object.fromEntries(
		snaps.map((s) => [s.id, s.data()]),
	);

	// 5. Calificar contra la respuesta correcta leida del servidor (RF-028).
	const {
		respuestasCalificadas,
		respuestasCorrectas,
		respuestasIncorrectas,
		puntaje,
	} = calificar(respuestasEstudiante, preguntasPorId);

	// 6. FASE A: lote atomico obligatorio. ID determinista + create() (D4).
	const resultadoId = `${cuestionarioId}_${uid}`;
	const resultadoRef = db.collection("resultados").doc(resultadoId);
	const batch = db.batch();
	batch.create(resultadoRef, {
		usuarioId: uid,
		cuestionarioId,
		puntaje,
		respuestasCorrectas,
		respuestasIncorrectas,
		tiempoEmpleado,
		fecha: FieldValue.serverTimestamp(),
	});
	respuestasCalificadas.forEach((respuesta) => {
		batch.set(resultadoRef.collection("respuestas").doc(), {
			...respuesta,
			usuarioId: uid,
		});
	});

	try {
		await batch.commit();
	} catch (error) {
		if (error.code === GRPC_ALREADY_EXISTS) {
			throw new HttpsError("already-exists", "Esta prueba ya fue enviada.");
		}
		// Un Error se serializa como {} en el log: se registra el mensaje y el codigo.
		logger.error("Falló la escritura del resultado", {
			uid,
			cuestionarioId,
			error: error.message,
			codigo: error.code,
		});
		throw new HttpsError("internal", "No se pudo guardar el resultado.");
	}

	// 7. FASE B: gamificacion tolerante a fallos (D3). Nunca revierte el resultado guardado.
	let nuevosLogros = [];
	try {
		nuevosLogros = await aplicarGamificacion(db, uid, { respuestasCorrectas });
	} catch (error) {
		logger.error("Falló la gamificación; el resultado quedó guardado", {
			uid,
			resultadoId,
			error: error.message,
		});
	}

	// 8. Respuesta: sin respuestaCorrecta ni explicacion (RF-029).
	return {
		resultadoId,
		puntaje,
		respuestasCorrectas,
		respuestasIncorrectas,
		nuevosLogros,
	};
});
