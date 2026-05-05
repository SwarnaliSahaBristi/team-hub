const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const workspaceController = require("../controllers/workspace.controller");

// CREATE WORKSPACE
router.post("/", authMiddleware, workspaceController.createWorkspace);

router.post("/set-active", authMiddleware, workspaceController.setActiveWorkspace)

// GET WORKSPACES
router.get("/", authMiddleware, workspaceController.getWorkspaces);

module.exports = router;
