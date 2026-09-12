// src/services/resultService.js

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
 * HEADERS DE LA PETICIÓN
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
 * PETICIÓN GENERAL A LA API
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
    console.error("Error en resultService:", error);
    throw error;
  }
};

/**
 * =========================================================
 * OBTENER TODOS LOS RESULTADOS
 * =========================================================
 *
 * Ejemplo:
 *
 * resultService.getResults()
 */
export const getResults = async (filters = {}) => {
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

  const queryString = params.toString();

  const endpoint = queryString
    ? `/results?${queryString}`
    : "/results";

  return await request(endpoint);
};

/**
 * =========================================================
 * OBTENER UN RESULTADO POR ID
 * =========================================================
 */
export const getResultById = async (id) => {
  if (!id) {
    throw new Error("El ID del resultado es obligatorio.");
  }

  return await request(`/results/${id}`);
};

/**
 * =========================================================
 * OBTENER RESULTADOS DE UN ESTUDIANTE
 * =========================================================
 *
 * Ejemplo:
 *
 * getResultsByStudent(5)
 */
export const getResultsByStudent = async (studentId) => {
  if (!studentId) {
    throw new Error("El ID del estudiante es obligatorio.");
  }

  return await request(`/results/student/${studentId}`);
};

/**
 * =========================================================
 * OBTENER RESULTADOS DE UNA PRÁCTICA
 * =========================================================
 */
export const getResultsByPractice = async (practiceId) => {
  if (!practiceId) {
    throw new Error("El ID de la práctica es obligatorio.");
  }

  return await request(`/results/practice/${practiceId}`);
};

/**
 * =========================================================
 * OBTENER RESULTADOS POR ÁREA
 * =========================================================
 *
 * Ejemplo:
 *
 * getResultsByArea("matematicas")
 */
export const getResultsByArea = async (area) => {
  if (!area) {
    throw new Error("El área es obligatoria.");
  }

  return await getResults({
    area,
  });
};

/**
 * =========================================================
 * OBTENER RESULTADOS RECIENTES
 * =========================================================
 *
 * limit indica cuántos resultados queremos obtener.
 */
export const getRecentResults = async (limit = 10) => {
  return await getResults({
    limit,
    sort: "recent",
  });
};

/**
 * =========================================================
 * OBTENER MEJORES RESULTADOS
 * =========================================================
 */
export const getBestResults = async (limit = 10) => {
  return await getResults({
    limit,
    sort: "best",
  });
};

/**
 * =========================================================
 * CREAR / GUARDAR UN RESULTADO
 * =========================================================
 *
 * Ejemplo:
 *
 * createResult({
 *   studentId: 1,
 *   practiceId: 2,
 *   score: 80,
 *   correctAnswers: 8,
 *   incorrectAnswers: 2,
 *   totalQuestions: 10
 * })
 */
export const createResult = async (result) => {
  if (!result) {
    throw new Error(
      "Los datos del resultado son obligatorios."
    );
  }

  return await request("/results", {
    method: "POST",
    body: JSON.stringify(result),
  });
};

/**
 * =========================================================
 * GUARDAR RESULTADO DE UNA PRÁCTICA
 * =========================================================
 *
 * Función específica para cuando el estudiante
 * termina una práctica.
 */
export const savePracticeResult = async ({
  studentId,
  practiceId,
  area,
  score,
  correctAnswers,
  incorrectAnswers,
  totalQuestions,
  answers = [],
}) => {
  if (!studentId) {
    throw new Error("El ID del estudiante es obligatorio.");
  }

  if (!practiceId) {
    throw new Error("El ID de la práctica es obligatorio.");
  }

  return await createResult({
    studentId,
    practiceId,
    area,
    score,
    correctAnswers,
    incorrectAnswers,
    totalQuestions,
    answers,
  });
};

/**
 * =========================================================
 * ACTUALIZAR UN RESULTADO
 * =========================================================
 */
export const updateResult = async (id, result) => {
  if (!id) {
    throw new Error("El ID del resultado es obligatorio.");
  }

  if (!result) {
    throw new Error(
      "Los datos del resultado son obligatorios."
    );
  }

  return await request(`/results/${id}`, {
    method: "PUT",
    body: JSON.stringify(result),
  });
};

/**
 * =========================================================
 * ELIMINAR UN RESULTADO
 * =========================================================
 */
export const deleteResult = async (id) => {
  if (!id) {
    throw new Error("El ID del resultado es obligatorio.");
  }

  return await request(`/results/${id}`, {
    method: "DELETE",
  });
};

/**
 * =========================================================
 * OBTENER ESTADÍSTICAS DEL ESTUDIANTE
 * =========================================================
 *
 * Puede utilizarse para la pantalla de resultados,
 * progreso o dashboard.
 */
export const getStudentStatistics = async (studentId) => {
  if (!studentId) {
    throw new Error("El ID del estudiante es obligatorio.");
  }

  return await request(
    `/results/student/${studentId}/statistics`
  );
};

/**
 * =========================================================
 * OBTENER PROMEDIO DEL ESTUDIANTE
 * =========================================================
 */
export const getStudentAverage = async (studentId) => {
  if (!studentId) {
    throw new Error("El ID del estudiante es obligatorio.");
  }

  return await request(
    `/results/student/${studentId}/average`
  );
};

/**
 * =========================================================
 * OBTENER PORCENTAJE DE ACIERTOS
 * =========================================================
 */
export const getAccuracy = async (studentId) => {
  if (!studentId) {
    throw new Error("El ID del estudiante es obligatorio.");
  }

  return await request(
    `/results/student/${studentId}/accuracy`
  );
};

/**
 * =========================================================
 * OBTENER PROGRESO POR ÁREA
 * =========================================================
 */
export const getProgressByArea = async (studentId) => {
  if (!studentId) {
    throw new Error("El ID del estudiante es obligatorio.");
  }

  return await request(
    `/results/student/${studentId}/progress`
  );
};

/**
 * =========================================================
 * OBJETO PRINCIPAL DEL SERVICIO
 * =========================================================
 *
 * Permite utilizar:
 *
 * import resultService from "../../services/resultService";
 */
const resultService = {
  getResults,
  getResultById,
  getResultsByStudent,
  getResultsByPractice,
  getResultsByArea,
  getRecentResults,
  getBestResults,
  createResult,
  savePracticeResult,
  updateResult,
  deleteResult,
  getStudentStatistics,
  getStudentAverage,
  getAccuracy,
  getProgressByArea,
};

export default resultService;