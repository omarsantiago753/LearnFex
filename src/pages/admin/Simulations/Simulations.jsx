import { useEffect, useState } from "react";
import "./Simulations.css";

import {
  getAllQuizzes,
  deleteQuiz,
} from "../../../repositories/quizRepository";

const Simulations = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadQuizzes = async (next = false) => {
    setLoading(true);

    try {
      const res = await getAllQuizzes(next ? cursor : null);

      if (next) {
        setQuizzes((prev) => [...prev, ...res.items]);
      } else {
        setQuizzes(res.items);
      }

      setCursor(res.lastDoc);
    } catch (error) {
      console.error("Error cargando simulacros:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Desactivar este simulacro?");
    if (!confirm) return;

    try {
      await deleteQuiz(id);

      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, estado: "inactivo" } : q)),
      );
    } catch (error) {
      console.error("Error desactivando simulacro:", error);
    }
  };

  return (
    <div className="simulations">
      <h2 className="simulations__title">Simulacros</h2>

      <div className="simulations__table">
        <div className="simulations__header">
          <span>Nombre</span>
          <span>Área</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {quizzes.map((quiz) => (
          <div key={quiz.id} className="simulations__row">
            <span>{quiz.nombre}</span>
            <span>{quiz.area}</span>
            <span
              className={`estado ${
                quiz.estado === "activo" ? "estado--activo" : "estado--inactivo"
              }`}
            >
              {quiz.estado}
            </span>

            <button
              className="btn-delete"
              onClick={() => handleDelete(quiz.id)}
              disabled={quiz.estado === "inactivo"}
            >
              Desactivar
            </button>
          </div>
        ))}

        {quizzes.length === 0 && !loading && (
          <p className="empty">No hay simulacros</p>
        )}
      </div>

      <div className="simulations__actions">
        <button onClick={() => loadQuizzes(true)} disabled={loading}>
          {loading ? "Cargando..." : "Cargar más"}
        </button>
      </div>
    </div>
  );
};

export default Simulations;
