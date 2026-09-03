// Componente de prueba para mostrar el uso del componente Card

//Esta parte en la parte superior del archivo Home.jsx
import Card from "../../../components/Card/Card";

//Esta parte en la parte inferior del archivo Home.jsx dentro del return del componente Home
<>
	<Card
		title="Matemáticas"
		subtitle="68% completado"
		onClick={() => console.log("Abrir Matemáticas")}
	>
		<p>Continúa practicando para mejorar tu resultado.</p>
	</Card>

	<Card
		title="Simulacro Saber 11"
		subtitle="5 áreas · condiciones reales de examen"
		variant="primary"
		onClick={() => console.log("Iniciar simulacro")}
	>
		<p>3 horas de duración</p>
	</Card>

	<Card title="Rendimiento general" subtitle="Tu progreso este mes">
		<h2>72%</h2>
		<p>+12% respecto al mes anterior</p>
	</Card>
</>;
