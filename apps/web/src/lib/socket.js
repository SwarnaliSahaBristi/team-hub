import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["polling", "websocket"],
});

socket.on("connect", () => {
  console.log("Frontend connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Socket error:", err.message);
});

export default socket;