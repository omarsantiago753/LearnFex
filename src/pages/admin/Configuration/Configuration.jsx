import { useEffect, useState } from "react";

import {
	getConfiguracionGeneral,
	updateConfiguracionGeneral,
} from "../../../repositories/configRepository";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Loader from "../../../components/Loader/Loader";
import "./Configuration.css";

function Configuration() {
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [emailSoporte, setEmailSoporte] = useState("");

	const [cargando, setCargando] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [guardado, setGuardado] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const cargarConfiguracion = async () => {
			try {
				const configuracion = await getConfiguracionGeneral();

				setNombre(configuracion.nombre ?? "");
				setDescripcion(configuracion.descripcion ?? "");
				setEmailSoporte(configuracion.emailSoporte ?? "");
			} catch {
				setError("No se pudo cargar la configuración, intentá de nuevo");
			} finally {
				setCargando(false);
			}
		};

		cargarConfiguracion();
	}, []);

	if (cargando) {
		return <Loader text="Cargando configuración..." fullScreen />;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		setGuardando(true);
		setGuardado(false);
		setError("");

		try {
			await updateConfiguracionGeneral({ nombre, descripcion, emailSoporte });

			setGuardado(true);
		} catch (err) {
			setError(err.message || "No se pudo guardar la configuración, intentá de nuevo");
		} finally {
			setGuardando(false);
		}
	};

	return (
		<main className="configuration-page">
			<h1 className="configuration-title">Configuración general</h1>
			<p className="configuration-subtitle">
				Información general de la aplicación visible para los usuarios.
			</p>

			{guardado && (
				<p className="configuration-success">Guardado ✓</p>
			)}
			{error && <p className="configuration-error">{error}</p>}

			<form className="configuration-form" onSubmit={handleSubmit}>
				<Input
					label="Nombre de la aplicación"
					name="nombre"
					value={nombre}
					onChange={(event) => setNombre(event.target.value)}
					disabled={guardando}
					required
				/>

				<Input
					label="Descripción"
					name="descripcion"
					value={descripcion}
					onChange={(event) => setDescripcion(event.target.value)}
					disabled={guardando}
				/>

				<Input
					label="Email de soporte"
					name="emailSoporte"
					type="email"
					value={emailSoporte}
					onChange={(event) => setEmailSoporte(event.target.value)}
					disabled={guardando}
				/>

				<Button type="submit" disabled={guardando}>
					{guardando ? "Guardando..." : "Guardar cambios"}
				</Button>
			</form>
		</main>
	);
}

export default Configuration;
