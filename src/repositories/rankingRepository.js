// src/repositories/rankingRepository.js

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * =========================================================
 * OBTENER TOKEN
 * =========================================================
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * =========================================================
 * CONFIGURACIÓN DE HEADERS
 * =========================================================
 */
const getHeaders = () => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * =========================================================
 * PETICIÓN GENERAL
 * =========================================================
 */
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,

      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    });

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof data === "object"
          ? data.message || data.error
          : data;

      throw new Error(
        message ||
          `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error en rankingRepository:", error);
    throw error;
  }
};

/**
 * =========================================================
 * OBTENER RANKING GENERAL
 * =========================================================
 *
 * Obtiene la clasificación general de estudiantes.
 *
 * Ejemplo:
 * getRanking()
 */
export const getRanking = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, value);
    }
  });

  const query = params.toString();

  const endpoint = query
    ? `/ranking?${query}`
    : "/ranking";

  return await request(endpoint);
};

/**
 * =========================================================
 * OBTENER TOP ESTUDIANTES
 * =========================================================
 *
 * Ejemplo:
 * getTopStudents(10)
 */
export const getTopStudents = async (limit = 10) => {
  return await request(`/ranking/top?limit=${limit}`);
};

/**
 * =========================================================
 * OBTENER POSICIÓN DE UN ESTUDIANTE
 * =========================================================
 *
 * Ejemplo:
 * getStudentPosition(5)
 */
export const getStudentPosition = async (studentId) => {
  if (!studentId) {
    throw new Error(
      "El ID del estudiante es obligatorio."
    );
  }

  return await request(
    `/ranking/student/${studentId}/position`
  );
};

/**
 * =========================================================
 * OBTENER INFORMACIÓN DEL ESTUDIANTE EN EL RANKING
 * =========================================================
 */
export const getStudentRanking = async (studentId) => {
  if (!studentId) {
    throw new Error(
      "El ID del estudiante es obligatorio."
    );
  }

  return await request(
    `/ranking/student/${studentId}`
  );
};

/**
 * =========================================================
 * OBTENER RANKING POR ÁREA
 * =========================================================
 *
 * Ejemplo:
 * getRankingByArea("matematicas")
 */
export const getRankingByArea = async (area) => {
  if (!area) {
    throw new Error("El área es obligatoria.");
  }

  return await request(
    `/ranking/area/${encodeURIComponent(area)}`
  );
};

/**
 * =========================================================
 * OBTENER RANKING POR PERÍODO
 * =========================================================
 *
 * period puede ser:
 * - daily
 * - weekly
 * - monthly
 * - all
 */
export const getRankingByPeriod = async (
  period = "all"
) => {
  return await request(
    `/ranking/period/${encodeURIComponent(period)}`
  );
};

/**
 * =========================================================
 * OBTENER RANKING SEMANAL
 * =========================================================
 */
export const getWeeklyRanking = async () => {
  return await getRankingByPeriod("weekly");
};

/**
 * =========================================================
 * OBTENER RANKING MENSUAL
 * =========================================================
 */
export const getMonthlyRanking = async () => {
  return await getRankingByPeriod("monthly");
};

/**
 * =========================================================
 * OBTENER RANKING DIARIO
 * =========================================================
 */
export const getDailyRanking = async () => {
  return await getRankingByPeriod("daily");
};

/**
 * =========================================================
 * OBTENER PUNTOS DEL ESTUDIANTE
 * =========================================================
 */
export const getStudentPoints = async (studentId) => {
  if (!studentId) {
    throw new Error(
      "El ID del estudiante es obligatorio."
    );
  }

  return await request(
    `/ranking/student/${studentId}/points`
  );
};

/**
 * =========================================================
 * OBTENER PUNTOS TOTALES
 * =========================================================
 */
export const getTotalPoints = async (studentId) => {
  if (!studentId) {
    throw new Error(
      "El ID del estudiante es obligatorio."
    );
  }

  const data = await getStudentPoints(studentId);

  if (typeof data === "number") {
    return data;
  }

  return data?.points || data?.totalPoints || 0;
};

/**
 * =========================================================
 * OBTENER ESTADÍSTICAS DEL RANKING
 * =========================================================
 */
export const getRankingStatistics = async () => {
  return await request("/ranking/statistics");
};

/**
 * =========================================================
 * OBTENER CANTIDAD DE PARTICIPANTES
 * =========================================================
 */
export const getParticipantCount = async () => {
  const data = await getRankingStatistics();

  if (typeof data?.participants === "number") {
    return data.participants;
  }

  if (typeof data?.totalParticipants === "number") {
    return data.totalParticipants;
  }

  return 0;
};

/**
 * =========================================================
 * REGISTRAR PUNTOS
 * =========================================================
 *
 * Se utiliza cuando un estudiante obtiene puntos
 * después de completar una práctica.
 */
export const addPoints = async ({
  studentId,
  points,
  reason = "practice",
}) => {
  if (!studentId) {
    throw new Error(
      "El ID del estudiante es obligatorio."
    );
  }

  if (points === undefined || points === null) {
    throw new Error("La cantidad de puntos es obligatoria.");
  }

  return await request("/ranking/points", {
    method: "POST",

    body: JSON.stringify({
      studentId,
      points,
      reason,
    }),
  });
};

/**
 * =========================================================
 * ACTUALIZAR PUNTOS
 * =========================================================
 */
export const updateStudentPoints = async (
  studentId,
  points
) => {
  if (!studentId) {
    throw new Error(
      "El ID del estudiante es obligatorio."
    );
  }

  if (points === undefined || points === null) {
    throw new Error("Los puntos son obligatorios.");
  }

  return await request(
    `/ranking/student/${studentId}/points`,
    {
      method: "PUT",

      body: JSON.stringify({
        points,
      }),
    }
  );
};

/**
 * =========================================================
 * OBTENER RANKING CON LÍMITE
 * =========================================================
 *
 * Permite controlar la cantidad de estudiantes
 * mostrados en la pantalla.
 */
export const getRankingLimit = async (limit = 10) => {
  return await getRanking({
    limit,
  });
};

/**
 * =========================================================
 * BUSCAR ESTUDIANTE EN EL RANKING
 * =========================================================
 */
export const searchStudent = async (name) => {
  if (!name || !name.trim()) {
    throw new Error(
      "El nombre del estudiante es obligatorio."
    );
  }

  return await getRanking({
    search: name.trim(),
  });
};

/**
 * =========================================================
 * OBJETO PRINCIPAL DEL REPOSITORY
 * =========================================================
 */
const rankingRepository = {
  getRanking,
  getTopStudents,
  getStudentPosition,
  getStudentRanking,
  getRankingByArea,
  getRankingByPeriod,
  getWeeklyRanking,
  getMonthlyRanking,
  getDailyRanking,
  getStudentPoints,
  getTotalPoints,
  getRankingStatistics,
  getParticipantCount,
  addPoints,
  updateStudentPoints,
  getRankingLimit,
  searchStudent,
};

export default rankingRepository;