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
import { home, camera, settings, logIn } from "ionicons/icons";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/login_register/Login";
import CameraPage from "./pages/Camera";
import Settings from "./pages/Settings";
import Register from "./pages/login_register/Register";

const App: React.FC = () => {
	return (
		<IonReactRouter>
			<IonTabs>
				<IonRouterOutlet>
					{/* Define routes for each tab */}
					<Route path="/register" component={Register} exact={true} />
					<Route path="/home" component={Home} exact={true} />
					<Route path="/login" component={Login} exact={true} />
					<Route path="/camera" component={CameraPage} exact={true} />
					<Route path="/settings" component={Settings} exact={true} />
					<Route exact path="/" render={() => <Redirect to="/home" />} />
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

					<IonTabButton tab="home" href="/home">
						<IonIcon icon={home} />
						<IonLabel>Home</IonLabel>
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
