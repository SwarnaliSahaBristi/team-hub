const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./src/routes/auth.routes");
const authMiddleware = require("./src/middleware/auth.middleware");
const workspaceRoutes = require("./src/routes/workspace.routes");
const workspaceMiddleware = require("./src/middleware/workspace.middleware");
const goalRoutes = require("./src/routes/goal.routes");
const milestoneRoutes = require("./src/routes/milestone.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/milestones", milestoneRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

app.get(
  "/api/workspace/me",
  authMiddleware,
  workspaceMiddleware,
  (req, res) => {
    res.json({
      user: req.user,
      workspaceId: req.workspaceId,
    });
  },
);

const PORT = 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// make io accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-workspace", (workspaceId) => {
    socket.join(workspaceId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
