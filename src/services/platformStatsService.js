import { getAllAreas } from "../repositories/areaRepository";
import { getAllResultados, getAllUsuarios } from "../repositories/platformStatsRepository";
import { getQuizById } from "../repositories/quizRepository";

// Los resultados no guardan areaId (solo cuestionarioId), asi que se resuelve por cuestionario, con cache.
const obtenerAreaIdDelResultado = async (resultado, cacheCuestionarios) => {
	if (cacheCuestionarios.has(resultado.cuestionarioId)) {
		return cacheCuestionarios.get(resultado.cuestionarioId);
	}

	const cuestionario = await getQuizById(resultado.cuestionarioId);
	const areaId = cuestionario ? cuestionario.areaId : null;

	cacheCuestionarios.set(resultado.cuestionarioId, areaId);

	return areaId;
};

const calcularPromedio = (resultados) => {
	if (resultados.length === 0) {
		return 0;
	}

	const suma = resultados.reduce((total, resultado) => total + (resultado.puntaje || 0), 0);

	return Math.round(suma / resultados.length);
};

/**
 * Estadisticas generales de la plataforma para el panel de administracion:
 * total de usuarios registrados, total de pruebas realizadas y el promedio
 * de puntaje general y por area.
 */
export const getPlatformStats = async () => {
	const [usuarios, resultados, areas] = await Promise.all([
		getAllUsuarios(),
		getAllResultados(),
		getAllAreas(),
	]);

	const cacheCuestionarios = new Map();

	const resultadosConArea = await Promise.all(
		resultados.map(async (resultado) => ({
			...resultado,
			areaId: await obtenerAreaIdDelResultado(resultado, cacheCuestionarios),
		}))
	);

	const promedioPorArea = {};

	areas.forEach((area) => {
		const resultadosArea = resultadosConArea.filter((resultado) => resultado.areaId === area.id);

		promedioPorArea[area.nombre] = calcularPromedio(resultadosArea);
	});

	return {
		totalUsuarios: usuarios.length,
		totalPruebas: resultadosConArea.length,
		promedioGeneral: calcularPromedio(resultadosConArea),
		promedioPorArea,
	};
};

/**
 * Actividad reciente de la plataforma para el panel de administracion:
 * los ultimos resultados registrados (mas reciente primero), con el
 * nombre del usuario que los realizo.
 */
export const getRecentActivity = async (limite = 8) => {
	const [resultados, usuarios] = await Promise.all([
		getAllResultados(),
		getAllUsuarios(),
	]);

	const cacheUsuarios = new Map();

	usuarios.forEach((usuario) => {
		const nombre = `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim();

		cacheUsuarios.set(usuario.id, nombre || "Sin nombre");
	});

	const resultadosOrdenados = [...resultados].sort((a, b) => {
		const fechaA = a.fecha?.toMillis ? a.fecha.toMillis() : 0;
		const fechaB = b.fecha?.toMillis ? b.fecha.toMillis() : 0;

		return fechaB - fechaA;
	});

	return resultadosOrdenados.slice(0, limite).map((resultado) => ({
		usuarioNombre: cacheUsuarios.get(resultado.usuarioId) ?? "Usuario desconocido",
		puntaje: resultado.puntaje ?? 0,
		fecha: resultado.fecha ?? null,
	}));
};
