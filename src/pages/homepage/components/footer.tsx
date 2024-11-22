import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-secondary py-10 text-textSecondary">
			<div className="container mx-auto text-center">
				<p className="text-sm">
					Copyright © {new Date().getFullYear()} Wraith Web. All rights reserved.
				</p>
				<p className="mt-1 text-xs">Built with ❤️ by Wraith Team</p>
			</div>
		</footer>
	);
};

export default Footer;
