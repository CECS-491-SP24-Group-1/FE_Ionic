// SettingsPage.tsx

import React from "react";
import Sidebar from "./components/Sidebar";
import SettingsHeader from "./components/SettingsHeader";
import ProfileInfoCard from "./components/ProfileInfoCard";
import PersonalInfoList from "./components/PersonalInfoList";

const SettingsPage: React.FC = () => {
	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content Area */}
			<div className="flex-1 p-8">
				{/* Settings Header */}
				<SettingsHeader />

				{/* Profile Info Card */}
				<ProfileInfoCard />

				{/* Personal Information List */}
				<PersonalInfoList />
			</div>
		</div>
	);
};

export default SettingsPage;
