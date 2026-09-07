// Componente de prueba para mostrar el uso del componente ProgressBar

//Esta parte en la parte superior del archivo Home.jsx
import Card from "../../../components/ProgressBar/ProgressBar";

//Esta parte en la parte inferior del archivo Home.jsx dentro del return del componente Home
<>
	<ProgressBar value={75} label="Matemáticas" />

	<ProgressBar value={60} label="Lectura Crítica" />

	<ProgressBar value={45} label="Inglés" />
</>;
