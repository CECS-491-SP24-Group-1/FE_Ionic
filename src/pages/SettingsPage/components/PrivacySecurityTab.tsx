// PrivacySecurity.tsx

import React from "react";

const PrivacySecurityTab: React.FC = () => {
	return (
		<div className="p-4 bg-backgroundHighlight text-textPrimary dark:bg-backgroundHighlight-light dark:text-textPrimary-light rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
			<p className="text-textSecondary dark:text-textSecondary-light mb-2">
				Manage your privacy and security settings here.
			</p>
			<ul className="list-disc list-inside space-y-2">
				<li className="text-textSecondary dark:text-textSecondary-light">
					Two-Factor Authentication
				</li>
				<li className="text-textSecondary dark:text-textSecondary-light">
					Account Privacy
				</li>
				<li className="text-textSecondary dark:text-textSecondary-light">
					Data Sharing Preferences
				</li>
			</ul>
		</div>
	);
};

export default PrivacySecurityTab;
