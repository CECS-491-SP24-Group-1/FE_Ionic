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
import { home, camera, settings } from "ionicons/icons";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import CameraPage from "./pages/Camera";
import Settings from "./pages/Settings";
import Registration from "./pages/Registration";

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						{/* Define routes for each tab */}
						<Route path="/register" component={Registration} exact={true} />
						<Route path="/home" component={Home} exact={true} />
						<Route path="/login" component = {Login} exact = {true} />
						<Route path="/camera" component={CameraPage} exact={true} />
						<Route path="/settings" component={Settings} exact={true} />
						<Route exact path="/" render={() => <Redirect to="/home" />} />
					</IonRouterOutlet>

					{/* Temporary registration page */}
					<IonTabBar slot="bottom">
						<IonTabButton tab="register" href="/register">
							<IonIcon icon={settings} />
							<IonLabel>Register</IonLabel>
						</IonTabButton>

						<IonTabButton tab="home" href="/home">
							<IonIcon icon={home} />
							<IonLabel>Home</IonLabel>
						</IonTabButton>

						<IonTabButton tab="login" href="/login">
							<IonIcon icon={home} />
							<IonLabel>Login</IonLabel>
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
		</IonApp>
	);
};

export default App;
