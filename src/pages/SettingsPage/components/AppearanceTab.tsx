import React from "react";

const AppearanceTab: React.FC = () => {
	return (
		<div className="p-4 bg-backgroundHighligsht text-textPrimary dark:bg-backgroundHighlight-light dark:text-textPrimary-light rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
			<p className="text-textSecondary dark:text-textSecondary-light mb-2">
				Customize your appearance preferences here.
			</p>
			<ul className="list-disc list-inside space-y-2">
				<li className="text-textSecondary dark:text-textSecondary-light">
					Theme: Light/Dark
				</li>
				<li className="text-textSecondary dark:text-textSecondary-light">Font Size</li>
				<li className="text-textSecondary dark:text-textSecondary-light">Color Scheme</li>
			</ul>
		</div>
	);
};

export default AppearanceTab;
