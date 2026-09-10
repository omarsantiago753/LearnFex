import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

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

export const createUserProfile = async (uid, { nombre, apellido, correo, rol = "estudiante" }) => {
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
