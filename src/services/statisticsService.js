// src/services/statisticsService.js

/**
 * Calcular estadísticas generales de los quizzes
 *
 * @param {Array} quizResults - Resultados de los quizzes realizados
 * @returns {Object} Estadísticas generales
 */
export const calculateGeneralStatistics = (quizResults = []) => {
  if (!Array.isArray(quizResults) || quizResults.length === 0) {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageScore: 0,
      bestScore: 0
    };
  }

  const totalQuizzes = quizResults.length;

  const totalQuestions = quizResults.reduce(
    (total, quiz) => total + (quiz.totalQuestions || 0),
    0
  );

  const correctAnswers = quizResults.reduce(
    (total, quiz) => total + (quiz.correctAnswers || 0),
    0
  );

  const incorrectAnswers = totalQuestions - correctAnswers;

  const totalScore = quizResults.reduce(
    (total, quiz) => total + (quiz.percentage || 0),
    0
  );

  const averageScore = Math.round(totalScore / totalQuizzes);

  const bestScore = Math.max(
    ...quizResults.map((quiz) => quiz.percentage || 0)
  );

  return {
    totalQuizzes,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    averageScore,
    bestScore
  };
};

/**
 * Calcular porcentaje de respuestas correctas
 */
export const calculateAccuracy = (
  correctAnswers,
  totalQuestions
) => {
  if (!totalQuestions || totalQuestions <= 0) {
    return 0;
  }

  return Math.round(
    (correctAnswers / totalQuestions) * 100
  );
};

/**
 * Obtener estadísticas de un área específica
 */
export const calculateAreaStatistics = (
  quizResults = [],
  areaId
) => {
  const areaResults = quizResults.filter(
    (quiz) => Number(quiz.areaId) === Number(areaId)
  );

  if (areaResults.length === 0) {
    return {
      areaId: Number(areaId),
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0
    };
  }

  const totalScore = areaResults.reduce(
    (total, quiz) => total + (quiz.percentage || 0),
    0
  );

  const averageScore = Math.round(
    totalScore / areaResults.length
  );

  const bestScore = Math.max(
    ...areaResults.map((quiz) => quiz.percentage || 0)
  );

  return {
    areaId: Number(areaId),
    totalQuizzes: areaResults.length,
    averageScore,
    bestScore
  };
};

/**
 * Obtener estadísticas de todas las áreas
 */
export const calculateAllAreaStatistics = (
  quizResults = [],
  areas = []
) => {
  return areas.map((area) => {
    return {
      ...area,
      ...calculateAreaStatistics(quizResults, area.id)
    };
  });
};

/**
 * Obtener el porcentaje de progreso
 */
export const calculateProgress = (
  completed,
  total
) => {
  if (!total || total <= 0) {
    return 0;
  }

  const progress = (completed / total) * 100;

  return Math.min(Math.round(progress), 100);
};

/**
 * Obtener la cantidad de respuestas correctas
 */
export const getCorrectAnswers = (quizResults = []) => {
  return quizResults.reduce(
    (total, quiz) => total + (quiz.correctAnswers || 0),
    0
  );
};

/**
 * Obtener la cantidad de quizzes realizados
 */
export const getCompletedQuizzes = (quizResults = []) => {
  return quizResults.length;
};

/**
 * Obtener la mejor puntuación
 */
export const getBestScore = (quizResults = []) => {
  if (quizResults.length === 0) {
    return 0;
  }

  return Math.max(
    ...quizResults.map((quiz) => quiz.percentage || 0)
  );
};

/**
 * Obtener un resumen completo de estadísticas
 */
export const getStatisticsSummary = (
  quizResults = [],
  areas = []
) => {
  const general = calculateGeneralStatistics(quizResults);

  const areaStatistics = calculateAllAreaStatistics(
    quizResults,
    areas
  );

  return {
    general,
    areas: areaStatistics
  };
};

export default {
  calculateGeneralStatistics,
  calculateAccuracy,
  calculateAreaStatistics,
  calculateAllAreaStatistics,
  calculateProgress,
  getCorrectAnswers,
  getCompletedQuizzes,
  getBestScore,
  getStatisticsSummary
};