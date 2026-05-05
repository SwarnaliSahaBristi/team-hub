const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const workspaceMiddleware = require("../middleware/workspace.middleware");
const milestoneController = require("../controllers/milestone.controller");

// CREATE MILESTONE
router.post(
  "/",
  authMiddleware,
  workspaceMiddleware,
  milestoneController.createMilestone
);

// GET MILESTONES BY GOAL
router.get(
  "/:goalId",
  authMiddleware,
  workspaceMiddleware,
  milestoneController.getMilestones
);

router.patch(
  "/status",
  authMiddleware,
  workspaceMiddleware,
  milestoneController.updateMilestoneStatus
);

module.exports = router;