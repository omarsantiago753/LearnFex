import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

import { getResultadosByUsuario } from "../../../repositories/resultRepository";
import { useAuth } from "../../../hooks/useAuth";

const History = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [resultados, setResultados] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadHistorial = async () => {
			if (!user?.uid) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError("");

				const data = await getResultadosByUsuario(user.uid);

				setResultados(data || []);
			} catch (err) {
				console.error("Error al cargar el historial:", err);
				setError("No se pudo cargar el historial.");
			} finally {
				setLoading(false);
			}
		};

		loadHistorial();
	}, [user]);

	const formatDate = (date) => {
		if (!date) return "Sin fecha";

		try {
			let parsedDate = date;

			if (date?.seconds) {
				parsedDate = new Date(date.seconds * 1000);
			}

			const formattedDate = new Date(parsedDate);

			if (Number.isNaN(formattedDate.getTime())) {
				return "Sin fecha";
			}

			return formattedDate.toLocaleDateString("es-CO", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		} catch {
			return "Sin fecha";
		}
	};

	const getResultStatus = (puntaje) => {
		return Number(puntaje ?? 0) >= 60 ? "Aprobado" : "No aprobado";
	};

	const getStatusClass = (puntaje) => {
		return Number(puntaje ?? 0) >= 60
			? "history-status--passed"
			: "history-status--failed";
	};

	const handleOpenResult = (resultadoId) => {
		navigate(`/resultados/${resultadoId}`);
	};

	if (loading) {
		return (
			<main className="history">
				<div className="history-loading">
					<div className="history-spinner"></div>
					<p>Cargando historial...</p>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="history">
				<div className="history-error">
					<div className="history-error-icon">⚠️</div>
					<h2>No se pudo cargar el historial</h2>
					<p>{error}</p>

					<button
						type="button"
						className="history-button history-button--primary"
						onClick={() => window.location.reload()}
					>
						Intentar nuevamente
					</button>
				</div>
			</main>
		);
	}

	if (resultados.length === 0) {
		return (
			<main className="history">
				<div className="history-empty">
					<div className="history-empty-icon">📜</div>

					<h1>Historial</h1>

					<p>Todavía no completaste ningún cuestionario</p>

					<button
						type="button"
						className="history-button history-button--primary"
						onClick={() => navigate("/practica")}
					>
						Realizar cuestionario
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="history">
			<div className="history-container">
				<header className="history-header">
					<div>
						<p className="history-label">MI PROGRESO</p>
						<h1>Historial</h1>
						<p className="history-description">
							Consulta los cuestionarios que has realizado y revisa
							tus resultados.
						</p>
					</div>

					<button
						type="button"
						className="history-practice-button"
						onClick={() => navigate("/practica")}
					>
						Practicar
					</button>
				</header>

				<section className="history-section">
					<div className="history-section-header">
						<div>
							<h2>Resultados anteriores</h2>
							<p>
								Tus cuestionarios aparecen del más reciente al
								más antiguo.
							</p>
						</div>
					</div>

					<div className="history-list">
						{resultados.map((resultado) => (
							<button
								type="button"
								className="history-item"
								key={resultado.id}
								onClick={() => handleOpenResult(resultado.id)}
							>
								<div className="history-item-main">
									<div className="history-item-icon">📝</div>

									<div className="history-item-info">
										<strong>Cuestionario</strong>
										<span>
											{formatDate(resultado.fecha)}
										</span>
									</div>
								</div>

								<div className="history-item-stat">
									<strong>
										{resultado.puntaje ?? 0}%
									</strong>
									<span>Puntaje</span>
								</div>

								<div className="history-item-stat history-item-stat--correct">
									<strong>
										{resultado.respuestasCorrectas ?? 0}
									</strong>
									<span>Correctas</span>
								</div>

								<div className="history-item-stat history-item-stat--incorrect">
									<strong>
										{resultado.respuestasIncorrectas ?? 0}
									</strong>
									<span>Incorrectas</span>
								</div>

								<div className="history-item-status">
									<span
										className={`history-status ${getStatusClass(
											resultado.puntaje,
										)}`}
									>
										{getResultStatus(resultado.puntaje)}
									</span>

									<span className="history-item-arrow">
										→
									</span>
								</div>
							</button>
						))}
					</div>
				</section>
			</div>
		</main>
	);
};

export default History;