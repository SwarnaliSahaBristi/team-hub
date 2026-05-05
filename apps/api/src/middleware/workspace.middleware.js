

module.exports = (req, res, next) => {
  const workspaceId = req.cookies.activeWorkspace;

  if (!workspaceId) {
    return res.status(400).json({ error: "No active workspace selected" });
  }

  req.workspaceId = workspaceId;

  next();
};