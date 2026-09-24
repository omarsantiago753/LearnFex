import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * 📊 Obtener estadísticas generales de la plataforma
 */
export const getPlatformStats = async () => {
  try {
    // Referencias
    const usuariosRef = collection(db, "usuarios");
    const resultadosRef = collection(db, "resultados");

    // =========================
    // 👥 1. Usuarios activos
    // =========================
    const usuariosSnapshot = await getDocs(usuariosRef);

    const usuariosActivos = usuariosSnapshot.docs.filter(
      (doc) => doc.data().activo === true,
    ).length;

    const totalUsuarios = usuariosSnapshot.size;

    // =========================
    // 📝 2. Pruebas realizadas
    // =========================
    const resultadosSnapshot = await getDocs(resultadosRef);
    const totalPruebas = resultadosSnapshot.size;

    // =========================
    // 📈 3. Promedio por área
    // =========================
    const promediosPorArea = {};

    resultadosSnapshot.docs.forEach((doc) => {
      const data = doc.data();

      const area = data.area || "general";
      const puntaje = data.puntaje || 0;

      if (!promediosPorArea[area]) {
        promediosPorArea[area] = {
          total: 0,
          cantidad: 0,
        };
      }

      promediosPorArea[area].total += puntaje;
      promediosPorArea[area].cantidad += 1;
    });

    // Calcular promedio final
    const promediosFinales = {};

    Object.keys(promediosPorArea).forEach((area) => {
      const { total, cantidad } = promediosPorArea[area];

      promediosFinales[area] = cantidad > 0 ? (total / cantidad).toFixed(2) : 0;
    });

    // =========================
    // 🎯 Resultado final
    // =========================
    return {
      usuarios: {
        total: totalUsuarios,
        activos: usuariosActivos,
      },
      pruebas: {
        total: totalPruebas,
      },
      promediosPorArea: promediosFinales,
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas de la plataforma:", error);
    throw error;
  }
};
