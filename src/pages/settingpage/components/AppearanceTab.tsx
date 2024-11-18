import React, { useState } from "react";
import {
	IonCard,
	IonCardContent,
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
	IonToggle,
	IonLabel,
	IonItem
} from "@ionic/react";
import DarkModeToggle from "@/components/DarkModeToggle"; // Assuming this component is compatible with Ionic

const AppearanceTab: React.FC = () => {
	const [fontSize, setFontSize] = useState(1); // 0: Small, 1: Medium, 2: Large

	const handleFontSizeChange = (newSize: number) => {
		setFontSize(newSize);
	};

	return (
		<IonCard className="bg-backgroundHighlight text-textPrimary dark:bg-backgroundHighlight-light dark:text-textPrimary-light rounded-lg shadow-md">
			<IonCardContent>
				<h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>

				{/* Theme Toggle */}
				<IonItem
					lines="full"
					className="ion-margin-bottom text-textPrimary dark:text-textPrimary-light">
					<IonLabel>
						<h3 className="text-textPrimary dark:text-textPrimary-light">Dark Mode</h3>
						<p className="text-textSecondary dark:text-textSecondary-light">
							Toggle between light and dark themes.
						</p>
					</IonLabel>
					<DarkModeToggle />
				</IonItem>

				{/* Custom Font Size Slider */}
				<IonGrid>
					<IonRow className="ion-align-items-center">
						<IonCol>
							<IonLabel>
								<h3 className="text-textPrimary dark:text-textPrimary-light">
									Font Size
								</h3>
								<p className="text-textSecondary dark:text-textSecondary-light">
									Adjust the font size for readability.
								</p>
							</IonLabel>
						</IonCol>
						<IonCol size="auto" className="ion-text-right">
							{/* Font Size Buttons */}
							<div className="flex gap-2">
								<IonButton
									fill={fontSize === 0 ? "solid" : "outline"}
									color={fontSize === 0 ? "primary" : "medium"}
									onClick={() => handleFontSizeChange(0)}
									className="rounded-full">
									S
								</IonButton>
								<IonButton
									fill={fontSize === 1 ? "solid" : "outline"}
									color={fontSize === 1 ? "primary" : "medium"}
									onClick={() => handleFontSizeChange(1)}
									className="rounded-full">
									M
								</IonButton>
								<IonButton
									fill={fontSize === 2 ? "solid" : "outline"}
									color={fontSize === 2 ? "primary" : "medium"}
									onClick={() => handleFontSizeChange(2)}
									className="rounded-full">
									L
								</IonButton>
							</div>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonCardContent>
		</IonCard>
	);
};

export default AppearanceTab;
