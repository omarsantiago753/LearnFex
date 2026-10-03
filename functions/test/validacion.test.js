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

const IDS_INVALIDOS = [
	"a/b",
	"__proto__",
	"__x__",
	".",
	"..",
	"",
	"con espacio",
	"x".repeat(129),
];

test("rechaza cuestionarioId con formato inválido", () => {
	for (const cuestionarioId of IDS_INVALIDOS) {
		assert.throws(
			() => validarEntrada({ ...entradaValida(), cuestionarioId }),
			esInvalidArgument,
			`debería rechazar cuestionarioId ${JSON.stringify(cuestionarioId)}`,
		);
	}
});

test("rechaza preguntaId con formato inválido", () => {
	for (const preguntaId of IDS_INVALIDOS) {
		assert.throws(
			() =>
				validarEntrada({
					...entradaValida(),
					respuestasEstudiante: [{ preguntaId, respuestaSeleccionada: "A" }],
				}),
			esInvalidArgument,
			`debería rechazar preguntaId ${JSON.stringify(preguntaId)}`,
		);
	}
});

test("acepta los formatos de ID reales (seed, snake_case y automáticos de Firestore)", () => {
	for (const id of ["seed_1", "lectura_critica", "Zx9fK2LmQp0aBcD3eFgH", "a-b_C9"]) {
		const r = validarEntrada({
			cuestionarioId: id,
			respuestasEstudiante: [{ preguntaId: id, respuestaSeleccionada: "A" }],
			tiempoEmpleado: 1,
		});
		assert.strictEqual(r.cuestionarioId, id);
	}
});

test("respuestaSeleccionada vacía se acepta (cuenta como incorrecta) y las claves extra se descartan", () => {
	const r = validarEntrada({
		...entradaValida(),
		respuestasEstudiante: [
			{ preguntaId: "p1", respuestaSeleccionada: "", esCorrecta: true, extra: 1 },
		],
	});
	assert.deepStrictEqual(r.respuestasEstudiante, [
		{ preguntaId: "p1", respuestaSeleccionada: "" },
	]);
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
