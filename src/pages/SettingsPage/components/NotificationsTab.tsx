// NotificationSettings.tsx

import React, { useState } from "react";
import { Switch, FormControlLabel, FormGroup } from "@mui/material";

const NotificationsTab: React.FC = () => {
	// State for each notification setting
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [phoneNotifications, setPhoneNotifications] = useState(false);
	const [inAppNotifications, setInAppNotifications] = useState(true);
	const [newsNotifications, setNewsNotifications] = useState(false);
	const [productUpdates, setProductUpdates] = useState(true);

	return (
		<div className="p-4 bg-backgroundHighlight text-textPrimary dark:bg-backgroundHighlight-light dark:text-textPrimary-light rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Notification Settings</h2>

			<FormGroup>
				<FormControlLabel
					control={
						<Switch
							checked={emailNotifications}
							onChange={() => setEmailNotifications(!emailNotifications)}
							color="primary"
						/>
					}
					label="Email Notifications"
				/>
				<FormControlLabel
					control={
						<Switch
							checked={phoneNotifications}
							onChange={() => setPhoneNotifications(!phoneNotifications)}
							color="primary"
						/>
					}
					label="Phone Notifications"
				/>
				<FormControlLabel
					control={
						<Switch
							checked={inAppNotifications}
							onChange={() => setInAppNotifications(!inAppNotifications)}
							color="primary"
						/>
					}
					label="In-App Notifications"
				/>
				<FormControlLabel
					control={
						<Switch
							checked={newsNotifications}
							onChange={() => setNewsNotifications(!newsNotifications)}
							color="primary"
						/>
					}
					label="News Notifications"
				/>
				<FormControlLabel
					control={
						<Switch
							checked={productUpdates}
							onChange={() => setProductUpdates(!productUpdates)}
							color="primary"
						/>
					}
					label="Product Updates"
				/>
			</FormGroup>
		</div>
	);
};

export default NotificationsTab;
