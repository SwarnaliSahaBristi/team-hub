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

exports.updateMilestoneStatus = async (req, res) => {
  try {
    const { milestoneId, status } = req.body;

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status },
    });

    await updateGoalProgress(updated.goalId);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function updateGoalProgress(goalId) {
  const milestones = await prisma.milestone.findMany({
    where: { goalId },
  });

  const total = milestones.length;
  const completed = milestones.filter(
    (m) => m.status === "DONE"
  ).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  await prisma.goal.update({
    where: { id: goalId },
    data: { progress },
  });
}