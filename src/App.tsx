import {
	IonApp,
	IonRouterOutlet,
	IonTabs,
	IonTabBar,
	IonTabButton,
	IonLabel,
	IonIcon
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { home, camera, settings, logIn, chatbubble } from "ionicons/icons";

// Import pages
import Home from "./pages/Home";
import CameraPage from "./pages/Camera";
import Settings from "./pages/Settings";
import Chat from "./pages/Chats";
import LRPage from "./pages/login_register/LRPage";
import PostRegister from "./pages/login_register/PostRegister";

const App: React.FC = () => {
	return (
		<IonReactRouter>
			<IonTabs>
				<IonRouterOutlet>
					{/* Define routes for each tab */}
					<Route path="/home" component={Home} exact={true} />
					<Route path="/login" component={LRPage} exact={true} />
					<Route path="/camera" component={CameraPage} exact={true} />
					<Route path="/settings" component={Settings} exact={true} />
					<Route path="/chat" component={Chat} exact={true} />
					<Route path="/PostRegister" component={PostRegister} exact={true} />
					<Route exact path="/" render={() => <Redirect to="/login" />} />
				</IonRouterOutlet>

				{/* Temporary registration page */}
				<IonTabBar slot="bottom">
					{/* <IonTabButton tab="register" href="/register">
							<IonIcon icon={settings} />
							<IonLabel>Register</IonLabel>
						</IonTabButton> */}

					<IonTabButton tab="login" href="/login">
						<IonIcon icon={logIn} />
						<IonLabel>Login</IonLabel>
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
			</IonTabs>
		</IonReactRouter>
	);
};

export default App;