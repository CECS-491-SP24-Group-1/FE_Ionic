import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
	const history = useHistory();

	const navigateToCamera = () => {
		history.push("/camera");
	};

	return (
		<Container maxWidth="sm" style={{ padding: "16px", textAlign: "center" }}>
			{/* Welcome Message */}
			<Typography variant="h4" color="primary" gutterBottom>
				Welcome to Wraith
			</Typography>

			<Typography variant="body1" paragraph>
				Use the tabs below to navigate between different sections of the app.
			</Typography>

			{/* Button to explore other parts */}
			<Button variant="contained" color="primary" fullWidth onClick={navigateToCamera}>
				Go to Camera
			</Button>
		</Container>
	);
};

export default Home;
