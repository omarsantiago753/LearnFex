import { NavLink } from "react-router-dom";

import {
	FiHome,
	FiBookOpen,
	FiBarChart2,
	FiAward,
	FiUser,
} from "react-icons/fi";

import "./Navbar.css";

const navigationItems = [
	{
		label: "Inicio",
		path: "/inicio",
		icon: <FiHome />,
	},
	{
		label: "Práctica",
		path: "/practica",
		icon: <FiBookOpen />,
	},
	{
		label: "Estadísticas",
		path: "/estadisticas",
		icon: <FiBarChart2 />,
	},
	{
		label: "Ranking",
		path: "/ranking",
		icon: <FiAward />,
	},
	{
		label: "Perfil",
		path: "/perfil",
		icon: <FiUser />,
	},
];

function Navbar({
	title = "LearnFex",
	subtitle = "",
	logo = null,
	showBack = false,
	onBack,
	actions,
	className = "",
}) {
	return (
		<header className={`navbar ${className}`}>
			<div className="navbar-left">
				{showBack && (
					<button
						type="button"
						className="navbar-back"
						onClick={onBack}
						aria-label="Volver"
					>
						←
					</button>
				)}

				{logo && <div className="navbar-logo">{logo}</div>}

				<div className="navbar-info">
					<h1 className="navbar-title">{title}</h1>

					{subtitle && <p className="navbar-subtitle">{subtitle}</p>}
				</div>
			</div>

			<nav className="navbar-links">
				{navigationItems.map((item) => (
					<NavLink
						key={item.path}
						to={item.path}
						className={({ isActive }) =>
							`navbar-link ${isActive ? "navbar-link--active" : ""}`
						}
					>
						<span className="navbar-link-icon">{item.icon}</span>

						<span className="navbar-link-label">{item.label}</span>
					</NavLink>
				))}
			</nav>

			{actions && <div className="navbar-actions">{actions}</div>}
		</header>
	);
}

export default Navbar;
