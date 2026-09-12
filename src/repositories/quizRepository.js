const STORAGE_KEY = "quizzes_db";

/**
 * Estructura de un quiz:
 * {
 *   id: string,
 *   title: string,
 *   questions: [questionId],
 *   answers: { [questionId]: "A" },
 *   score: number,
 *   startedAt: number,
 *   finishedAt: number | null,
 *   status: "in_progress" | "completed"
 * }
 */

function getAll() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveAll(quizzes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

// 🔹 Crear un nuevo quiz
function create({ title = "Simulacro", questions = [] }) {
  const quizzes = getAll();

  const newQuiz = {
    id: crypto.randomUUID(),
    title,
    questions, // array de IDs de preguntas
    answers: {},
    score: 0,
    startedAt: Date.now(),
    finishedAt: null,
    status: "in_progress",
  };

  quizzes.push(newQuiz);
  saveAll(quizzes);

  return newQuiz;
}

// 🔹 Obtener quiz por ID
function getById(id) {
  return getAll().find((q) => q.id === id);
}

// 🔹 Guardar respuesta
function saveAnswer(quizId, questionId, answer) {
  const quizzes = getAll();

  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return null;

  quiz.answers[questionId] = answer;

  saveAll(quizzes);
  return quiz;
}

// 🔹 Finalizar quiz y calcular puntaje
function finishQuiz(quizId, questionsData = []) {
  const quizzes = getAll();

  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return null;

  let correct = 0;

  questionsData.forEach((q) => {
    const userAnswer = quiz.answers[q.id];
    if (userAnswer && userAnswer === q.correctAnswer) {
      correct++;
    }
  });

  const score = Math.round((correct / questionsData.length) * 100);

  quiz.score = score;
  quiz.finishedAt = Date.now();
  quiz.status = "completed";

  saveAll(quizzes);

  return {
    ...quiz,
    correct,
    total: questionsData.length,
  };
}

// 🔹 Obtener quizzes por estado
function getByStatus(status) {
  return getAll().filter((q) => q.status === status);
}

// 🔹 Eliminar quiz
function remove(id) {
  const quizzes = getAll().filter((q) => q.id !== id);
  saveAll(quizzes);
  return true;
}

// 🔹 Limpiar todos los quizzes
function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

export const quizRepository = {
  getAll,
  getById,
  create,
  saveAnswer,
  finishQuiz,
  getByStatus,
  remove,
  clearAll,
};