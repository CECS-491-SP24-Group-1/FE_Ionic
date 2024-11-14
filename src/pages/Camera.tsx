import React, { useRef, useState, useEffect } from "react";
import { Container, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // MUI icon for capture button
import "./Camera.scss"; // Retain if needed for styling specifics

interface CameraProps {
	onCapture: (imageData: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [photo, setPhoto] = useState<string | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);

	const startCamera = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					setStream(stream);
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
					}
				})
				.catch((err) => {
					console.error("Error accessing the camera: ", err);
				});
		}
	};

	useEffect(() => {
		startCamera();
	}, []);

	const takePicture = () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (canvas && video) {
			const context = canvas.getContext("2d");
			if (context) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				const imageData = canvas.toDataURL("image/png");
				setPhoto(imageData);

				if (stream) {
					stream.getTracks().forEach((track) => track.stop());
				}

				onCapture(imageData);
			}
		}
	};

	const retakePicture = () => {
		setPhoto(null);
		startCamera();
	};

	return (
		<Container
			maxWidth="sm"
			className="flex flex-col items-center justify-center h-screen">
			<div className="camera-container relative flex items-center justify-center w-full h-full">
				{!photo ? (
					<video
						ref={videoRef}
						autoPlay
						playsInline
						className="w-full h-full object-contain"
					/>
				) : (
					<img src={photo} alt="Captured" className="w-full h-full object-contain" />
				)}
				<canvas ref={canvasRef} style={{ display: "none" }}></canvas>
			</div>

			<IconButton
				onClick={photo ? retakePicture : takePicture}
				className="capture-button fixed bottom-10 left-1/2 transform -translate-x-1/2"
				aria-label="capture">
				<CameraAltIcon fontSize="large" />
			</IconButton>
		</Container>
	);
};

export default Camera;
