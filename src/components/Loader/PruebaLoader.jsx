// Componente de prueba para mostrar el uso del componente Loader

//Esta parte en la parte superior del archivo Home.jsx
import Loader from "../../../components/Loader/Loader";

//Esta parte en la parte inferior del archivo Home.jsx dentro del return del componente Home
<>
	<Loader />

	<Loader text="Cargando preguntas..." />

	<Loader text="Cargando LearnFex..." fullScreen />
</>;
