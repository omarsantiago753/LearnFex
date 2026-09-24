import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../config/firebase";

const CAMPOS_PROTEGIDOS = ["rol", "estado", "xp", "nivel", "correo"];

export const getUserById = async (uid) => {
  const ref = doc(db, "usuarios", uid);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const createUserProfile = async (
  uid,
  { nombre, apellido, correo, rol = "estudiante" },
) => {
  const ref = doc(db, "usuarios", uid);

  await setDoc(ref, {
    nombre,
    apellido,
    correo,
    rol,
    estado: "activo",
    xp: 0,
    nivel: 1,
    colegio: "",
    fechaRegistro: serverTimestamp(),
  });
};

export const updateUserProfile = async (uid, changes) => {
  const ref = doc(db, "usuarios", uid);

  const cambiosSeguros = { ...changes };

  CAMPOS_PROTEGIDOS.forEach((campo) => {
    delete cambiosSeguros[campo];
  });

  await updateDoc(ref, cambiosSeguros);
};
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase"; // ajusta si tu ruta es distinta

const usuariosRef = collection(db, "usuarios");

/**
 * 📄 Listar usuarios (paginado)
 * @param {number} pageSize
 * @param {DocumentSnapshot} lastDoc
 * @returns {Object} { usuarios, lastDoc }
 */
export const listarUsuariosPaginado = async (pageSize = 10, lastDoc = null) => {
  try {
    let q;

    if (lastDoc) {
      q = query(
        usuariosRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize),
      );
    } else {
      q = query(usuariosRef, orderBy("createdAt", "desc"), limit(pageSize));
    }

    const snapshot = await getDocs(q);

    const usuarios = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return {
      usuarios,
      lastDoc: lastVisible || null,
    };
  } catch (error) {
    console.error("Error listando usuarios:", error);
    throw error;
  }
};
