import logo from "../assets/images/glock_primary.svg";
import "./LRLogo.scss";

const LRLogo: React.FC = () => {
	return (
		<div className="logo-container flex flex-col items-center">
			<img src={logo} alt="Wraith Logo" className="logo" />
			<p className="logo-text">Wraith</p>
		</div>
	);
};

export default LRLogo;
