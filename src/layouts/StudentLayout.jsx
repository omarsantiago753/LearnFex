// src/layouts/StudentLayout.jsx

import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";

import "./StudentLayout.css";

function StudentLayout() {
	return (
		<div className="student-layout">
			<Navbar title="LearnFex" subtitle="Preparación Saber 11" logo="L" />

			<main className="student-content">
				<Outlet />
			</main>

			<BottomNavigation />
		</div>
	);
}

export default StudentLayout;
