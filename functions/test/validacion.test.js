const { test } = require("node:test");
const assert = require("node:assert");
const { validarEntrada } = require("../src/validacion");

const entradaValida = () => ({
	cuestionarioId: "cuest-1",
	respuestasEstudiante: [
		{ preguntaId: "p1", respuestaSeleccionada: "A" },
		{ preguntaId: "p2", respuestaSeleccionada: null },
	],
	tiempoEmpleado: 120.6,
});

const esInvalidArgument = (e) => e.code === "invalid-argument";

test("acepta una entrada válida y redondea tiempoEmpleado", () => {
	const resultado = validarEntrada(entradaValida());
	assert.strictEqual(resultado.cuestionarioId, "cuest-1");
	assert.strictEqual(resultado.respuestasEstudiante.length, 2);
	assert.strictEqual(resultado.tiempoEmpleado, 121);
});

test("ignora campos extra como usuarioId (RF-026)", () => {
	const resultado = validarEntrada({ ...entradaValida(), usuarioId: "otro" });
	assert.strictEqual(resultado.usuarioId, undefined);
});

test("rechaza data que no es un objeto", () => {
	assert.throws(() => validarEntrada(null), esInvalidArgument);
	assert.throws(() => validarEntrada("texto"), esInvalidArgument);
});

test("rechaza cuestionarioId vacío o muy largo", () => {
	assert.throws(
		() => validarEntrada({ ...entradaValida(), cuestionarioId: "" }),
		esInvalidArgument,
	);
	assert.throws(
		() => validarEntrada({ ...entradaValida(), cuestionarioId: "x".repeat(129) }),
		esInvalidArgument,
	);
});

test("rechaza un arreglo de respuestas vacío", () => {
	assert.throws(
		() => validarEntrada({ ...entradaValida(), respuestasEstudiante: [] }),
		esInvalidArgument,
	);
});

test("rechaza más de 200 respuestas", () => {
	const demasiadas = Array.from({ length: 201 }, (_, i) => ({
		preguntaId: `p${i}`,
		respuestaSeleccionada: "A",
	}));
	assert.throws(
		() => validarEntrada({ ...entradaValida(), respuestasEstudiante: demasiadas }),
		esInvalidArgument,
	);
});

test("rechaza preguntaId repetido", () => {
	const repetidas = [
		{ preguntaId: "p1", respuestaSeleccionada: "A" },
		{ preguntaId: "p1", respuestaSeleccionada: "B" },
	];
	assert.throws(
		() => validarEntrada({ ...entradaValida(), respuestasEstudiante: repetidas }),
		esInvalidArgument,
	);
});

test("rechaza respuestaSeleccionada que no es null ni texto corto", () => {
	assert.throws(
		() =>
			validarEntrada({
				...entradaValida(),
				respuestasEstudiante: [{ preguntaId: "p1", respuestaSeleccionada: 3 }],
			}),
		esInvalidArgument,
	);
	assert.throws(
		() =>
			validarEntrada({
				...entradaValida(),
				respuestasEstudiante: [
					{ preguntaId: "p1", respuestaSeleccionada: "x".repeat(17) },
				],
			}),
		esInvalidArgument,
	);
});

test("rechaza tiempoEmpleado inválido", () => {
	for (const tiempoEmpleado of [-1, 86401, NaN, Infinity, "10", undefined]) {
		assert.throws(
			() => validarEntrada({ ...entradaValida(), tiempoEmpleado }),
			esInvalidArgument,
			`debería rechazar ${String(tiempoEmpleado)}`,
		);
	}
});
