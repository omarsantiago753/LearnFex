import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../config/firebase";

const CONFIG_GENERAL_ID = "general";

const CONFIGURACION_GENERAL_DEFAULT = {
	nombre: "LearnFex",
	descripcion: "",
	emailSoporte: "",
};

export const getConfiguracionGeneral = async () => {
	const ref = doc(db, "configuracion", CONFIG_GENERAL_ID);

	const snapshot = await getDoc(ref);

	if (!snapshot.exists()) {
		return { ...CONFIGURACION_GENERAL_DEFAULT };
	}

	return {
		id: snapshot.id,
		...snapshot.data(),
	};
};

export const updateConfiguracionGeneral = async (datos) => {
	if (!datos?.nombre) {
		throw new Error("La configuración debe tener un nombre de la aplicación.");
	}

	const ref = doc(db, "configuracion", CONFIG_GENERAL_ID);

	await setDoc(
		ref,
		{
			nombre: datos.nombre,
			descripcion: datos.descripcion ?? "",
			emailSoporte: datos.emailSoporte ?? "",
		},
		{ merge: true },
	);
};
