const prisma = require("../utils/prisma");

exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, accentColor } = req.body;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        accentColor,
        ownerId: req.user.userId,
      },
    });

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const userId = req.user.userId;

    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    });

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
