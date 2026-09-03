import "./Button.css";

function Button({
	children,
	onClick,
	type = "button",
	variant = "primary",
	disabled = false,
	className = "",
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`button button--${variant} ${className}`}
		>
			{children}
		</button>
	);
}

export default Button;
