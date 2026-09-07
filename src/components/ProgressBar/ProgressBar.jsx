import "./ProgressBar.css";

function ProgressBar({
	value = 0,
	label = "",
	showPercentage = true,
	variant = "primary",
	className = "",
}) {
	const progress = Math.min(Math.max(value, 0), 100);

	return (
		<div className={`progress-group ${className}`}>
			{(label || showPercentage) && (
				<div className="progress-header">
					{label && <span className="progress-label">{label}</span>}

					{showPercentage && (
						<span className="progress-percentage">{progress}%</span>
					)}
				</div>
			)}

			<div className="progress-track">
				<div
					className={`progress-fill progress-fill--${variant}`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

export default ProgressBar;
