// NotificationSettings.tsx

import React, { useState } from "react";
import { Switch, FormGroup, Typography, Box } from "@mui/material";

const NotificationsTab: React.FC = () => {
	// State for each notification setting
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [phoneNotifications, setPhoneNotifications] = useState(false);
	const [inAppNotifications, setInAppNotifications] = useState(true);
	const [newsNotifications, setNewsNotifications] = useState(false);
	const [productUpdates, setProductUpdates] = useState(true);

	return (
		<div className="p-4 bg-backgroundHighlight bg-opacity-50 text-textPrimary dark:bg-backgroundHighlight-light dark:text-textPrimary-light rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Notification Settings</h2>

			<FormGroup>
				{/* Email Notifications */}
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					py={1}
					borderBottom="1px solid #ccc">
					<Box>
						<Typography
							variant="subtitle1"
							className="text-textPrimary dark:text-textPrimary-light">
							Email Notifications
						</Typography>
						<Typography
							variant="body2"
							className="text-textSecondary dark:text-textSecondary-light">
							Receive notifications via email for important updates and reminders.
						</Typography>
					</Box>
					<Switch
						checked={emailNotifications}
						onChange={() => setEmailNotifications(!emailNotifications)}
						color="primary"
					/>
				</Box>

				{/* Phone Notifications */}
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					py={1}
					borderBottom="1px solid #ccc">
					<Box>
						<Typography
							variant="subtitle1"
							className="text-textPrimary dark:text-textPrimary-light">
							Phone Notifications
						</Typography>
						<Typography
							variant="body2"
							className="text-textSecondary dark:text-textSecondary-light">
							Get SMS notifications for urgent updates and actions.
						</Typography>
					</Box>
					<Switch
						checked={phoneNotifications}
						onChange={() => setPhoneNotifications(!phoneNotifications)}
						color="primary"
					/>
				</Box>

				{/* In-App Notifications */}
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					py={1}
					borderBottom="1px solid #ccc">
					<Box>
						<Typography
							variant="subtitle1"
							className="text-textPrimary dark:text-textPrimary-light">
							In-App Notifications
						</Typography>
						<Typography
							variant="body2"
							className="text-textSecondary dark:text-textSecondary-light">
							Show notifications within the app for activity and alerts.
						</Typography>
					</Box>
					<Switch
						checked={inAppNotifications}
						onChange={() => setInAppNotifications(!inAppNotifications)}
						color="primary"
					/>
				</Box>

				{/* News Notifications */}
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					py={1}
					borderBottom="1px solid #ccc">
					<Box>
						<Typography
							variant="subtitle1"
							className="text-textPrimary dark:text-textPrimary-light">
							News Notifications
						</Typography>
						<Typography
							variant="body2"
							className="text-textSecondary dark:text-textSecondary-light">
							Stay updated with the latest news and announcements.
						</Typography>
					</Box>
					<Switch
						checked={newsNotifications}
						onChange={() => setNewsNotifications(!newsNotifications)}
						color="primary"
					/>
				</Box>

				{/* Product Updates */}
				<Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
					<Box>
						<Typography
							variant="subtitle1"
							className="text-textPrimary dark:text-textPrimary-light">
							Product Updates
						</Typography>
						<Typography
							variant="body2"
							className="text-textSecondary dark:text-textSecondary-light">
							Receive updates about new features and improvements.
						</Typography>
					</Box>
					<Switch
						checked={productUpdates}
						onChange={() => setProductUpdates(!productUpdates)}
						color="primary"
					/>
				</Box>
			</FormGroup>
		</div>
	);
};

export default NotificationsTab;
