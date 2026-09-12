// src/services/questionService.js

// URL base de la API.
// Si existe VITE_API_URL en el archivo .env, se utiliza esa.
// Si no existe, se utiliza el servidor local.
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Obtiene el token almacenado en el navegador.
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Construye los headers de las peticiones.
 */
const getHeaders = () => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  // Si existe un token, se envía en la petición.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Función general para realizar peticiones a la API.
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

    // Determinar si la respuesta viene en JSON.
    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Si la respuesta no fue exitosa.
    if (!response.ok) {
      const message =
        typeof data === "object"
          ? data.message || data.error
          : data;

      throw new Error(
        message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error en questionService:", error);

    throw error;
  }
};

/**
 * =========================================================
 * OBTENER TODAS LAS PREGUNTAS
 * =========================================================
 *
 * Ejemplo:
 * getQuestions()
 *
 * También permite filtros:
 *
 * getQuestions({
 *   area: "matematicas",
 *   difficulty: "facil",
 *   limit: 10
 * })
 */
export const getQuestions = async (filters = {}) => {
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
    ? `/questions?${queryString}`
    : "/questions";

  return await request(endpoint);
};

/**
 * =========================================================
 * OBTENER UNA PREGUNTA POR ID
 * =========================================================
 */
export const getQuestionById = async (id) => {
  if (!id) {
    throw new Error("El ID de la pregunta es obligatorio.");
  }

  return await request(`/questions/${id}`);
};

/**
 * =========================================================
 * OBTENER PREGUNTAS POR ÁREA
 * =========================================================
 *
 * Ejemplo:
 * getQuestionsByArea("matematicas")
 */
export const getQuestionsByArea = async (area) => {
  if (!area) {
    throw new Error("El área es obligatoria.");
  }

  return await getQuestions({
    area,
  });
};

/**
 * =========================================================
 * OBTENER PREGUNTAS POR TEMA
 * =========================================================
 */
export const getQuestionsByTopic = async (topic) => {
  if (!topic) {
    throw new Error("El tema es obligatorio.");
  }

  return await getQuestions({
    topic,
  });
};

/**
 * =========================================================
 * OBTENER PREGUNTAS POR DIFICULTAD
 * =========================================================
 *
 * Valores posibles, por ejemplo:
 * "facil"
 * "medio"
 * "dificil"
 */
export const getQuestionsByDifficulty = async (difficulty) => {
  if (!difficulty) {
    throw new Error("La dificultad es obligatoria.");
  }

  return await getQuestions({
    difficulty,
  });
};

/**
 * =========================================================
 * OBTENER PREGUNTAS PARA PRÁCTICA
 * =========================================================
 *
 * Esta función está pensada específicamente para
 * el componente Practice.jsx.
 *
 * Ejemplo:
 *
 * getPracticeQuestions({
 *   area: "matematicas",
 *   topic: "algebra",
 *   difficulty: "medio",
 *   limit: 10
 * })
 */
export const getPracticeQuestions = async ({
  area = "",
  topic = "",
  difficulty = "",
  limit = 10,
} = {}) => {
  return await getQuestions({
    area,
    topic,
    difficulty,
    limit,
  });
};

/**
 * =========================================================
 * OBTENER PREGUNTAS ALEATORIAS
 * =========================================================
 *
 * Se utiliza para generar una práctica con preguntas
 * diferentes.
 */
export const getRandomQuestions = async (
  amount = 10,
  filters = {}
) => {
  return await getQuestions({
    ...filters,
    random: true,
    limit: amount,
  });
};

/**
 * =========================================================
 * CREAR UNA PREGUNTA
 * =========================================================
 *
 * Normalmente será utilizada por el administrador.
 */
export const createQuestion = async (question) => {
  if (!question) {
    throw new Error("Los datos de la pregunta son obligatorios.");
  }

  return await request("/questions", {
    method: "POST",
    body: JSON.stringify(question),
  });
};

/**
 * =========================================================
 * ACTUALIZAR UNA PREGUNTA
 * =========================================================
 */
export const updateQuestion = async (id, question) => {
  if (!id) {
    throw new Error("El ID de la pregunta es obligatorio.");
  }

  if (!question) {
    throw new Error("Los datos de la pregunta son obligatorios.");
  }

  return await request(`/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(question),
  });
};

/**
 * =========================================================
 * ELIMINAR UNA PREGUNTA
 * =========================================================
 */
export const deleteQuestion = async (id) => {
  if (!id) {
    throw new Error("El ID de la pregunta es obligatorio.");
  }

  return await request(`/questions/${id}`, {
    method: "DELETE",
  });
};

/**
 * =========================================================
 * ENVIAR RESPUESTA A UNA PREGUNTA
 * =========================================================
 *
 * Esta función puede utilizarse cuando el estudiante
 * responde una pregunta durante la práctica.
 *
 * Ejemplo:
 *
 * submitAnswer(questionId, answerId)
 */
export const submitAnswer = async (questionId, answerId) => {
  if (!questionId) {
    throw new Error("El ID de la pregunta es obligatorio.");
  }

  if (!answerId) {
    throw new Error("La respuesta es obligatoria.");
  }

  return await request(`/questions/${questionId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      answerId,
    }),
  });
};

/**
 * =========================================================
 * VERIFICAR UNA RESPUESTA
 * =========================================================
 *
 * Si tu backend tiene un endpoint específico para
 * comprobar respuestas.
 */
export const checkAnswer = async (questionId, answer) => {
  if (!questionId) {
    throw new Error("El ID de la pregunta es obligatorio.");
  }

  return await request(`/questions/${questionId}/check`, {
    method: "POST",
    body: JSON.stringify({
      answer,
    }),
  });
};

/**
 * =========================================================
 * OBTENER CANTIDAD DE PREGUNTAS
 * =========================================================
 */
export const getQuestionCount = async (filters = {}) => {
  const questions = await getQuestions(filters);

  if (Array.isArray(questions)) {
    return questions.length;
  }

  if (questions?.count !== undefined) {
    return questions.count;
  }

  if (questions?.total !== undefined) {
    return questions.total;
  }

  return 0;
};

/**
 * =========================================================
 * OBJETO questionService
 * =========================================================
 *
 * Permite importar todo el servicio de esta manera:
 *
 * import questionService from "../../services/questionService";
 */
const questionService = {
  getQuestions,
  getQuestionById,
  getQuestionsByArea,
  getQuestionsByTopic,
  getQuestionsByDifficulty,
  getPracticeQuestions,
  getRandomQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  submitAnswer,
  checkAnswer,
  getQuestionCount,
};

export default questionService;