// AppearanceTab.tsx

import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import DarkModeToggle from "@/components/DarkModeToggle"; // Importing the DarkModeToggle component

const AppearanceTab: React.FC = () => {
	const [fontSize, setFontSize] = useState(1); // 0: Small, 1: Medium, 2: Large

	const handleFontSizeChange = (newSize: number) => {
		setFontSize(newSize);
	};

	return (
		<div className="p-4 bg-backgroundHighlight bg-opacity-50 text-textPrimary dark:bg-backgroundHighlight-light dark:text-textPrimary-light rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>

			{/* Theme Toggle */}
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				py={2}
				borderBottom="1px solid #ccc">
				<Box>
					<Typography
						variant="subtitle1"
						className="text-textPrimary dark:text-textPrimary-light">
						Dark Mode
					</Typography>
					<Typography
						variant="body2"
						className="text-textSecondary dark:text-textSecondary-light">
						Toggle between light and dark themes.
					</Typography>
				</Box>
				<DarkModeToggle /> {/* Using DarkModeToggle component here */}
			</Box>

			{/* Custom Font Size Slider */}
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				py={2}
				mt={2}>
				{/* Font Size Text */}
				<Box>
					<Typography
						variant="subtitle1"
						className="text-textPrimary dark:text-textPrimary-light">
						Font Size
					</Typography>
					<Typography
						variant="body2"
						className="text-textSecondary dark:text-textSecondary-light">
						Adjust the font size for readability.
					</Typography>
				</Box>

				{/* Custom Slider Buttons */}
				<Box display="flex" gap={1}>
					<Button
						variant={fontSize === 0 ? "contained" : "outlined"}
						color={fontSize === 0 ? "primary" : "inherit"}
						onClick={() => handleFontSizeChange(0)}
						sx={{
							minWidth: 40,
							padding: "4px 8px",
							borderRadius: "20px",
							textTransform: "none"
						}}>
						S
					</Button>
					<Button
						variant={fontSize === 1 ? "contained" : "outlined"}
						color={fontSize === 1 ? "primary" : "inherit"}
						onClick={() => handleFontSizeChange(1)}
						sx={{
							minWidth: 40,
							padding: "4px 8px",
							borderRadius: "20px",
							textTransform: "none"
						}}>
						M
					</Button>
					<Button
						variant={fontSize === 2 ? "contained" : "outlined"}
						color={fontSize === 2 ? "primary" : "inherit"}
						onClick={() => handleFontSizeChange(2)}
						sx={{
							minWidth: 40,
							padding: "4px 8px",
							borderRadius: "20px",
							textTransform: "none"
						}}>
						L
					</Button>
				</Box>
			</Box>
		</div>
	);
};

export default AppearanceTab;
