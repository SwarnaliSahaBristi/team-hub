const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth.routes");
const authMiddleware = require("./src/middleware/auth.middleware");
const workspaceRoutes = require("./src/routes/workspace.routes");
const workspaceMiddleware = require("./src/middleware/workspace.middleware");
const goalRoutes = require("./src/routes/goal.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/goals", goalRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
