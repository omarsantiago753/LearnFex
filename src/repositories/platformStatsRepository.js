import { collection, getDocs } from "firebase/firestore";

import { db } from "../config/firebase";

export const getAllUsuarios = async () => {
	const snapshot = await getDocs(collection(db, "usuarios"));

	return snapshot.docs.map((docSnap) => ({
		id: docSnap.id,
		...docSnap.data(),
	}));
};

export const getAllResultados = async () => {
	const snapshot = await getDocs(collection(db, "resultados"));

	return snapshot.docs.map((docSnap) => ({
		id: docSnap.id,
		...docSnap.data(),
	}));
};
