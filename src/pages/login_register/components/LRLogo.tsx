import logo from "@assets/images/glock_primary.svg";

const LRLogo: React.FC = () => {
	return (
		<div className="flex h-auto w-[200px] flex-col items-center">
			<img src={logo} alt="Wraith Logo" className="logo" />
			<p className="text-2xl font-bold text-white">Wraith</p>
		</div>
	);
};

export default LRLogo;
