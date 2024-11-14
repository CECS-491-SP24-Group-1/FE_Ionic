// SettingsPage.tsx

import React from "react";
import Sidebar from "./components/Sidebar";
import SettingsHeader from "./components/SettingsHeader";
import Account from "./components/Account";

const SettingsPage: React.FC = () => {
	return (
		<div className="flex min-h-screen bg-primary text-textPrimary dark:bg-primary-light dark:text-textPrimary-light">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content Area */}
			<div className="flex-1 p-8 bg-secondary text-textPrimary dark:bg-secondary-light dark:text-textPrimary-light rounded-lg">
				{/* Settings Header */}
				<SettingsHeader />

				{/* Account Card */}
				<Account />
			</div>
		</div>
	);
};

export default SettingsPage;
