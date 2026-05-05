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

exports.setActiveWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.body;
    const userId = req.user.userId;

    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId required" });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId },
            },
          },
        ],
      },
    });

    if (!workspace) {
      return res.status(403).json({ error: "Access denied to workspace" });
    }

    res.cookie("activeWorkspace", workspaceId, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ message: "Active workspace set" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
