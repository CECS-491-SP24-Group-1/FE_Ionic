import React, { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { IonIcon } from "@ionic/react";
import { syncOutline, ellipseOutline, closeOutline } from "ionicons/icons";
import "./Camera.scss";

const CameraPage: React.FC = () => {
	const [photo, setPhoto] = useState<string | null>(null);

	const takePicture = async () => {
		try {
			const image = await Camera.getPhoto({
				quality: 90,
				allowEditing: false,
				resultType: CameraResultType.Uri,
				source: CameraSource.Camera
			});

			setPhoto(image.webPath || null);
		} catch (error) {
			console.error("Error taking picture: ", error);
		}
	};

	const retakePicture = () => {
		setPhoto(null);
	};

	const toggleCamera = async () => {
		// Capacitor Camera doesn't have a direct method to switch cameras
		console.log("Nothing interesting happens.");
	};

	return (
		<div className="camera-container">
			{photo ? (
				<div className="photo-container">
					<img src={photo} alt="Captured" className="photo" />
					<button className="close-button" onClick={retakePicture}>
						<IonIcon icon={closeOutline} />
					</button>
				</div>
			) : (
				<div className="camera-view">
					<button className="flip-button" onClick={toggleCamera}>
						<IonIcon icon={syncOutline} />
					</button>
					<button className="snap-button" onClick={takePicture}>
						<IonIcon icon={ellipseOutline} />
					</button>
				</div>
			)}
		</div>
	);
};

export default CameraPage;
