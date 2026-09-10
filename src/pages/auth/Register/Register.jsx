import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as userService from "../../../services/userService";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import "../../../styles/auth.css";

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
	const navigate = useNavigate();

	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [correo, setCorreo] = useState("");
	const [contrasena, setContrasena] = useState("");
	const [confirmarContrasena, setConfirmarContrasena] = useState("");

	const [errorConfirmacion, setErrorConfirmacion] = useState("");
	const [error, setError] = useState("");
	const [enviando, setEnviando] = useState(false);

	const validar = () => {
		if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena) {
			setError("Todos los campos son obligatorios");
			return false;
		}

		if (!REGEX_CORREO.test(correo)) {
			setError("Ingresá un correo con formato válido");
			return false;
		}

		if (contrasena.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres");
			return false;
		}

		if (contrasena !== confirmarContrasena) {
			setErrorConfirmacion("Las contraseñas no coinciden");
			return false;
		}

		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		setError("");
		setErrorConfirmacion("");

		if (!validar()) {
			return;
		}

		setEnviando(true);

		try {
			await userService.registerUser(correo, contrasena, nombre, apellido);

			navigate("/inicio");
		} catch (err) {
			if (err.code === "auth/email-already-in-use") {
				setError("Este correo ya está registrado");
			} else if (err.code === "auth/weak-password") {
				setError("La contraseña es muy débil");
			} else {
				setError("Ocurrió un error, intentá de nuevo");
			}

			setEnviando(false);
		}
	};

	return (
		<main className="auth-page">
			<div className="auth-card">
				<h1 className="auth-title">Crear cuenta</h1>
				<p className="auth-subtitle">Registrate para empezar a practicar</p>

				{error && <p className="auth-error">{error}</p>}

				<form className="auth-form" onSubmit={handleSubmit}>
					<Input
						label="Nombre"
						name="nombre"
						value={nombre}
						onChange={(event) => setNombre(event.target.value)}
						required
						disabled={enviando}
					/>

					<Input
						label="Apellido"
						name="apellido"
						value={apellido}
						onChange={(event) => setApellido(event.target.value)}
						required
						disabled={enviando}
					/>

					<Input
						label="Correo"
						type="email"
						name="correo"
						value={correo}
						onChange={(event) => setCorreo(event.target.value)}
						required
						disabled={enviando}
					/>

					<Input
						label="Contraseña"
						type="password"
						name="contrasena"
						value={contrasena}
						onChange={(event) => setContrasena(event.target.value)}
						required
						disabled={enviando}
					/>

					<Input
						label="Confirmar contraseña"
						type="password"
						name="confirmarContrasena"
						value={confirmarContrasena}
						onChange={(event) => setConfirmarContrasena(event.target.value)}
						required
						disabled={enviando}
						error={errorConfirmacion}
					/>

					<Button type="submit" disabled={enviando}>
						{enviando ? "Creando cuenta..." : "Crear cuenta"}
					</Button>
				</form>

				<div className="auth-links">
					<Link to="/">¿Ya tenés cuenta? Iniciá sesión</Link>
				</div>
			</div>
		</main>
	);
}

export default Register;
