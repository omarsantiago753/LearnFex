import React, { useEffect, useState } from "react";
import "./QuizScreen.css";

const questions = [
  {
    id: 1,
    subject: "Matemáticas",
    question:
      "¿Cuál de las siguientes opciones representa la factorización correcta de x² − 9?",
    options: [
      "(x + 3)(x − 3)",
      "(x + 9)(x − 1)",
      "(x − 3)(x − 3)",
      "(x + 3)²",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    subject: "Matemáticas",
    question: "Si 2x + 6 = 14, ¿cuál es el valor de x?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
  },
  {
    id: 3,
    subject: "Lectura Crítica",
    question:
      "Según el texto, ¿cuál es la idea principal del autor?",
    options: [
      "Presentar una opinión personal.",
      "Explicar las causas de un fenómeno.",
      "Describir un lugar.",
      "Comparar dos situaciones.",
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    subject: "Ciencias Naturales",
    question:
      "¿Cuál es la principal función de la fotosíntesis?",
    options: [
      "Producir energía a partir de alimentos.",
      "Transformar energía luminosa en energía química.",
      "Eliminar el oxígeno del ambiente.",
      "Producir únicamente agua.",
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    subject: "Inglés",
    question:
      'Choose the correct option: "She ___ to school every day."',
    options: ["go", "going", "goes", "gone"],
    correctAnswer: 2,
  },
];

const TOTAL_QUESTIONS = 100;
const INITIAL_TIME = 60 * 60 + 29;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  const question = questions[currentQuestion];

  const selectedAnswer = answers[currentQuestion];

  /*
   * Temporizador
   */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /*
   * Seleccionar respuesta
   */
  const handleSelectAnswer = (index) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: index,
    }));
  };

  /*
   * Marcar pregunta
   */
  const toggleMarkQuestion = () => {
    setMarkedQuestions((previous) => {
      if (previous.includes(currentQuestion)) {
        return previous.filter(
          (item) => item !== currentQuestion
        );
      }

      return [...previous, currentQuestion];
    });
  };

  /*
   * Pregunta anterior
   */
  const handlePrevious = () => {
    if (currentQuestion === 0) return;

    setCurrentQuestion((previous) => previous - 1);
  };

  /*
   * Pregunta siguiente
   */
  const handleNext = () => {
    if (currentQuestion >= questions.length - 1) return;

    setCurrentQuestion((previous) => previous + 1);
  };

  /*
   * Ir a una pregunta
   */
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  return (
    <div className="quiz-screen">

      {/* ================= HEADER ================= */}

      <header className="quiz-header">
        <div className="quiz-header-content">

          <div className="quiz-brand">
            <div className="quiz-logo">
              🎓
            </div>

            <div>
              <h1>LearnFex</h1>

              <span>
                Simulacro Saber 11
              </span>
            </div>
          </div>

          <div className="quiz-header-info">

            <div className="question-counter">
              <span>Pregunta</span>

              <strong>
                {currentQuestion + 1} de {TOTAL_QUESTIONS}
              </strong>
            </div>

            <div className="quiz-timer">
              <span>⏱</span>

              <strong>
                {formatTime(timeLeft)}
              </strong>
            </div>

          </div>
        </div>
      </header>

      {/* ================= CONTENIDO ================= */}

      <main className="quiz-container">

        {/* Información superior */}

        <div className="quiz-top-info">

          <span className="subject-badge">
            {question.subject}
          </span>

          <span className="top-question-number">
            Pregunta {currentQuestion + 1} de {TOTAL_QUESTIONS}
          </span>

        </div>

        {/* ================= PREGUNTA ================= */}

        <section className="question-card">

          <div className="question-header">

            <div>
              <p className="question-instruction">
                Selecciona una sola respuesta
              </p>

              <h2>
                {question.question}
              </h2>
            </div>

            <button
              className={`mark-button ${
                markedQuestions.includes(currentQuestion)
                  ? "marked"
                  : ""
              }`}
              onClick={toggleMarkQuestion}
            >
              {markedQuestions.includes(currentQuestion)
                ? "★ Marcada"
                : "☆ Marcar"}
            </button>

          </div>

          {/* ================= OPCIONES ================= */}

          <div className="options-container">

            {question.options.map((option, index) => {

              const selected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  className={`answer-option ${
                    selected ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleSelectAnswer(index)
                  }
                >

                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>

                  <span className="radio-button">
                    {selected && (
                      <span className="radio-selected" />
                    )}
                  </span>

                </button>
              );
            })}

          </div>

          {/* ================= BOTONES ================= */}

          <div className="question-controls">

            <button
              className="previous-button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Anterior
            </button>

            <button
              className="next-button"
              onClick={handleNext}
              disabled={
                currentQuestion >= questions.length - 1
              }
            >
              Siguiente →
            </button>

          </div>

        </section>

        {/* ================= NAVEGACIÓN ================= */}

        <section className="question-navigation">

          <div className="navigation-header">

            <h3>
              Navegación de preguntas
            </h3>

            <div className="navigation-legend">

              <span>
                <i className="legend-dot answered" />
                Respondida
              </span>

              <span>
                <i className="legend-dot marked-dot" />
                Marcada
              </span>

              <span>
                <i className="legend-dot unanswered" />
                Sin responder
              </span>

            </div>

          </div>

          <div className="question-numbers">

            {questions.map((item, index) => {

              const answered =
                answers[index] !== undefined;

              const marked =
                markedQuestions.includes(index);

              const current =
                currentQuestion === index;

              return (
                <button
                  key={item.id}
                  onClick={() => goToQuestion(index)}
                  className={`
                    question-number
                    ${current ? "current" : ""}
                    ${answered ? "answered" : ""}
                  `}
                >
                  {index + 1}

                  {marked && (
                    <span className="marked-indicator" />
                  )}
                </button>
              );
            })}

            <span className="more-questions">
              ...
            </span>

            <button className="question-number">
              100
            </button>

          </div>

        </section>

        {/* ================= TIMER MOBILE ================= */}

        <div className="mobile-timer">

          <span>⏱</span>

          <strong>
            {formatTime(timeLeft)}
          </strong>

        </div>

      </main>
    </div>
  );
}