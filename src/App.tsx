import React, { useEffect, useState } from "react";
import {
	BottomNavigation,
	BottomNavigationAction,
	Toolbar,
	Typography,
	Modal,
	Button,
	TextField
} from "@mui/material";
import { Route, Redirect, useHistory } from "react-router-dom";
import { CameraAlt, Settings, Chat, Warning } from "@mui/icons-material";
import useVaultStore from "./stores/vault_store";

// Import pages
import Home from "./pages/Home";
import CameraPage from "./pages/Camera";
import SettingsPage from "./pages/settingpage/SettingsPage";
import ChatsPage from "./pages/chatpage/ChatsPage";
import LandingPage from "./pages/LandingPage";
import Sidebar from "./components/Sidebar"; // Assuming Sidebar is in a components folder
import "./App.scss";

const App: React.FC = () => {
	const history = useHistory();
	const [isSaveVaultModalOpen, setIsSaveVaultModalOpen] = useState(false);
	const [hasVaultUnsavedChanges, setHasVaultUnsavedChanges] = useState(false);

	const { vault, evault, setEVault } = useVaultStore((state) => ({
		vault: state.vault,
		evault: state.evault,
		setEVault: state.setEVault
	}));

	useEffect(() => {
		setHasVaultUnsavedChanges(vault?.hashcode() !== evault?.hash);
	}, [vault, evault]);

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--unsaved-changes-banner-height",
			hasVaultUnsavedChanges ? "2em" : "0"
		);
	}, [hasVaultUnsavedChanges]);

	const handleNavigate = (path: string) => {
		history.push(path);
	};

	return (
		<>
			{hasVaultUnsavedChanges && (
				<div
					className="unsaved-changes-banner"
					onClick={() => setIsSaveVaultModalOpen(true)}>
					<Toolbar className="bannerContent">
						<Warning />
						<Typography>
							Your vault has unsaved changes. Click here to re-encrypt.
						</Typography>
					</Toolbar>
				</div>
			)}

			<div className="app-layout flex">
				{/* Sidebar for larger screens */}
				<div className="hidden md:flex">
					<Sidebar />
				</div>

				{/* Main content */}
				<div className="flex-1">
					<Route path="/home" component={Home} exact />
					<Route path="/camera" component={CameraPage} exact />
					<Route path="/settings" component={SettingsPage} exact />
					<Route path="/chat" component={ChatsPage} exact />
					<Route path="/LandingPage" component={LandingPage} exact />
					<Route exact path="/" render={() => <Redirect to="/chat" />} />
				</div>

				{/* Bottom navigation for mobile */}
				<div className="md:hidden fixed bottom-0 w-full">
					<BottomNavigation
						value={history.location.pathname}
						onChange={(event, newValue) => handleNavigate(newValue)}
						showLabels>
						<BottomNavigationAction label="Chat" icon={<Chat />} value="/chat" />
						<BottomNavigationAction label="Camera" icon={<CameraAlt />} value="/camera" />
						<BottomNavigationAction
							label="Settings"
							icon={<Settings />}
							value="/settings"
						/>
					</BottomNavigation>
				</div>
			</div>

			{/* Modal for vault encryption */}
			<Modal open={isSaveVaultModalOpen} onClose={() => setIsSaveVaultModalOpen(false)}>
				<div className="modal-content">
					<Typography variant="h6">Enter Passphrase</Typography>
					<TextField placeholder="Enter passphrase" type="password" fullWidth />
					<Button onClick={() => setIsSaveVaultModalOpen(false)}>Encrypt Vault</Button>
				</div>
			</Modal>
		</>
	);
};

export default App;
