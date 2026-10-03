import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

const calificarPruebaCallable = httpsCallable(functions, "calificarPrueba");

// La calificacion y la gamificacion (xp, nivel, ranking, logros) ocurren en la Cloud Function.
// El uid sale de la sesion (request.auth), por eso ya no se recibe usuarioId.
export const calificarPrueba = async (cuestionarioId, respuestasEstudiante, tiempoEmpleado) => {
	const { data } = await calificarPruebaCallable({ cuestionarioId, respuestasEstudiante, tiempoEmpleado });

	// { resultadoId, puntaje, respuestasCorrectas, respuestasIncorrectas, nuevosLogros }
	return data;
};
