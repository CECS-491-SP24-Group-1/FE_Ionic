import React, { useRef, useState, useEffect } from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonIcon,
} from "@ionic/react";
import "./Camera.scss"; // Custom styling

const Camera: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [photo, setPhoto] = useState<string | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);

	// Function to start the camera stream
	const startCamera = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					setStream(stream);  // Store the stream in the state
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
					}
				})
				.catch((err) => {
					console.error("Error accessing the camera: ", err);
				});
		}
	};

	// Request access to the user's camera when the component mounts
	useEffect(() => {
		startCamera();
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

				// Stop the camera stream after taking the picture
				if (stream) {
					stream.getTracks().forEach((track) => track.stop());
				}
			}
		}
	};

	// Function to reset the photo and restart the camera
	const retakePicture = () => {
		setPhoto(null);
		startCamera();  // Restart the camera stream when retaking the picture
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
					<div className="capture-button" onClick={takePicture}></div>
				) : (
					<div className="capture-button" onClick={retakePicture}></div>
				)}
			</IonContent>
		</IonPage>
	);
};

export default Camera;
