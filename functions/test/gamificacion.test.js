const { test } = require("node:test");
const assert = require("node:assert");
const {
	aplicarGamificacion,
	XP_MAXIMO_POR_PRUEBA,
} = require("../src/gamificacion");

/**
 * Stub minimo de Firestore Admin, hecho a mano (sin dependencias):
 * soporta solo lo que usa aplicarGamificacion y registra las escrituras de la transaccion.
 */
const crearDb = ({ usuario, logros = [], obtenidos = [], totalResultados = 1 }) => {
	const escrituras = [];
	const ref = (path) => ({
		path,
		collection: (nombre) => ({ doc: (id) => ref(`${path}/${nombre}/${id}`) }),
	});
	const existentes = {
		"usuarios/u1": usuario,
		...Object.fromEntries(
			obtenidos.map((id) => [`usuarios/u1/logrosObtenidos/${id}`, {}]),
		),
	};
	const snap = (r) => ({
		exists: r.path in existentes && existentes[r.path] !== undefined,
		data: () => existentes[r.path],
	});

	const db = {
		escrituras,
		collection: (nombre) => ({
			doc: (id) => ref(`${nombre}/${id}`),
			get: async () => ({
				docs: logros.map((l) => ({
					id: l.id,
					data: () => ({ criterio: l.criterio }),
				})),
			}),
			where: () => ({
				count: () => ({
					get: async () => ({ data: () => ({ count: totalResultados }) }),
				}),
			}),
		}),
		runTransaction: async (cb) =>
			cb({
				get: async (r) => snap(r),
				getAll: async (...refs) => refs.map(snap),
				update: (r, datos) => escrituras.push({ tipo: "update", path: r.path, datos }),
				set: (r, datos, opciones) =>
					escrituras.push({ tipo: "set", path: r.path, datos, opciones }),
			}),
	};
	return db;
};

const escrituraEn = (db, path) => db.escrituras.find((e) => e.path === path);

test("el XP ganado se limita a XP_MAXIMO_POR_PRUEBA (D5)", async () => {
	const db = crearDb({ usuario: { xp: 0, nivel: 1 } });
	await aplicarGamificacion(db, "u1", { respuestasCorrectas: 15 });
	assert.strictEqual(XP_MAXIMO_POR_PRUEBA, 100);
	assert.strictEqual(escrituraEn(db, "usuarios/u1").datos.xp, 100);
});

test("10 puntos de XP por respuesta correcta por debajo del tope", async () => {
	const db = crearDb({ usuario: { xp: 20, nivel: 1 } });
	await aplicarGamificacion(db, "u1", { respuestasCorrectas: 3 });
	assert.strictEqual(escrituraEn(db, "usuarios/u1").datos.xp, 50);
});

test("el nivel sube con el XP (1000 XP por nivel)", async () => {
	const db = crearDb({ usuario: { xp: 950, nivel: 1 } });
	await aplicarGamificacion(db, "u1", { respuestasCorrectas: 10 });
	const usuario = escrituraEn(db, "usuarios/u1").datos;
	assert.strictEqual(usuario.xp, 1050);
	assert.strictEqual(usuario.nivel, 2);
});

test("el nivel nunca baja aunque el XP calculado sugiera uno menor", async () => {
	const db = crearDb({ usuario: { xp: 10, nivel: 5 } });
	await aplicarGamificacion(db, "u1", { respuestasCorrectas: 1 });
	assert.strictEqual(escrituraEn(db, "usuarios/u1").datos.nivel, 5);
});

test("el ranking replica XP, nombre, apellido y nivel del perfil", async () => {
	const db = crearDb({
		usuario: { xp: 0, nivel: 1, nombre: "Ana", apellido: "Gomez" },
	});
	await aplicarGamificacion(db, "u1", { respuestasCorrectas: 4 });
	const ranking = escrituraEn(db, "ranking/u1");
	assert.strictEqual(ranking.datos.puntajeAcumulado, 40);
	assert.strictEqual(ranking.datos.nombre, "Ana");
	assert.strictEqual(ranking.datos.apellido, "Gomez");
	assert.strictEqual(ranking.datos.nivel, 1);
	assert.deepStrictEqual(ranking.opciones, { merge: true });
});

test("otorga un logro nuevo cuando se cumple el criterio", async () => {
	const db = crearDb({
		usuario: { xp: 0, nivel: 1 },
		logros: [
			{ id: "primer_quiz", criterio: "primer_quiz" },
			{ id: "cinco_simulacros", criterio: "cinco_simulacros" },
		],
		totalResultados: 1,
	});
	const nuevos = await aplicarGamificacion(db, "u1", { respuestasCorrectas: 0 });
	assert.deepStrictEqual(nuevos, ["primer_quiz"]);
	assert.ok(escrituraEn(db, "usuarios/u1/logrosObtenidos/primer_quiz"));
	assert.ok(!escrituraEn(db, "usuarios/u1/logrosObtenidos/cinco_simulacros"));
});

test("no repite un logro ya obtenido", async () => {
	const db = crearDb({
		usuario: { xp: 0, nivel: 1 },
		logros: [{ id: "primer_quiz", criterio: "primer_quiz" }],
		obtenidos: ["primer_quiz"],
		totalResultados: 3,
	});
	const nuevos = await aplicarGamificacion(db, "u1", { respuestasCorrectas: 0 });
	assert.deepStrictEqual(nuevos, []);
	assert.ok(!escrituraEn(db, "usuarios/u1/logrosObtenidos/primer_quiz"));
});

test("ignora criterios heredados del prototipo (Object.hasOwn)", async () => {
	const db = crearDb({
		usuario: { xp: 0, nivel: 1 },
		logros: [
			{ id: "l1", criterio: "constructor" },
			{ id: "l2", criterio: "toString" },
			{ id: "l3", criterio: "__proto__" },
			{ id: "l4", criterio: "no_existe" },
		],
		totalResultados: 99,
	});
	const nuevos = await aplicarGamificacion(db, "u1", { respuestasCorrectas: 0 });
	assert.deepStrictEqual(nuevos, []);
});

test("si el usuario no existe lanza error y no escribe nada", async () => {
	const db = crearDb({ usuario: undefined });
	await assert.rejects(
		() => aplicarGamificacion(db, "u1", { respuestasCorrectas: 5 }),
		/El usuario no existe/,
	);
	assert.strictEqual(db.escrituras.length, 0);
});
