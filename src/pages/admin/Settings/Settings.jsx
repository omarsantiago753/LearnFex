import { useEffect, useState } from "react";
import "./Settings.css";

import {
  getCatalogoLogros,
  createLogro,
} from "../../../repositories/logroRepository";

const CRITERIOS = ["primer_quiz", "cinco_simulacros", "diez_simulacros"];

const Settings = () => {
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    criterio: CRITERIOS[0],
  });

  // 🔹 Cargar catálogo
  const loadLogros = async () => {
    try {
      const data = await getCatalogoLogros();
      setLogros(data);
    } catch (error) {
      console.error("Error cargando logros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogros();
  }, []);

  // 🔹 Manejo formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion) return;

    try {
      await createLogro(form);

      // refrescar lista
      setForm({
        nombre: "",
        descripcion: "",
        criterio: CRITERIOS[0],
      });

      loadLogros();
    } catch (error) {
      console.error("Error creando logro:", error);
    }
  };

  return (
    <div className="settings">
      <h2 className="settings__title">Configuración de Logros</h2>

      {/* FORMULARIO */}
      <form className="settings__form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del logro"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <select name="criterio" value={form.criterio} onChange={handleChange}>
          {CRITERIOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button type="submit">Crear logro</button>
      </form>

      {/* LISTADO */}
      <div className="settings__list">
        <h3>Catálogo de logros</h3>

        {loading && <p>Cargando...</p>}

        {!loading && logros.length === 0 && <p>No hay logros registrados</p>}

        {logros.map((logro) => (
          <div key={logro.id} className="settings__item">
            <strong>{logro.nombre}</strong>
            <p>{logro.descripcion}</p>
            <span className="badge">{logro.criterio}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
