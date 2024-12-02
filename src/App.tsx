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
	IonToolbar,
	IonMenu,
	IonHeader,
	IonTitle,
	IonList,
	IonItem,
	IonAvatar,
	IonMenuToggle
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import {
	home,
	camera,
	settings,
	chatbubble,
	warningOutline,
	closeCircleOutline
} from "ionicons/icons";
import useVaultStore from "./stores/vault_store";

// Import pages
import Home from "./pages/homepage/Home";
import CameraPage from "./pages/Camera";
import SettingsPage from "./pages/settingpage/SettingsPage";
import ChatsPage from "./pages/chatpage/ChatsPage";
import AboutPage from "./pages/aboutpage/AboutPage";
import FriendsPage from "./pages/friendspage/FriendsPage";
import Sidebar from "./components/Sidebar";
import "./App.scss";

const App: React.FC = () => {
	// Handles the state of the vault saving modal
	const [isSaveVaultModalOpen, setIsSaveVaultModalOpen] = useState(false);

	// Determines whether the vault has unsaved changes
	const [hasVaultUnsavedChanges, setHasVaultUnsavedChanges] = useState(false);

	// State to control sidebar expansion
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

	// Vault state
	const { vault, evault, setEVault } = useVaultStore((state) => ({
		vault: state.vault,
		evault: state.evault,
		setEVault: state.setEVault
	}));

	/* This handles the state of the banner. If the vault hash differs from the encrypted
	 * vault hash, open a modal that saves the new vault state and re-encrypts it. */
	useEffect(() => {
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

	// Dark Mode initialization
	useEffect(() => {
		// Initialize dark mode based on localStorage or system preference
		const savedPreference = localStorage.getItem("isDarkMode");
		let isDarkMode: boolean;

		if (savedPreference !== null) {
			isDarkMode = JSON.parse(savedPreference) as boolean;
		} else {
			// Fallback to system preference
			isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		}

		// Apply the dark mode class to the document root
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

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
								Your vault has unsaved changeXs. Please click here to re-encrypt your
								vault.
							</p>
						</div>
					</IonToolbar>
				</div>
			)}
			<IonReactRouter>
				<IonMenu
					side="end"
					contentId="chat-page"
					menuId="chat-menu"
					type="overlay"
					className="bg-transparent">
					<IonHeader className="bg-borderPrimary dark:bg-borderPrimary-light">
						<IonToolbar>
							<div className="flex">
								<IonTitle className="text-lg font-semibold text-textPrimary dark:text-textPrimary-light">
									Chat Information
								</IonTitle>
								<IonMenuToggle>
									<IonButton
										fill="clear"
										className="flex items-center text-accent dark:text-accent-light">
										<IonIcon icon={closeCircleOutline} />
									</IonButton>
								</IonMenuToggle>
							</div>
						</IonToolbar>
					</IonHeader>

					<IonContent>
						<div className="h-full bg-borderPrimary opacity-100 dark:bg-borderPrimary-light">
							<IonList>
								{/* Chat Info */}
								<IonItem className="flex items-center gap-4 py-4">
									<IonAvatar slot="start">
										<img
											src="https://i.pravatar.cc/300"
											alt="Chat Avatar"
											className="h-12 w-12 rounded-full"
										/>
									</IonAvatar>
									<IonLabel>
										<h2 className="font-semibold text-textPrimary dark:text-textPrimary-light">
											Chat Name
										</h2>
										<p className="text-sm text-textPrimary dark:text-textPrimary-light">
											Last message at 10:00 AM
										</p>
									</IonLabel>
								</IonItem>

								{/* Menu Items */}
								<IonItem button className="text-textPrimary dark:text-textPrimary-light">
									<IonLabel className="text-textPrimary dark:text-textPrimary-light">
										Profile
									</IonLabel>
								</IonItem>
								<IonItem button className="text-textPrimary dark:text-textPrimary-light">
									<IonLabel className="text-textPrimary dark:text-textPrimary-light">
										Mute Notifications
									</IonLabel>
								</IonItem>
								<IonItem button className="text-textPrimary dark:text-textPrimary-light">
									<IonLabel className="text-textPrimary dark:text-textPrimary-light">
										Search in Chat
									</IonLabel>
								</IonItem>
								<IonItem button className="text-textPrimary dark:text-textPrimary-light">
									<IonLabel className="text-textPrimary dark:text-textPrimary-light">
										Media, Links, and Docs
									</IonLabel>
								</IonItem>
								<IonItem button className="text-textPrimary dark:text-textPrimary-light">
									<IonLabel className="text-textPrimary dark:text-textPrimary-light">
										Privacy & Support
									</IonLabel>
								</IonItem>
							</IonList>
						</div>
					</IonContent>
				</IonMenu>
			</IonReactRouter>

			<IonReactRouter>
				<div className="flex h-screen">
					{/* Sidebar */}
					<div className="hidden rounded-lg sm:flex">
						<Sidebar
							isExpanded={isSidebarExpanded}
							toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
						/>
					</div>

					{/* Main content */}
					<div
						className="flex-1"
						style={{
							position: "relative"
						}}>
						<IonTabs>
							<IonRouterOutlet>
								<>
									{/* Define routes for each tab */}
									<Route path="/home" component={Home} exact={true} />
									<Route path="/camera" component={CameraPage} exact={true} />
									<Route path="/settings" component={SettingsPage} exact={true} />
									<Route path="/chat" component={ChatsPage} exact={true} />
									<Route path="/about" component={AboutPage} exact={true} />
									<Route path="/friends" component={FriendsPage} />
									<Route exact path="/" render={() => <Redirect to="/chat" />} />
								</>
							</IonRouterOutlet>

							{/* Tab bar at the bottom */}
							<IonTabBar className="flex sm:hidden" slot="bottom">
								<IonTabButton tab="home" href="/home">
									<IonIcon icon={home} />
									<IonLabel>Home</IonLabel>
								</IonTabButton>

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

							{/* Modal for saving vault state */}
							<IonModal
								isOpen={isSaveVaultModalOpen}
								onDidDismiss={() => setIsSaveVaultModalOpen(false)}
								className="custom-modal">
								<div className="modal-wrapper">
									<IonContent className="modal-content">
										<h2>Enter Passphrase</h2>
										<IonInput placeholder="Enter a passphrase" required />
										<IonButton
											onClick={() => setIsSaveVaultModalOpen(false)}
											className="close-button">
											Encrypt Vault
										</IonButton>
									</IonContent>
								</div>
							</IonModal>
						</IonTabs>
					</div>
				</div>
			</IonReactRouter>
		</>
	);
};

export default App;
