// SettingsHeader.tsx

import React from "react";

interface SettingsHeaderProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ activeTab, setActiveTab }) => {
	const tabs = [
		{ id: "account", label: "Account" },
		{ id: "notifications", label: "Notifications" },
		{ id: "appearance", label: "Appearance" },
		{ id: "privacySecurity", label: "Privacy & Security" }
	];

	return (
		<div className="mb-6 flex flex-col border-b border-borderPrimary pb-4 dark:border-borderPrimary-light">
			{/* Main Title */}
			<h1 className="text-2xl font-bold text-textPrimary dark:text-textPrimary-light">
				Settings
			</h1>

			{/* Tabs */}
			<div className="mt-4 flex space-x-8">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`bg-transparent pb-2 font-medium transition-colors duration-200 ${
							activeTab === tab.id
								? "border-b-2 border-accent text-accent dark:border-accent-light dark:text-accent-light"
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
