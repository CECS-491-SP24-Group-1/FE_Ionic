// SettingsHeader.tsx

import React, { useState } from "react";

const SettingsHeader: React.FC = () => {
	const [activeTab, setActiveTab] = useState("personalInfo");

	const tabs = [
		{ id: "account", label: "Account" },
		{ id: "notifications", label: "Notifications" },
		{ id: "appearance", label: "Appearance" },
		{ id: "privacySecurity", label: "Privacy & Security" }
	];

	return (
		<div className="flex flex-col border-b border-borderPrimary dark:border-borderPrimary-light pb-4 mb-6">
			{/* Main Title */}
			<h1 className="text-2xl font-bold text-textPrimary dark:text-textPrimary-light">
				Settings
			</h1>

			{/* Tabs */}
			<div className="flex space-x-8 mt-4">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`bg-transparent font-medium transition-colors duration-200 pb-2 ${
							activeTab === tab.id
								? "text-accent border-b-2 border-accent dark:text-accent-light dark:border-accent-light"
								: "text-textSecondary hover:text-accent dark:text-textSecondary-light dark:hover:text-accent-light"
						}`}>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default SettingsHeader;
