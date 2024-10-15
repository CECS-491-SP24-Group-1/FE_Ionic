import React, { useRef, useState, ChangeEvent } from "react";
import { IonButton, IonIcon, IonText } from "@ionic/react";
import { cloudUploadOutline } from "ionicons/icons";

import "./FileInput.scss";

interface FileInputProps {
	onFileSelect?: (file: File | null) => void;
	acceptedExts?: string[];
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect, acceptedExts }) => {
	const [fileName, setFileName] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setFileName(file ? file.name : "");
		if (onFileSelect) {
			onFileSelect(file);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="file-input-wrapper">
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: "none" }}
				accept={acceptedExts ? acceptedExts.join(",") : "*"}
			/>
			<IonButton onClick={handleButtonClick} className="custom-file-input">
				<IonIcon icon={cloudUploadOutline} slot="end" />
				Choose File
			</IonButton>
			<IonText className="file-name">
				{fileName ? fileName : "<no file selected>"}
			</IonText>
		</div>
	);
};

export default FileInput;
