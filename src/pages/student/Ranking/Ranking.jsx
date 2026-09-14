import React, { useEffect, useState } from "react";
import "./Ranking.css";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  // Cargar datos desde localStorage
  useEffect(() => {
    const storedRanking = JSON.parse(localStorage.getItem("ranking")) || [];

    // Ordenar de mayor a menor puntaje
    const sortedRanking = storedRanking.sort((a, b) => b.score - a.score);

    setRanking(sortedRanking);
  }, []);

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking de Jugadores</h2>

      {ranking.length === 0 ? (
        <p>No hay datos en el ranking</p>
      ) : (
        <ul className="ranking-list">
          {ranking.map((player, index) => (
            <li key={index} className="ranking-item">
              <span className="position">#{index + 1}</span>
              <span className="name">{player.name}</span>
              <span className="score">{player.score} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ranking;
