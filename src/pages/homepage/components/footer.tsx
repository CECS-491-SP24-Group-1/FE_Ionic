import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="py-8 text-textSecondary dark:bg-primary-light dark:text-textSecondary-light">
			<div className="container mx-auto text-center">
				<p className="text-sm font-medium text-textPrimary dark:text-textPrimary-light">
					Copyright © {new Date().getFullYear()}{" "}
					<span className="text-accent dark:text-textAccent-light">Wraith Web</span>. All
					rights reserved.
				</p>
				<p className="mt-2 text-xs text-textSecondary dark:text-textSecondary-light">
					Built with <span className="text-accent dark:text-textAccent-light">❤️</span> by
					Wraith Team
				</p>
			</div>
		</footer>
	);
};

export default Footer;
