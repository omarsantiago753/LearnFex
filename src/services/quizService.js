// src/services/quizService.js

import {
  getAllQuestions,
  getQuestionsByAreaId,
  getQuestionById
} from "../repositories/questionRepository";

import { getAreaById } from "../repositories/areaRepository";

/**
 * Obtener todas las preguntas disponibles
 */
export const getQuizQuestions = () => {
  return getAllQuestions();
};

/**
 * Obtener preguntas de un área específica
 */
export const getQuizByArea = (areaId) => {
  const area = getAreaById(areaId);

  if (!area) {
    throw new Error("El área seleccionada no existe.");
  }

  const questions = getQuestionsByAreaId(areaId);

  return {
    area,
    questions
  };
};

/**
 * Obtener una pregunta específica
 */
export const getQuizQuestion = (questionId) => {
  const question = getQuestionById(questionId);

  if (!question) {
    throw new Error("La pregunta no existe.");
  }

  return question;
};

/**
 * Validar una respuesta
 */
export const checkAnswer = (questionId, answer) => {
  const question = getQuestionById(questionId);

  if (!question) {
    throw new Error("La pregunta no existe.");
  }

  const isCorrect =
    question.correctAnswer.toUpperCase() === answer.toUpperCase();

  return {
    correct: isCorrect,
    correctAnswer: question.correctAnswer
  };
};

/**
 * Calcular el resultado final del quiz
 */
export const calculateResult = (questions, answers) => {
  if (!questions || questions.length === 0) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      percentage: 0
    };
  }

  let correctAnswers = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];

    if (
      userAnswer &&
      question.correctAnswer.toUpperCase() === userAnswer.toUpperCase()
    ) {
      correctAnswers++;
    }
  });

  const totalQuestions = questions.length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const percentage = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage
  };
};

/**
 * Crear un quiz nuevo
 */
export const startQuiz = (areaId) => {
  const quiz = getQuizByArea(areaId);

  return {
    area: quiz.area,
    questions: quiz.questions,
    currentQuestion: 0,
    answers: {},
    finished: false
  };
};

/**
 * Finalizar el quiz y obtener resultados
 */
export const finishQuiz = (questions, answers) => {
  const result = calculateResult(questions, answers);

  return {
    ...result,
    finished: true
  };
};

export default {
  getQuizQuestions,
  getQuizByArea,
  getQuizQuestion,
  checkAnswer,
  calculateResult,
  startQuiz,
  finishQuiz
};