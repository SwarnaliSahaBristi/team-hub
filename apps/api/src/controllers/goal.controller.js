const prisma = require("../utils/prisma");

// CREATE GOAL
exports.createGoal = async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    const goal = await prisma.goal.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        workspaceId: req.workspaceId,
        ownerId: req.user.userId,     
      },
    });

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL GOALS (for active workspace)
exports.getGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        workspaceId: req.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGoalStatus = async (req, res) => {
  try {
    const { goalId, status } = req.body;

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};