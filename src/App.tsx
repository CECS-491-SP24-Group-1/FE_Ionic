import React, { useEffect, useState } from 'react';
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
	IonCard,
	IonCardContent,
	IonButton,
	IonText,
	IonHeader,
	IonInput
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { home, camera, settings, logIn, chatbubble } from "ionicons/icons";
import useVaultStore from './stores/vault_store';

// Import pages
import Home from "./pages/Home";
import CameraPage from "./pages/Camera";
import Settings from "./pages/Settings";
import Chat from "./pages/Chats";
import LandingPage from "./pages/LandingPage";
import LRPage from "./pages/login_register/LRPage";
import PostRegister from "./pages/login_register/PostRegister";
import "./App.scss"

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
		setHasVaultUnsavedChanges(vault?.hashcode() === evault?.hash);
	}, [vault, evault])

	return (
		<IonReactRouter>
			<IonTabs>
				

				<IonRouterOutlet>
					<>
						{/* Define routes for each tab */}
						<Route path="/home" component={Home} exact={true} />
						{/* <Route path="/login" component={LRPage} exact={true} /> */}
						<Route path="/camera" component={CameraPage} exact={true} />
						<Route path="/settings" component={Settings} exact={true} />
						<Route path="/chat" component={Chat} exact={true} />
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
				<IonModal isOpen={isSaveVaultModalOpen} onDidDismiss={() => setIsSaveVaultModalOpen(false)} className='custom-modal'>
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
							<IonButton onClick={() => setIsSaveVaultModalOpen(false)} className="close-button">Encrypt Vault</IonButton>
						</IonContent>
					</div>
				</IonModal>
				
				{/* Banner that shows whether there are unsaved vault changes */}
				{hasVaultUnsavedChanges &&
				(<IonCard onClick={() => setIsSaveVaultModalOpen(true)} className='banner'>
					<IonCardContent className='bannerContent'>
						<p>Your vault has unsaved changes. Please click here to re-encrypt your vault.</p>
					</IonCardContent>
				</IonCard>)}
			</IonTabs>
		</IonReactRouter>
	);
};

export default App;
