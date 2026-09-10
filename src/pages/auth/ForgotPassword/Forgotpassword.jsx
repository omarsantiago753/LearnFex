import { useState } from "react";
import { Link } from "react-router-dom";

import * as authServices from "../../../services/authServices";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import "../../../styles/auth.css";

const MENSAJE_EXITO =
	"Si el correo está registrado, te enviamos las instrucciones para restablecer tu contraseña.";

function ForgotPassword() {
	const [correo, setCorreo] = useState("");
	const [mensajeExito, setMensajeExito] = useState("");
	const [error, setError] = useState("");
	const [enviando, setEnviando] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		setError("");
		setMensajeExito("");
		setEnviando(true);

		try {
			await authServices.resetPassword(correo);

			setMensajeExito(MENSAJE_EXITO);
		} catch (err) {
			if (err.code === "auth/user-not-found") {
				setMensajeExito(MENSAJE_EXITO);
			} else if (err.code === "auth/invalid-email") {
				setError("Ingresá un correo con formato válido");
			} else {
				setError("Ocurrió un error, intentá de nuevo");
			}
		} finally {
			setEnviando(false);
		}
	};

	return (
		<main className="auth-page">
			<div className="auth-card">
				<h1 className="auth-title">Recuperar contraseña</h1>
				<p className="auth-subtitle">
					Ingresá tu correo y te enviaremos instrucciones para restablecerla
				</p>

				{error && <p className="auth-error">{error}</p>}
				{mensajeExito && <p className="auth-success">{mensajeExito}</p>}

				<form className="auth-form" onSubmit={handleSubmit}>
					<Input
						label="Correo"
						type="email"
						name="correo"
						value={correo}
						onChange={(event) => setCorreo(event.target.value)}
						required
						disabled={enviando}
					/>

					<Button type="submit" disabled={enviando}>
						{enviando ? "Enviando..." : "Enviar instrucciones"}
					</Button>
				</form>

				<div className="auth-links">
					<Link to="/">Volver al inicio de sesión</Link>
				</div>
			</div>
		</main>
	);
}

export default ForgotPassword;
