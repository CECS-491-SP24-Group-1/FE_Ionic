import { useState } from "react";
import {
	IonPage,
	IonContent,
	IonInput,
	IonButton,
	IonItem,
	IonLabel
} from "@ionic/react";
import { IonRouterLink } from "@ionic/react";
import axios from "axios";
import { toast } from "react-toastify";
import "./LoginRegister.scss";
import LRLogo from "./LRLogo";

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [pass, setPass] = useState<string>("");
	const [loading, setLoading] = useState(false); // For loading state

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true); //Set loading to true during API request

		//payload to send in request
		const payload = {
			email: email,
			password: pass
		};

		try {
			//send POST request for login
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/login`,
				payload
			);

			//Handle successful login
			const user = response.data;
			toast.success("Welcome bacl, ${user.username}!");
			console.log("User logged in:", user);

			//redirect user using this catch block
		} catch (error: any) {
			//handle errors
			toast.error("Login failed. Please check your credentials.");
			console.error("Error logging in:", error);
		} finally {
			//set loading to fals after request completes
			setLoading(false);
		}
	};

	return (
		<IonPage>
			<IonContent className="login-page">
				<LRLogo></LRLogo>
				<div className="login-container">
					<h2>Login</h2>

					{/* Login Form */}
					<form onSubmit={handleSubmit}>
						{/* Email Input */}
						<IonItem>
							<IonLabel position="stacked">
								Email {email === "" && <span style={{ color: "red" }}>*</span>}
							</IonLabel>
							<IonInput
								type="email"
								value={email}
								onIonChange={(e: CustomEvent) => setEmail(e.detail.value!)}
								required
							/>
						</IonItem>

						{/* Passphrase Input */}
						<IonItem>
							<IonLabel position="stacked">
								Passphrase {pass === "" && <span style={{ color: "red" }}>*</span>}
							</IonLabel>
							<IonInput
								value={pass}
								onIonChange={(e: CustomEvent) => setPass(e.detail.value!)}
								required
							/>
						</IonItem>

						<p className="required-text">
							<span style={{ color: "red" }}>*</span> Required.
						</p>
						{/* Continue Button */}
						<IonButton
							shape="round"
							expand="full"
							type="submit"
							className="continue-button">
							disabled={loading} //Disable button while loading Continue
							{loading ? "Loading in..." : "Continue"}
						</IonButton>

						<p className="forgot-text">
							No account?&nbsp;
							<IonRouterLink
								color="primary"
								routerLink="/register"
								style={{ textDecoration: "none" }}>
								Register now
							</IonRouterLink>
							.
						</p>
					</form>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Login;
