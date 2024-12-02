import { useState } from "react";
import { IonContent, IonPage } from "@ionic/react";

import LRLogo from "./components/LRLogo";
import Login from "./Login";
import Register from "./Register";

//import "./LRContainer.scss";

/** The parent page for the Login and Register Forms. */
const LRPage: React.FC = () => {
	// Handles the state of whether the user is on the Login or Register page
	const [isLogin, setIsLogin] = useState(true);

	// Flips the state of the page
	const togglePage = () => {
		setIsLogin(!isLogin);
	};

	// Render the background and logo. Whether it's a login or Register form is based off state.
	return (
		<IonPage>
			<IonContent>
				<div className="flex min-h-screen flex-col items-center justify-center gap-6 sm:gap-8 md:flex-row md:gap-16 xl:gap-32">
					<LRLogo></LRLogo>
					{isLogin ? (
						<Login togglePage={togglePage} />
					) : (
						<Register togglePage={togglePage} />
					)}
				</div>
			</IonContent>
		</IonPage>
	);
};

export default LRPage;
