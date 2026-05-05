"use client";

import { useEffect, useState } from "react";
import socket from "../src/lib/socket";

export default function Dashboard() {
  const activeWorkspaceId = "YOUR_WORKSPACE_ID";
  const [goals, setGoals] = useState([]);

  // 1. FETCH GOALS
  useEffect(() => {
    fetch("http://localhost:5000/api/goals", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setGoals);
  }, []);

  // 2. SOCKET LOGIC (IMPORTANT FIX)
  useEffect(() => {
    if (!activeWorkspaceId) return;

    socket.emit("join-workspace", activeWorkspaceId);

    const handleGoalCreated = (goal) => {
      setGoals((prev) => [goal, ...prev]);
    };

    const handleGoalUpdated = (updatedGoal) => {
      setGoals((prev) =>
        prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
      );
    };

    socket.on("goal-created", handleGoalCreated);
    socket.on("goal-updated", handleGoalUpdated);

    // CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off("goal-created", handleGoalCreated);
      socket.off("goal-updated", handleGoalUpdated);
    };
  }, [activeWorkspaceId]);

  return (
    <div>
      <h1>Dashboard</h1>

      {goals.map((goal) => (
        <div key={goal.id}>
          {goal.title} - {goal.status}
        </div>
      ))}
    </div>
  );
}