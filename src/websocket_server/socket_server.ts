import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);

// Create a WebSocket Server attached to the HTTP server
const wss = new WebSocketServer({ server });

// Broadcasts a message to all connected clients
function broadcast(data: string) {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data); // Send message to all open connections
		}
	});
}

// Handle WebSocket connections and messages
wss.on("connection", (ws: WebSocket) => {
	console.log("New client connected");

	// Handle incoming messages from clients
	ws.on("message", (message: string) => {
		console.log(`Received: ${message}`);

		// Broadcast the received message to all clients
		broadcast(message);
	});

	// Handle client disconnection
	ws.on("close", () => {
		console.log("Client disconnected");
	});

	// Send a welcome message to the client that just connected
	ws.send("Welcome to the WebSocket chat server!");
});

// Start the HTTP server
const PORT = 8080;
server.listen(PORT, () => {
	console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
