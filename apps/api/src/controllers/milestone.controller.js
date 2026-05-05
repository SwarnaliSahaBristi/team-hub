const prisma = require("../utils/prisma");

// CREATE MILESTONE
exports.createMilestone = async (req, res) => {
  try {
    const { goalId, title, dueDate } = req.body;

    const milestone = await prisma.milestone.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        goalId,
      },
    });

    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MILESTONES BY GOAL
exports.getMilestones = async (req, res) => {
  try {
    const { goalId } = req.params;

    const milestones = await prisma.milestone.findMany({
      where: { goalId },
      orderBy: { createdAt: "asc" },
    });

    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};