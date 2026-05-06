const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const workspaceController = require("../controllers/workspace.controller");

// CREATE WORKSPACE
router.post("/", authMiddleware, workspaceController.createWorkspace);

// GET WORKSPACES
router.get("/", authMiddleware, workspaceController.getWorkspaces);

router.post("/set-active", authMiddleware, workspaceController.setActiveWorkspace);

module.exports = router;
