import React, { useState } from "react";
import "./Practice.css";

const areas = [
  "Todas",
  "Matemáticas",
  "Inglés",
  "Lectura Crítica",
  "C. Sociales",
  "C. Naturales",
];

const topics = [
  {
    id: 1,
    name: "Álgebra y funciones",
    description: "20 preguntas • Medio",
    area: "Matemáticas",
    progress: 60,
    icon: "∑",
  },
  {
    id: 2,
    name: "Trigonometría",
    description: "15 preguntas • Fácil",
    area: "Matemáticas",
    progress: 45,
    icon: "△",
  },
  {
    id: 3,
    name: "Biología celular",
    description: "20 preguntas • Fácil",
    area: "C. Naturales",
    progress: 35,
    icon: "🧬",
  },
  {
    id: 4,
    name: "Reading comprehension",
    description: "12 preguntas • Medio",
    area: "Inglés",
    progress: 50,
    icon: "A",
  },
  {
    id: 5,
    name: "Estadística y probabilidad",
    description: "14 preguntas • Fácil",
    area: "Matemáticas",
    progress: 70,
    icon: "▥",
  },
  {
    id: 6,
    name: "Física: cinemática",
    description: "20 preguntas • Medio",
    area: "C. Naturales",
    progress: 25,
    icon: "⚡",
  },
];

const recommendedPractices = [
  {
    id: 1,
    title: "Simulacro de Matemáticas",
    questions: 20,
    difficulty: "Medio",
    type: "medium",
    icon: "∑",
  },
  {
    id: 2,
    title: "Comprensión de lectura",
    questions: 15,
    difficulty: "Fácil",
    type: "easy",
    icon: "A",
  },
  {
    id: 3,
    title: "Ciencias Naturales",
    questions: 20,
    difficulty: "Difícil",
    type: "hard",
    icon: "🧬",
  },
];

