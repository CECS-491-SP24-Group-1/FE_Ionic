// SettingsPage.tsx

import React, { useState } from "react";
import SettingsHeader from "./components/SettingsHeader";
import AccountTab from "./components/AccountTab";
import NotificationsTab from "./components/NotificationsTab";
import AppearanceTab from "./components/AppearanceTab";
import PrivacySecurityTab from "./components/PrivacySecurityTab";

const SettingsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState("account");

	return (
		<div className="flex min-h-screen bg-primary text-textPrimary dark:bg-primary-light dark:text-textPrimary-light">
			{/* Main Content Area */}
			<div className="flex-1 rounded-lg bg-secondary p-8 text-textPrimary dark:bg-secondary-light dark:text-textPrimary-light">
				{/* Settings Header */}
				<SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

				{/* Conditionally Render Content Based on Active Tab */}
				<div className="mt-6">
					{activeTab === "account" && <AccountTab />}
					{activeTab === "notifications" && <NotificationsTab />}
					{activeTab === "appearance" && <AppearanceTab />}
					{activeTab === "privacySecurity" && <PrivacySecurityTab />}
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
