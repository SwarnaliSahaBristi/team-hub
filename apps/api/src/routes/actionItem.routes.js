const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const workspace = require("../middleware/workspace.middleware");

const controller = require("../controllers/actionItem.controller");

router.post("/", auth, workspace, controller.createActionItem);
router.get("/", auth, workspace, controller.getActionItems);
router.patch("/status", auth, workspace, controller.updateActionStatus);

module.exports = router;