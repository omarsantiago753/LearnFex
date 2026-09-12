const STORAGE_KEY = "questions_db";

/**
 * Estructura de una pregunta:
 * {
 *   id: string,
 *   question: string,
 *   options: [{ id: "A", text: "..." }],
 *   correctAnswer: "A",
 *   subject: "Matemáticas",
 *   difficulty: "Fácil | Medio | Difícil",
 *   createdAt: number
 * }
 */

function getAll() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveAll(questions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

// 🔹 Crear pregunta
function create(questionData) {
  const questions = getAll();

  const newQuestion = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...questionData,
  };

  questions.push(newQuestion);
  saveAll(questions);

  return newQuestion;
}

// 🔹 Obtener por ID
function getById(id) {
  return getAll().find((q) => q.id === id);
}

// 🔹 Actualizar pregunta
function update(id, updatedData) {
  const questions = getAll();

  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) return null;

  questions[index] = {
    ...questions[index],
    ...updatedData,
  };

  saveAll(questions);
  return questions[index];
}

// 🔹 Eliminar pregunta
function remove(id) {
  const questions = getAll();
  const filtered = questions.filter((q) => q.id !== id);

  saveAll(filtered);
  return true;
}

// 🔹 Buscar / filtrar preguntas
function search({ text = "", subject, difficulty } = {}) {
  let questions = getAll();

  if (text) {
    questions = questions.filter((q) =>
      q.question.toLowerCase().includes(text.toLowerCase())
    );
  }

  if (subject) {
    questions = questions.filter((q) => q.subject === subject);
  }

  if (difficulty) {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  return questions;
}

// 🔹 Obtener preguntas aleatorias (para simulacros)
function getRandomQuestions(limit = 10, filters = {}) {
  const filtered = search(filters);

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

// 🔹 Limpiar base de datos (opcional)
function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

export const questionRepository = {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  getRandomQuestions,
  clearAll,
};