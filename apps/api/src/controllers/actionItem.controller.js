const prisma = require("../utils/prisma");

// CREATE ACTION ITEM
exports.createActionItem = async (req, res) => {
  try {
    const { title, priority, dueDate, goalId } = req.body;

    const item = await prisma.actionItem.create({
      data: {
        title,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        goalId,
        workspaceId: req.workspaceId,
      },
    });

    const io = req.app.get("io");
    io.to(req.workspaceId).emit("action-created", item);

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ACTION ITEMS
exports.getActionItems = async (req, res) => {
  try {
    const items = await prisma.actionItem.findMany({
      where: { workspaceId: req.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS (KANBAN MOVE)
exports.updateActionStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const updated = await prisma.actionItem.update({
      where: { id },
      data: { status },
    });

    const io = req.app.get("io");
    io.to(req.workspaceId).emit("action-updated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};