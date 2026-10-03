const { test } = require("node:test");
const assert = require("node:assert");
const { calificar } = require("../src/calificacion");

const preguntasPorId = {
	p1: { respuestaCorrecta: "A" },
	p2: { respuestaCorrecta: "B" },
	p3: { respuestaCorrecta: "C" },
	p4: { respuestaCorrecta: "D" },
};

test("todas correctas da puntaje 100", () => {
	const respuestas = [
		{ preguntaId: "p1", respuestaSeleccionada: "A" },
		{ preguntaId: "p2", respuestaSeleccionada: "B" },
	];
	const r = calificar(respuestas, preguntasPorId);
	assert.strictEqual(r.puntaje, 100);
	assert.strictEqual(r.respuestasCorrectas, 2);
	assert.strictEqual(r.respuestasIncorrectas, 0);
	assert.ok(r.respuestasCalificadas.every((x) => x.esCorrecta === true));
});

test("todas incorrectas da puntaje 0", () => {
	const respuestas = [
		{ preguntaId: "p1", respuestaSeleccionada: "D" },
		{ preguntaId: "p2", respuestaSeleccionada: "A" },
	];
	const r = calificar(respuestas, preguntasPorId);
	assert.strictEqual(r.puntaje, 0);
	assert.strictEqual(r.respuestasCorrectas, 0);
	assert.strictEqual(r.respuestasIncorrectas, 2);
	assert.ok(r.respuestasCalificadas.every((x) => x.esCorrecta === false));
});

test("respuesta null cuenta como incorrecta", () => {
	const respuestas = [
		{ preguntaId: "p1", respuestaSeleccionada: null },
		{ preguntaId: "p2", respuestaSeleccionada: null },
	];
	const r = calificar(respuestas, preguntasPorId);
	assert.strictEqual(r.puntaje, 0);
	assert.strictEqual(r.respuestasIncorrectas, 2);
	assert.deepStrictEqual(
		r.respuestasCalificadas.map((x) => x.respuestaSeleccionada),
		[null, null],
	);
});

test("mezcla de aciertos redondea el puntaje", () => {
	const respuestas = [
		{ preguntaId: "p1", respuestaSeleccionada: "A" },
		{ preguntaId: "p2", respuestaSeleccionada: "A" },
		{ preguntaId: "p3", respuestaSeleccionada: "C" },
	];
	const r = calificar(respuestas, preguntasPorId);
	assert.strictEqual(r.respuestasCorrectas, 2);
	assert.strictEqual(r.puntaje, 67);
});

test("ignora un esCorrecta falso enviado por el cliente (RF-028)", () => {
	const respuestas = [
		{ preguntaId: "p1", respuestaSeleccionada: "D", esCorrecta: true },
	];
	const r = calificar(respuestas, preguntasPorId);
	assert.strictEqual(r.respuestasCalificadas[0].esCorrecta, false);
	assert.strictEqual(r.puntaje, 0);
});

test("la salida no incluye respuestaCorrecta ni explicacion (RF-029)", () => {
	const conExplicacion = { p1: { respuestaCorrecta: "A", explicacion: "porque si" } };
	const r = calificar(
		[{ preguntaId: "p1", respuestaSeleccionada: "A" }],
		conExplicacion,
	);
	const serializado = JSON.stringify(r);
	assert.ok(!serializado.includes("respuestaCorrecta"));
	assert.ok(!serializado.includes("explicacion"));
});
