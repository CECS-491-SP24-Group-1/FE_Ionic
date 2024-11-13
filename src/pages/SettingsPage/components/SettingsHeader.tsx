// SettingsHeader.tsx

import React, { useState } from "react";

const SettingsHeader: React.FC = () => {
	const [activeTab, setActiveTab] = useState("personalInfo");

	const tabs = [
		{ id: "menteeProfile", label: "Mentee Profile" },
		{ id: "personalInfo", label: "Personal Info" },
		{ id: "loginSecurity", label: "Login & Security" }
	];

	return (
		<div className="flex flex-col border-b border-gray-300 pb-4 mb-6">
			{/* Main Title */}
			<h1 className="text-2xl font-bold text-gray-800">Settings</h1>

			{/* Tabs */}
			<div className="flex space-x-8 mt-4">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`text-gray-600 font-medium ${
							activeTab === tab.id
								? "text-blue-600 border-b-2 border-blue-600"
								: "hover:text-blue-600"
						} pb-2 transition-colors duration-200`}>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default SettingsHeader;
