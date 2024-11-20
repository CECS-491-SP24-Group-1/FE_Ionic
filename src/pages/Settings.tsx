import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./Settings.scss";

const Settings: React.FC = () => {
	/*
	const ks1 = useMemo(() => new KeyStore(), []);
	const ks2 = useMemo(() => new KeyStore(), []);
	const [areEqual, setAreEqual] = useState<boolean>(false);
	*/

	/*
	const x = new KeyStore();
	x.sk;
	*/

	/*
	useEffect(() => {
		setAreEqual(ks1.equals(ks2));
	}, [ks1, ks2]);
	*/

	const history = useHistory();

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const [profilePic, setProfilePic] = useState<string | null>(null);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			console.log("Selected file:", file);
			setProfilePic(URL.createObjectURL(file)); // Temporarily show the image

			// Call the upload function
			await uploadProfilePic(file);
		}
	};

	const uploadProfilePic = async (file: File) => {
		const formData = new FormData();
		formData.append("profilePic", file);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Upload successful:", data);
				// Update profilePic with the server URL if needed
				setProfilePic(data.imageUrl); // Assuming the server returns the URL of the uploaded image
			} else {
				console.error("Failed to upload profile picture.");
			}
		} catch (error) {
			console.error("Error during upload:", error);
		}
	};

	const handleLogout = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
				method: "POST",
				credentials: "include" // Send cookies along with the request
			});

			if (response.ok) {
				// Remove local storage/session data
				localStorage.removeItem("authToken");
				sessionStorage.removeItem("authToken");

				// Redirect to the login page
				history.push("/LandingPage");

				console.log("User fully logged out");
			} else {
				console.error("Failed to log out:", await response.text());
			}
			history.push("/Home");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleProfilePicChange = async (file: File) => {
		const formData = new FormData();
		formData.append("profilePic", file);

		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData
		});

		if (response.ok) {
			console.log("Profile picture updated!");
			// Update UI state
		} else {
			console.error("Failed to update profile picture.");
		}
	};

	return (
		<IonPage>
			<IonContent>
				<div style={{ padding: "1em" }}>
					<h1>Vaultlib sanity check</h1>
					{/* <code>{vaultlib.NewKeyStore().fingerprint}</code> */}
					<p>
						FE URL: <code>{import.meta.env.VITE_API_URL}</code>
						<br></br>
						{/*
						eq: <code>{areEqual.toString()}</code>
						<br></br>
						ks1 fp: <code>{ks1.fingerprint}</code>
						<br></br>
						ks2 fp: <code>{ks2.pk}</code>
						<br></br>
						*/}
					</p>
				</div>

				<div className="button-container">
					{/* Profile Picture Preview */}
					{profilePic && (
						<div className="profile-pic-container">
							<img src={profilePic} alt="Profile" className="profile-pic-preview" />
						</div>
					)}

					{/* Hidden File Input */}
					<input
						type="file"
						//accept="image/*"
						style={{ display: "none" }}
						ref={fileInputRef}
						onChange={handleFileChange}
					/>

					{/* Button */}
					<IonButton className="profile-pic-button" onClick={handleButtonClick}>
						Add/Change Profile Pic
					</IonButton>
				</div>

				<div className="button-container">
					<IonButton className="logout-button" onClick={handleLogout}>
						Logout
					</IonButton>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Settings;
