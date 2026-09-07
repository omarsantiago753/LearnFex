import "./Navbar.css";

function Navbar({
	title = "LearnFex",
	subtitle = "",
	logo = null,
	showBack = false,
	onBack,
	actions,
	className = "",
}) {
	return (
		<header className={`navbar ${className}`}>
			<div className="navbar-left">
				{showBack && (
					<button
						type="button"
						className="navbar-back"
						onClick={onBack}
						aria-label="Volver"
					>
						←
					</button>
				)}

				{logo && <div className="navbar-logo">{logo}</div>}

				<div className="navbar-info">
					<h1 className="navbar-title">{title}</h1>

					{subtitle && <p className="navbar-subtitle">{subtitle}</p>}
				</div>
			</div>

			{actions && <div className="navbar-actions">{actions}</div>}
		</header>
	);
}

export default Navbar;
