import React, { useEffect, useState } from "react";
import {
	IonApp,
	IonRouterOutlet,
	IonTabs,
	IonTabBar,
	IonTabButton,
	IonLabel,
	IonIcon,
	IonModal,
	IonContent,
	IonButton,
	IonInput,
	IonToolbar
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { camera, settings, chatbubble, warningOutline } from "ionicons/icons";
import useVaultStore from "./stores/vault_store";

// Import pages
// TODO: suffix other pages name to match ChatsPage
import Home from "./pages/Home";
import CameraPage from "./pages/Camera";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import ChatsPage from "./pages/ChatsPage";
import LandingPage from "./pages/LandingPage";
import "./App.scss";

const App: React.FC = () => {
	// Handles the state of the vault saving modal
	const [isSaveVaultModalOpen, setIsSaveVaultModalOpen] = useState(false);

	// Determines whether the vault has unsaved changes
	const [hasVaultUnsavedChanges, setHasVaultUnsavedChanges] = useState(false);

	//Vault state
	const { vault, evault, setEVault } = useVaultStore((state) => ({
		vault: state.vault,
		evault: state.evault,
		setEVault: state.setEVault
	}));

	/* This handles the state of the banner. If the vault hash differs from the encrypted
	 * vault hash, open a modal that saves the new vault state and re-encrypts it. */
	useEffect(() => {
		//Invert Boolean!
		console.log("vhash: ", vault?.hashcode());
		console.log("evhash:", evault?.hash);
		setHasVaultUnsavedChanges(vault?.hashcode() !== evault?.hash);
	}, [vault, evault]);

	// Adds a gap below the unsaved changes banner when its visible
	useEffect(() => {
		document.documentElement.style.setProperty(
			"--unsaved-changes-banner-height",
			hasVaultUnsavedChanges ? "2em" : "0"
		);
	}, [hasVaultUnsavedChanges]);

	return (
		<>
			{/* Banner that shows whether there are unsaved vault changes */}
			{hasVaultUnsavedChanges && (
				<div
					className="unsaved-changes-banner"
					onClick={() => setIsSaveVaultModalOpen(true)}>
					<IonToolbar className="bannerContent">
						<div className="bannerText">
							<IonIcon icon={warningOutline} />
							<p>
								Your vault has unsaved changes. Please click here to re-encrypt your
								vault.
							</p>
						</div>
					</IonToolbar>
				</div>
			)}

			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						<>
							{/* Define routes for each tab */}
							<Route path="/home" component={Home} exact={true} />
							{/* <Route path="/login" component={LRPage} exact={true} /> */}
							<Route path="/camera" component={CameraPage} exact={true} />
							<Route path="/settings" component={SettingsPage} exact={true} />
							<Route path="/chat" component={ChatsPage} exact={true} />
							<Route path="/LandingPage" component={LandingPage} exact={true} />
							{/* <Route path="/PostRegister" component={PostRegister} exact={true} /> */}
							<Route exact path="/" render={() => <Redirect to="/chat" />} />
						</>
					</IonRouterOutlet>

					{/* Temporary registration page */}
					<IonTabBar slot="bottom">
						{/* <IonTabButton tab="register" href="/register">
							<IonIcon icon={settings} />
							<IonLabel>Register</IonLabel>
						</IonTabButton> */}

						{/*
					<IonTabButton tab="login" href="/login">
						<IonIcon icon={logIn} />
						<IonLabel>Login</IonLabel>
					</IonTabButton>
					*/}

						<IonTabButton tab="chat" href="/chat">
							<IonIcon icon={chatbubble} />
							<IonLabel>Chat</IonLabel>
						</IonTabButton>

						<IonTabButton tab="camera" href="/camera">
							<IonIcon icon={camera} />
							<IonLabel>Camera</IonLabel>
						</IonTabButton>

						<IonTabButton tab="settings" href="/settings">
							<IonIcon icon={settings} />
							<IonLabel>Settings</IonLabel>
						</IonTabButton>
					</IonTabBar>

					{/* Modal that allows the user to save the current vault state */}
					<IonModal
						isOpen={isSaveVaultModalOpen}
						onDidDismiss={() => setIsSaveVaultModalOpen(false)}
						className="custom-modal">
						<div className="modal-wrapper">
							<IonContent className="modal-content">
								<h2>Enter Passphrase</h2>
								<IonInput
									//type={showPassphrase ? "text" : "password"}
									//value={pass}
									//onIonInput={handleInputChange} // Use onIonInput for real-time update
									placeholder="Enter a passphrase"
									//maxlength={maxLen ? maxLen : undefined}
									//disabled={disable}
									required
								/>
								<IonButton
									onClick={() => setIsSaveVaultModalOpen(false)}
									className="close-button">
									Encrypt Vault
								</IonButton>
							</IonContent>
						</div>
					</IonModal>
				</IonTabs>
			</IonReactRouter>
		</>
	);
};

export default App;
