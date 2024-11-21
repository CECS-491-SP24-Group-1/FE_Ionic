// SettingsPage.tsx

import React, { useState } from "react";
import { IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import SettingsHeader from "./components/SettingsHeader";
import AccountTab from "./components/AccountTab";
import NotificationsTab from "./components/NotificationsTab";
import AppearanceTab from "./components/AppearanceTab";
import PrivacySecurityTab from "./components/PrivacySecurityTab";

const SettingsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState("account");
	const history = useHistory();

	const handleLogout = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
				method: "POST",
				credentials: "include" // Send cookies along with the request
			});

			if (response.ok) {
				// Remove local storage/session data
				localStorage.removeItem("authToken");
				sessionStorage.removeItem("authToken");

				// Redirect to the login page
				history.push("/");

				console.log("User fully logged out");
			} else {
				console.error("Failed to log out:", await response.text());
			}
			history.push("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<div className="flex min-h-screen bg-primary text-textPrimary dark:bg-primary-light dark:text-textPrimary-light">
			{/* Main Content Area */}
			<div className="flex-1 p-8 bg-secondary text-textPrimary dark:bg-secondary-light dark:text-textPrimary-light rounded-lg">
				{/* Settings Header */}
				<SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

				{/* Conditionally Render Content Based on Active Tab */}
				<div className="mt-6">
					{activeTab === "account" && <AccountTab />}
					{activeTab === "notifications" && <NotificationsTab />}
					{activeTab === "appearance" && <AppearanceTab />}
					{activeTab === "privacySecurity" && <PrivacySecurityTab />}

					<div className="button-container">
						<IonButton className="logout-button" onClick={handleLogout}>
							Logout
						</IonButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
