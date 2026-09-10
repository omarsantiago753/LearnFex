import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader/Loader";

function PrivateRoutes() {
	const { user, loading } = useAuth();

	if (loading) {
		return <Loader text="Verificando sesión..." fullScreen />;
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}

export default PrivateRoutes;
