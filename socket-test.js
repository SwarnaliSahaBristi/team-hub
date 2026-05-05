const { io } = require("socket.io-client");

// connect to your backend
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

// listen for events
socket.on("goal-created", (data) => {
  console.log("🔥 Goal created:", data);
});

socket.on("goal-updated", (data) => {
  console.log("🔄 Goal updated:", data);
});