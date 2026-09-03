import { NavLink } from "react-router-dom";

import {
	FiHome,
	FiBookOpen,
	FiBarChart2,
	FiAward,
	FiUser,
} from "react-icons/fi";

import "./BottomNavigation.css";

function BottomNavigation() {
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

	return (
		<nav className="bottom-navigation">
			{navigationItems.map((item) => (
				<NavLink
					key={item.path}
					to={item.path}
					className={({ isActive }) =>
						`bottom-navigation-item ${
							isActive ? "bottom-navigation-item--active" : ""
						}`
					}
				>
					<span className="bottom-navigation-icon">{item.icon}</span>

					<span className="bottom-navigation-label">{item.label}</span>
				</NavLink>
			))}
		</nav>
	);
}

export default BottomNavigation;
