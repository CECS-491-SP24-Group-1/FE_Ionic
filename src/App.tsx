import {
	IonApp,
	IonRouterOutlet,
	IonTabs,
	IonTabBar,
	IonTabButton,
	IonLabel,
	IonIcon
} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import {Route, Redirect} from "react-router-dom";
import {home, camera, settings} from "ionicons/icons";

// Import pages
import Home from "./pages/Home";
import CameraPage from "./pages/Camera";
import Settings from "./pages/Settings";

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						{/* Define routes for each tab */}
						<Route path="/home" component={Home} exact={true} />
						<Route path="/camera" component={CameraPage} exact={true} />
						<Route path="/settings" component={Settings} exact={true} />
						<Route exact path="/" render={() => <Redirect to="/home" />} />
					</IonRouterOutlet>

					{/* Tab Bar for navigation */}
					<IonTabBar slot="bottom">
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
		</IonApp>
	);
};

export default App;
