const { FieldValue } = require("firebase-admin/firestore");

const XP_POR_CORRECTA = 10;
// D5: se mantiene el tope vigente de 100 XP por prueba, ahora como constante del servidor.
const XP_MAXIMO_POR_PRUEBA = 100;
const XP_POR_NIVEL = 1000;

// Copiado tal cual de src/repositories/logroRepository.js (criterios por conteo de resultados).
const CRITERIOS_LOGROS = {
	primer_quiz: (totalResultados) => totalResultados >= 1,
	cinco_simulacros: (totalResultados) => totalResultados >= 5,
	diez_simulacros: (totalResultados) => totalResultados >= 10,
};

/**
 * Fase B de calificarPrueba: XP, nivel, ranking y logros en UNA transaccion de Firestore.
 * Se llama despues de guardar el resultado (fase A), por lo que el conteo de resultados
 * ya incluye la prueba actual. Si falla, el handler lo captura sin revertir el resultado.
 *
 * @returns {Promise<string[]>} IDs de los logros otorgados en esta llamada.
 */
const aplicarGamificacion = async (db, uid, { respuestasCorrectas }) => {
	// Lecturas fuera de la transaccion: catalogo y conteo no necesitan aislamiento.
	const catalogoSnap = await db.collection("logros").get();
	const catalogo = catalogoSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

	const conteoSnap = await db
		.collection("resultados")
		.where("usuarioId", "==", uid)
		.count()
		.get();
	const totalResultados = conteoSnap.data().count;

	return db.runTransaction(async (tx) => {
		const usuarioRef = db.collection("usuarios").doc(uid);
		const obtenidosRefs = catalogo.map((logro) =>
			usuarioRef.collection("logrosObtenidos").doc(logro.id),
		);

		// Todas las lecturas antes de cualquier escritura (regla de las transacciones).
		const usuarioSnap = await tx.get(usuarioRef);
		if (!usuarioSnap.exists) {
			throw new Error("El usuario no existe.");
		}
		const obtenidosSnaps = obtenidosRefs.length
			? await tx.getAll(...obtenidosRefs)
			: [];

		const perfil = usuarioSnap.data();
		const xpActual = perfil.xp ?? 0;
		const nivelActual = perfil.nivel ?? 1;

		const xpGanado = Math.min(
			respuestasCorrectas * XP_POR_CORRECTA,
			XP_MAXIMO_POR_PRUEBA,
		);
		const nuevoXp = xpActual + xpGanado;
		const nuevoNivel = Math.max(
			Math.floor(nuevoXp / XP_POR_NIVEL) + 1,
			nivelActual,
		);

		tx.update(usuarioRef, { xp: nuevoXp, nivel: nuevoNivel });

		// Se denormaliza el perfil en ranking porque Ranking.jsx no puede leer el perfil de
		// otros estudiantes (mismos campos que escribia rankingRepository.actualizarPosicion).
		tx.set(
			db.collection("ranking").doc(uid),
			{
				usuarioId: uid,
				puntajeAcumulado: nuevoXp,
				nombre: perfil.nombre ?? "",
				apellido: perfil.apellido ?? "",
				nivel: nuevoNivel,
				fechaActualizacion: FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);

		const nuevosLogros = [];
		catalogo.forEach((logro, i) => {
			if (obtenidosSnaps[i].exists) {
				return;
			}
			const cumpleCriterio = CRITERIOS_LOGROS[logro.criterio];
			if (cumpleCriterio && cumpleCriterio(totalResultados)) {
				tx.set(obtenidosRefs[i], {
					fechaObtenido: FieldValue.serverTimestamp(),
				});
				nuevosLogros.push(logro.id);
			}
		});

		return nuevosLogros;
	});
};

module.exports = {
	aplicarGamificacion,
	CRITERIOS_LOGROS,
	XP_POR_CORRECTA,
	XP_MAXIMO_POR_PRUEBA,
};
