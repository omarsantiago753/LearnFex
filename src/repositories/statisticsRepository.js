// src/repositories/statisticsRepository.js

const statistics = [];

/**
 * Guardar el resultado de un quiz
 */
export const saveQuizResult = (quizResult) => {
  if (!quizResult) {
    throw new Error("El resultado del quiz es obligatorio.");
  }

  const newResult = {
    id: statistics.length + 1,
    ...quizResult,
    createdAt: new Date().toISOString()
  };

  statistics.push(newResult);

  return newResult;
};

/**
 * Obtener todos los resultados
 */
export const getAllStatistics = () => {
  return statistics;
};

/**
 * Obtener un resultado por su ID
 */
export const getStatisticsById = (id) => {
  return (
    statistics.find(
      (statistic) => statistic.id === Number(id)
    ) || null
  );
};

/**
 * Obtener resultados de un área específica
 */
export const getStatisticsByAreaId = (areaId) => {
  return statistics.filter(
    (statistic) =>
      Number(statistic.areaId) === Number(areaId)
  );
};

/**
 * Obtener los últimos resultados
 */
export const getRecentStatistics = (limit = 5) => {
  return statistics
    .slice()
    .reverse()
    .slice(0, limit);
};

/**
 * Obtener la cantidad de quizzes realizados
 */
export const getTotalQuizzes = () => {
  return statistics.length;
};

/**
 * Eliminar un resultado
 */
export const deleteStatistics = (id) => {
  const index = statistics.findIndex(
    (statistic) => statistic.id === Number(id)
  );

  if (index === -1) {
    return false;
  }

  statistics.splice(index, 1);

  return true;
};

/**
 * Eliminar todas las estadísticas
 */
export const clearStatistics = () => {
  statistics.length = 0;
};

/**
 * Obtener estadísticas del repositorio
 */
export const getStatisticsCount = () => {
  return statistics.length;
};

export default {
  saveQuizResult,
  getAllStatistics,
  getStatisticsById,
  getStatisticsByAreaId,
  getRecentStatistics,
  getTotalQuizzes,
  deleteStatistics,
  clearStatistics,
  getStatisticsCount
};