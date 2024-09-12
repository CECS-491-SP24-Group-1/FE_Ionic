import React, { useRef, useState, useEffect } from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonIcon
} from "@ionic/react";
import { camera } from "ionicons/icons";
import "./Camera.css"; // Custom styling if needed

const Camera: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [photo, setPhoto] = useState<string | null>(null);

	// Request access to the user's camera when the component mounts
	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
					}
				})
				.catch((err) => {
					console.error("Error accessing the camera: ", err);
				});
		}
	}, []);

	// Function to capture a photo from the video stream
	const takePicture = () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (canvas && video) {
			const context = canvas.getContext("2d");
			if (context) {
				// Set canvas size to match video size
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				// Draw the current video frame onto the canvas
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				// Get the data URL of the image
				const imageData = canvas.toDataURL("image/png");
				setPhoto(imageData);
			}
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Camera</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="camera-container">
					{/* Video element for displaying the camera stream */}
					{!photo ? (
						<video ref={videoRef} autoPlay playsInline></video>
					) : (
						<img src={photo} alt="Captured" />
					)}

					{/* Hidden canvas to capture the video frame */}
					<canvas ref={canvasRef} style={{ display: "none" }}></canvas>
				</div>

				{/* Button to take the picture */}
				{!photo ? (
					<IonButton expand="full" onClick={takePicture}>
						<IonIcon icon={camera} slot="start" />
						Take Picture
					</IonButton>
				) : (
					<IonButton expand="full" onClick={() => setPhoto(null)}>
						Retake Picture
					</IonButton>
				)}
			</IonContent>
		</IonPage>
	);
};

export default Camera;
