import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

/**
 * 📄 Obtener todos los usuarios (paginado)
 * @param {DocumentSnapshot|null} cursor
 * @param {number} pageSize
 */
export const getAllUsers = async (cursor = null, pageSize = 10) => {
  const usuariosRef = collection(db, "usuarios");

  let q;

  if (cursor) {
    q = query(
      usuariosRef,
      orderBy("fechaRegistro", "desc"),
      startAfter(cursor),
      limit(pageSize),
    );
  } else {
    q = query(usuariosRef, orderBy("fechaRegistro", "desc"), limit(pageSize));
  }

  const snapshot = await getDocs(q);

  const users = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));

  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return {
    users,
    cursor: lastDoc,
  };
};
