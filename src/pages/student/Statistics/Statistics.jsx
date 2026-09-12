import React, { useEffect, useState } from "react";
import "./Statistics.css";

const Statistics = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progress: 0,
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({ total, completed, pending, progress });
  }, []);

  return (
    <div className="statistics-container">
      <h2>📊 Estadísticas</h2>

      <div className="stat">
        <span>Total de tareas:</span>
        <strong>{stats.total}</strong>
      </div>

      <div className="stat">
        <span>Completadas:</span>
        <strong>{stats.completed}</strong>
      </div>

      <div className="stat">
        <span>Pendientes:</span>
        <strong>{stats.pending}</strong>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${stats.progress}%` }}></div>
      </div>

      <p>{stats.progress}% completado</p>
    </div>
  );
};

export default Statistics;
