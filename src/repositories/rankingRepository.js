import {
	collection,
	doc,
	getCountFromServer,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	startAfter,
	where,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { getUserById } from "./userRepository";

export const getRankingGeneral = async (limite, cursor) => {
	const restricciones = [orderBy("puntajeAcumulado", "desc")];

	if (cursor) {
		restricciones.push(startAfter(cursor));
	}

	if (limite) {
		restricciones.push(limit(limite));
	}

	const ref = query(collection(db, "ranking"), ...restricciones);

	const snapshot = await getDocs(ref);

	const items = snapshot.docs.map((docSnap) => ({
		id: docSnap.id,
		...docSnap.data(),
	}));

	const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

	return { items, lastDoc };
};

export const getPosicionUsuario = async (usuarioId) => {
	const ref = doc(db, "ranking", usuarioId);

	const snapshot = await getDoc(ref);

	if (!snapshot.exists()) {
		return null;
	}

	const datos = snapshot.data();

	const conteoRef = query(
		collection(db, "ranking"),
		where("puntajeAcumulado", ">", datos.puntajeAcumulado)
	);

	const conteoSnapshot = await getCountFromServer(conteoRef);

	return {
		id: snapshot.id,
		...datos,
		posicion: conteoSnapshot.data().count + 1,
	};
};

export const actualizarPosicion = async (usuarioId, puntajeAcumulado) => {
	const ref = doc(db, "ranking", usuarioId);

	// Se denormaliza el perfil acá porque Ranking.jsx no puede leer el
	// perfil de OTROS estudiantes (firestore.rules solo permite leer el
	// propio) — pero cada quien sí puede leer y copiar su propio perfil
	// sobre su propio documento de ranking al actualizar su puntaje.
	const perfil = await getUserById(usuarioId);

	await setDoc(
		ref,
		{
			usuarioId,
			puntajeAcumulado,
			nombre: perfil?.nombre ?? "",
			apellido: perfil?.apellido ?? "",
			nivel: perfil?.nivel ?? 1,
			fechaActualizacion: serverTimestamp(),
		},
		{ merge: true }
	);
};
