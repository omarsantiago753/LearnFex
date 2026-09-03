// src/components/Card/Card.jsx

import "./Card.css";

function Card({
	children,
	title,
	subtitle,
	onClick,
	variant = "default",
	className = "",
}) {
	return (
		<div className={`card card--${variant} ${className}`} onClick={onClick}>
			{title && <h3 className="card-title">{title}</h3>}

			{subtitle && <p className="card-subtitle">{subtitle}</p>}

			<div className="card-content">{children}</div>
		</div>
	);
}

export default Card;
