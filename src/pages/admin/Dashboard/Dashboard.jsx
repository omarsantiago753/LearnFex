import { useEffect, useState } from "react";
import "./Dashboard.css";

import Card from "../../../components/Card/Card";
import Loader from "../../../components/Loader/Loader";
import { getAllQuestions } from "../../../repositories/questionRepository";
import {
	getPlatformStats,
	getRecentActivity,
} from "../../../services/platformStatsService";

// 🔹 Fecha actual formateada en español, sin hardcodear el string.
const formatearFechaHoy = () => {
	const formateador = new Intl.DateTimeFormat("es-CO", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return formateador.format(new Date());
};

// 🔹 Fecha relativa simple ("hace 2 horas") a partir de un Timestamp de Firestore.
const formatearFechaRelativa = (fecha) => {
	if (!fecha?.toDate) {
		return "Fecha desconocida";
	}

	const fechaResultado = fecha.toDate();
	const segundos = Math.round((fechaResultado.getTime() - Date.now()) / 1000);

	const divisiones = [
		{ limite: 60, unidad: "second" },
		{ limite: 3600, unidad: "minute", divisor: 60 },
		{ limite: 86400, unidad: "hour", divisor: 3600 },
		{ limite: 2592000, unidad: "day", divisor: 86400 },
		{ limite: 31536000, unidad: "month", divisor: 2592000 },
		{ limite: Infinity, unidad: "year", divisor: 31536000 },
	];

	const formateadorRelativo = new Intl.RelativeTimeFormat("es", {
		numeric: "auto",
	});

	const segundosAbs = Math.abs(segundos);

	if (segundosAbs < 60) {
		return formateadorRelativo.format(segundos, "second");
	}

	const division = divisiones.find((item) => segundosAbs < item.limite);

	const valor = Math.round(segundos / (division?.divisor ?? 1));

	return formateadorRelativo.format(valor, division?.unidad ?? "second");
};

function Dashboard() {
	const [stats, setStats] = useState(null);
	const [totalPreguntas, setTotalPreguntas] = useState(0);
	const [actividadReciente, setActividadReciente] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let activo = true;

		const cargarDashboard = async () => {
			try {
				const [statsData, preguntas, actividad] = await Promise.all([
					getPlatformStats(),
					getAllQuestions(),
					getRecentActivity(),
				]);

				if (activo) {
					setStats(statsData);
					setTotalPreguntas(preguntas.length);
					setActividadReciente(actividad);
				}
			} catch (err) {
				console.error("Error cargando el dashboard:", err);

				if (activo) {
					setError("No se pudo cargar la información del dashboard.");
				}
			} finally {
				if (activo) {
					setLoading(false);
				}
			}
		};

		cargarDashboard();

		return () => {
			activo = false;
		};
	}, []);

	if (loading) {
		return <Loader text="Cargando dashboard..." fullScreen />;
	}

	if (error) {
		return (
			<main className="dashboard">
				<p className="dashboard__error">{error}</p>
			</main>
		);
	}

	return (
		<main className="dashboard">
			<header className="dashboard__header">
				<h1 className="dashboard__title">Hola, Admin 👋</h1>

				<p className="dashboard__date">{formatearFechaHoy()}</p>
			</header>

			<section className="dashboard__stats">
				<Card title="Usuarios totales" variant="default">
					<strong className="dashboard__stat-value">
						{stats.totalUsuarios}
					</strong>
				</Card>

				<Card title="Simulacros realizados" variant="default">
					<strong className="dashboard__stat-value">
						{stats.totalPruebas}
					</strong>
				</Card>

				<Card title="Preguntas en banco" variant="default">
					<strong className="dashboard__stat-value">{totalPreguntas}</strong>
				</Card>

				<Card title="Promedio general" variant="highlight">
					<strong className="dashboard__stat-value">
						{stats.promedioGeneral}%
					</strong>
				</Card>
			</section>

			<section className="dashboard__activity">
				<h2 className="dashboard__activity-title">Actividad reciente</h2>

				{actividadReciente.length === 0 ? (
					<p className="dashboard__activity-empty">
						Todavía no hay simulacros registrados.
					</p>
				) : (
					<ul className="dashboard__activity-list">
						{actividadReciente.map((item, index) => (
							<li
								key={`${item.usuarioNombre}-${index}`}
								className="dashboard__activity-item"
							>
								<span className="dashboard__activity-user">
									{item.usuarioNombre}
								</span>

								<span className="dashboard__activity-score">
									{item.puntaje}%
								</span>

								<span className="dashboard__activity-date">
									{formatearFechaRelativa(item.fecha)}
								</span>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}

export default Dashboard;
