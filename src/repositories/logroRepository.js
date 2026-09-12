// src/repositories/logroRepository.js

const logros = [
  {
    id: 1,
    name: "Primer paso",
    description: "Completa tu primer quiz.",
    icon: "🎯",
    requirement: "Completar 1 quiz",
    points: 10
  },
  {
    id: 2,
    name: "Estudiante dedicado",
    description: "Completa 5 quizzes.",
    icon: "📚",
    requirement: "Completar 5 quizzes",
    points: 25
  },
  {
    id: 3,
    name: "Experto",
    description: "Completa 10 quizzes.",
    icon: "🏆",
    requirement: "Completar 10 quizzes",
    points: 50
  },
  {
    id: 4,
    name: "Mente brillante",
    description: "Obtén un resultado perfecto en un quiz.",
    icon: "🧠",
    requirement: "Obtener 100% en un quiz",
    points: 50
  },
  {
    id: 5,
    name: "Racha de aprendizaje",
    description: "Completa quizzes durante 7 días consecutivos.",
    icon: "🔥",
    requirement: "Mantener una racha de 7 días",
    points: 75
  },
  {
    id: 6,
    name: "Maestro de las áreas",
    description: "Completa un quiz de cada área.",
    icon: "🌟",
    requirement: "Completar todas las áreas",
    points: 100
  }
];

/**
 * Obtener todos los logros
 */
export const getAllLogros = () => {
  return logros;
};

/**
 * Obtener un logro por su ID
 */
export const getLogroById = (id) => {
  return (
    logros.find((logro) => logro.id === Number(id)) || null
  );
};

/**
 * Buscar un logro por su nombre
 */
export const getLogroByName = (name) => {
  if (!name) {
    return null;
  }

  return (
    logros.find(
      (logro) =>
        logro.name.toLowerCase() === name.toLowerCase()
    ) || null
  );
};

/**
 * Obtener los logros que tienen una cantidad específica de puntos
 */
export const getLogrosByPoints = (points) => {
  return logros.filter(
    (logro) => logro.points === Number(points)
  );
};

/**
 * Obtener los IDs de todos los logros
 */
export const getLogroIds = () => {
  return logros.map((logro) => logro.id);
};

/**
 * Verificar si existe un logro
 */
export const logroExists = (id) => {
  return logros.some(
    (logro) => logro.id === Number(id)
  );
};

export default {
  getAllLogros,
  getLogroById,
  getLogroByName,
  getLogrosByPoints,
  getLogroIds,
  logroExists
};