function Practice() {
  const [activeArea, setActiveArea] = useState("Todas");
  const [search, setSearch] = useState("");

  const filteredTopics = topics.filter((topic) => {
    const matchesArea =
      activeArea === "Todas" || topic.area === activeArea;

    const matchesSearch = topic.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesArea && matchesSearch;
  });

  const handlePractice = (topic) => {
    console.log("Iniciando práctica:", topic);
  };

  const handleNavigation = (section) => {
    console.log("Navegando a:", section);
  };

  return (
    <div className="practice-page">
      <div className="practice-container">

        {/* HEADER */}
        <header className="practice-header">
          <div className="practice-title-section">
            <h1 className="practice-title">Práctica</h1>

            <p className="practice-subtitle">
              Banco de preguntas ICFES
            </p>
          </div>

          <div className="practice-header-actions">
            <button
              type="button"
              className="practice-button practice-button-secondary"
              onClick={() => console.log("Abrir historial")}
            >
              Historial
            </button>

            <button
              type="button"
              className="practice-button practice-button-primary"
              onClick={() =>
                handlePractice({
                  name: "Nueva práctica",
                })
              }
            >
              + Nueva práctica
            </button>
          </div>
        </header>

        {/* BUSCADOR */}
        <div className="practice-search">
          <input
            type="text"
            value={search}
            placeholder="Buscar tema..."
            onChange={(event) => setSearch(event.target.value)}
          />

          <span className="practice-search-icon">
            🔍
          </span>
        </div>

        {/* FILTROS */}
        <div className="practice-filters">
          {areas.map((area) => (
            <button
              type="button"
              key={area}
              className={`practice-filter ${
                activeArea === area ? "active" : ""
              }`}
              onClick={() => setActiveArea(area)}
            >
              {area}
            </button>
          ))}
        </div>

        {/* PRÁCTICA DESTACADA */}
        <section className="practice-featured">
          <div className="practice-featured-content">

            <span className="practice-featured-label">
              CONTINUAR
            </span>

            <h2>Álgebra y funciones</h2>

            <p>
              12 de 20 preguntas • Matemáticas
            </p>

            <div className="practice-featured-progress">
              <div className="practice-progress-info">
                <span>Progreso</span>
                <span>60%</span>
              </div>

              <div className="practice-progress-bar">
                <div
                  className="practice-progress-fill"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

          </div>

          <div className="practice-featured-action">
            <button
              type="button"
              className="practice-button practice-button-primary"
              onClick={() =>
                handlePractice({
                  id: 1,
                  name: "Álgebra y funciones",
                })
              }
            >
              Continuar →
            </button>
          </div>
        </section>

        {/* TEMAS DISPONIBLES */}
        <section className="practice-section">

          <div className="practice-section-header">
            <h2 className="practice-section-title">
              Temas disponibles
            </h2>

            <button
              type="button"
              className="practice-section-link"
              onClick={() => setActiveArea("Todas")}
            >
              Ver todos
            </button>
          </div>

          <div className="practice-topics-grid">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className="practice-topic-card"
                onClick={() => handlePractice(topic)}
              >
                <div className="practice-topic-icon">
                  {topic.icon}
                </div>

                <div className="practice-topic-info">
                  <h3 className="practice-topic-title">
                    {topic.name}
                  </h3>

                  <p className="practice-topic-description">
                    {topic.description}
                  </p>

                  <div className="practice-topic-progress">
                    <div className="practice-topic-progress-bar">
                      <div
                        className="practice-topic-progress-fill"
                        style={{
                          width: `${topic.progress}%`,
                        }}
                      />
                    </div>

                    <div className="practice-topic-percent">
                      {topic.progress}% completado
                    </div>
                  </div>
                </div>

                <span className="practice-topic-arrow">
                  →
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* PRÁCTICAS RECOMENDADAS */}
        <section className="practice-section">

          <div className="practice-section-header">
            <h2 className="practice-section-title">
              Prácticas recomendadas
            </h2>
          </div>

          <div className="practice-list">
            {recommendedPractices.map((practice) => (
              <article
                key={practice.id}
                className="practice-item"
              >
                <div className="practice-item-icon">
                  {practice.icon}
                </div>

                <div className="practice-item-content">
                  <h3 className="practice-item-title">
                    {practice.title}
                  </h3>

                  <div className="practice-item-meta">
                    <span>
                      {practice.questions} preguntas
                    </span>

                    <span>•</span>

                    <span
                      className={`practice-badge practice-badge-${practice.type}`}
                    >
                      {practice.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="practice-button practice-button-primary"
                  onClick={() => handlePractice(practice)}
                >
                  Practicar
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* SIN RESULTADOS */}
        {filteredTopics.length === 0 && (
          <div className="practice-empty">
            <div className="practice-empty-icon">
              🔍
            </div>

            <h3>No encontramos temas</h3>

            <p>
              Intenta buscar otro tema o selecciona
              una categoría diferente.
            </p>
          </div>
        )}
      </div>

      {/* NAVEGACIÓN INFERIOR */}
      <nav className="practice-bottom-nav">
        <div className="practice-nav-inner">

          <button
            type="button"
            className="practice-nav-item"
            onClick={() => handleNavigation("Inicio")}
          >
            <span>⌂</span>
            <span>Inicio</span>
          </button>

          <button
            type="button"
            className="practice-nav-item active"
            onClick={() => handleNavigation("Práctica")}
          >
            <span>▱</span>
            <span>Práctica</span>
          </button>

          <button
            type="button"
            className="practice-nav-item"
            onClick={() => handleNavigation("Estadísticas")}
          >
            <span>▥</span>
            <span>Estadísticas</span>
          </button>

          <button
            type="button"
            className="practice-nav-item"
            onClick={() => handleNavigation("Ranking")}
          >
            <span>♜</span>
            <span>Ranking</span>
          </button>

          <button
            type="button"
            className="practice-nav-item"
            onClick={() => handleNavigation("Perfil")}
          >
            <span>●</span>
            <span>Perfil</span>
          </button>

        </div>
      </nav>
    </div>
  );
}

export default Practice;