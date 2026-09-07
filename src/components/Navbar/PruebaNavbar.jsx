// Componente de prueba para mostrar el uso del componente Navbar

//Esta parte en la parte superior del archivo Home.jsx
import Navbar from "../../../components/Navbar/Navbar";

//Esta parte en la parte inferior del archivo Home.jsx dentro del return del componente Home

<>
	<Navbar title="LearnFex" subtitle="Prepárate para Saber 11" logo="L" />

	<Navbar title="LearnFex" subtitle="Preparación Saber 11" logo="🎓" />

	<Navbar
		title="Inicio"
		subtitle="Continúa con tu preparación"
		logo="L"
		actions={
			<button
				className="navbar-action-button"
				onClick={() => console.log("Notificaciones")}
			>
				🔔
			</button>
		}
	/>

	<Navbar
		title="Matemáticas"
		subtitle="Álgebra y funciones"
		showBack
		onBack={() => navigate(-1)}
	/>
</>;
