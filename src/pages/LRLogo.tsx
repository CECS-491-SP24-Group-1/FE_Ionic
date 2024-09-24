import logo from "../assets/images/glock_primary.svg";

const LRLogo: React.FC = () => {
	return (
		<div className="logo-container">
			<img src={logo} alt="Wraith Logo" className="logo" />
			<p className="logo-text">Wraith</p>
		</div>
	);
};

export default LRLogo;
