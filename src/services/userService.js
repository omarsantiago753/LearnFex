import * as authServices from "./authServices";
import * as userRepository from "../repositories/userRepository";

export const registerUser = async (email, password, nombre, apellido) => {
	const credenciales = await authServices.register(email, password);

	await userRepository.createUserProfile(credenciales.user.uid, {
		nombre,
		apellido,
		correo: email,
	});

	return {
		uid: credenciales.user.uid,
		rol: "estudiante",
	};
};

export const getUserProfile = (uid) => {
	return userRepository.getUserById(uid);
};

export const updateUserProfile = (uid, changes) => {
	return userRepository.updateUserProfile(uid, changes);
};
