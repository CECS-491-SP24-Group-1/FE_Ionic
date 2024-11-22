// PrivacySecurity.tsx

import React from "react";

const PrivacySecurityTab: React.FC = () => {
	return (
		<div className="rounded-lg bg-backgroundHighlight bg-opacity-50 p-4 text-textPrimary shadow-md dark:bg-backgroundHighlight-light dark:text-textPrimary-light">
			<h2 className="mb-4 text-xl font-semibold">Privacy & Security</h2>
			<p className="mb-2 text-textSecondary dark:text-textSecondary-light">
				Manage your privacy and security settings here.
			</p>
			<ul className="list-inside list-disc space-y-2">
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
