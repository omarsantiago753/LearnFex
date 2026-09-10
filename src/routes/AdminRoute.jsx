import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader/Loader";

function AdminRoute() {
	const { user, rol, loading } = useAuth();

	if (loading) {
		return <Loader text="Verificando sesión..." fullScreen />;
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	if (rol !== "administrador") {
		return <Navigate to="/inicio" replace />;
	}

	return <Outlet />;
}

export default AdminRoute;
