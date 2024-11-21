import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="py-10 bg-secondary text-textSecondary">
			<div className="container mx-auto text-center">
				<p className="text-sm">
					Copyright © {new Date().getFullYear()} Wraith Web. All rights reserved.
				</p>
				<p className="text-xs mt-1">
					Built with ❤️ by{" "}
					<a
						href="https://yourwebsite.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-textAccent hover:underline">
						Your Team
					</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
