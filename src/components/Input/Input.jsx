import "./Input.css";

function Input({
	label,
	type = "text",
	name,
	value,
	onChange,
	placeholder = "",
	required = false,
	disabled = false,
	error = "",
	className = "",
}) {
	return (
		<div className={`input-group ${className}`}>
			{label && (
				<label className="input-label" htmlFor={name}>
					{label}
				</label>
			)}

			<input
				id={name}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				className={`input ${error ? "input--error" : ""}`}
			/>

			{error && <span className="input-error">{error}</span>}
		</div>
	);
}

export default Input;
