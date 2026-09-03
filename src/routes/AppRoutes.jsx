import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login/Login";
import Register from "../pages/auth/Register/Register";
import Home from "../pages/student/Home/Home";
import Practice from "../pages/student/Practice/Practice";
import Statistics from "../pages/student/Statistics/Statistics";
import Ranking from "../pages/student/Ranking/Ranking";
import Profile from "../pages/student/Profile/Profile";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />

			<Route path="/registro" element={<Register />} />

			<Route path="/inicio" element={<Home />} />

			<Route path="/practica" element={<Practice />} />

			<Route path="/estadisticas" element={<Statistics />} />

			<Route path="/ranking" element={<Ranking />} />

			<Route path="/perfil" element={<Profile />} />
		</Routes>
	);
}

export default AppRoutes;
