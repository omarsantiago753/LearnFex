// areaRepository.js

const areas = [
  {
    id: 1,
    name: "Matemáticas",
    description: "Evalúa conocimientos matemáticos y resolución de problemas.",
    icon: "📐",
  },
  {
    id: 2,
    name: "Lectura Crítica",
    description: "Evalúa la comprensión, análisis e interpretación de textos.",
    icon: "📚",
  },
  {
    id: 3,
    name: "Ciencias Naturales",
    description: "Evalúa conocimientos sobre ciencias y fenómenos naturales.",
    icon: "🔬",
  },
  {
    id: 4,
    name: "Sociales y Ciudadanas",
    description: "Evalúa conocimientos sociales, históricos y ciudadanos.",
    icon: "🌎",
  },
  {
    id: 5,
    name: "Inglés",
    description: "Evalúa la comprensión y uso del idioma inglés.",
    icon: "🇬🇧",
  },
];

/**
 * Obtener todas las áreas
 */
export const getAllAreas = () => {
  return areas;
};

/**
 * Obtener un área por su ID
 */
export const getAreaById = (id) => {
  return areas.find((area) => area.id === Number(id)) || null;
};

/**
 * Buscar un área por su nombre
 */
export const getAreaByName = (name) => {
  if (!name) return null;

  return (
    areas.find(
      (area) =>
        area.name.toLowerCase() === name.toLowerCase()
    ) || null
  );
};

/**
 * Obtener únicamente los IDs de las áreas
 */
export const getAreaIds = () => {
  return areas.map((area) => area.id);
};

/**
 * Verificar si existe un área
 */
export const areaExists = (id) => {
  return areas.some(
    (area) => area.id === Number(id)
  );
};

export default {
  getAllAreas,
  getAreaById,
  getAreaByName,
  getAreaIds,
  areaExists,
};