import "./Loader.css";

function Loader({
	text = "Cargando...",
	size = "medium",
	fullScreen = false,
	showText = true,
}) {
	return (
		<div
			className={`loader-container ${
				fullScreen ? "loader-container--fullscreen" : ""
			}`}
		>
			<div
				className={`loader loader--${size}`}
				role="status"
				aria-label={text}
			/>

			{showText && <p className="loader-text">{text}</p>}
		</div>
	);
}

export default Loader;
