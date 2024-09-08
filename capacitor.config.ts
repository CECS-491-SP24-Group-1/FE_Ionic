import {CapacitorConfig} from "@capacitor/cli"

const config: CapacitorConfig = {
	appId: "me.wraith.app",
	appName: "wraithapp",
	webDir: "dist",
	loggingBehavior: "debug",
	android: {
		loggingBehavior: "debug"
	}
}

export default config
