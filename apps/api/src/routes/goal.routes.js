const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const workspaceMiddleware = require("../middleware/workspace.middleware");
const goalController = require("../controllers/goal.controller");

// CREATE GOAL
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  goalController.createGoal
);

// GET GOALS (for active workspace)
router.get(
  "/",
  authMiddleware,
  workspaceMiddleware,
  goalController.getGoals
);

module.exports = router;