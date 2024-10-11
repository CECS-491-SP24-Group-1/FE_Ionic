import { IonProgressBar } from "@ionic/react";

import "./PassStrength.scss";

interface PassStrengthProps {
	strength: number; //0-3
}

const sdat = {
	names: ["Insecure", "Weak", "Acceptable", "Strong"],
	values: [0.25, 0.5, 0.75, 1.0],
	colors: ["#FF0000", "#FF7F50", "#FFC300", "#66CC66"]
};

/** Constrains the min and max value of the given number to be between 0 and 3. */
function cap(inum: number): number {
	const min = 0;
	const max = 3;
	if (inum < min) return min;
	if (inum > max) return max;
	return inum;
}

const PassStrength: React.FC<PassStrengthProps> = ({ strength }) => {
	return (
		<div className="pw-strength">
			<div className="bar-label">
				<span>Strength:</span>
			</div>
			<div className="bar-container">
				<span>{sdat.names[cap(strength)]}</span>
				<IonProgressBar
					className="bar"
					value={strength === -1 ? 0 : sdat.values[cap(strength)]}
					style={
						{
							"--background": "lightgrey",
							"--progress-background": sdat.colors[cap(strength)]
						} as React.CSSProperties
					}></IonProgressBar>
			</div>
		</div>
	);
};

export default PassStrength;
