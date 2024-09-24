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
import "./LoginRegister.scss";
import LRLogo from "./LRLogo";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle the form submission logic
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
							Continue
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
