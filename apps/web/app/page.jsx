"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import socket from "../src/lib/socket";
import { useWorkspaceStore } from "../src/store/workspace.store";

export default function Dashboard() {
  // ---------------- GLOBAL STATE ----------------
  const workspaceId = useWorkspaceStore((s) => s.workspaceId);
  const setWorkspaceId = useWorkspaceStore((s) => s.setWorkspaceId);

  // ---------------- LOCAL STATE ----------------
  const [workspaces, setWorkspaces] = useState([]);
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ---------------- FETCH WORKSPACES ----------------
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const res = await fetch("http://localhost:5000/api/workspaces", {
        credentials: "include",
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setWorkspaces(data);

        if (!workspaceId && data.length > 0) {
          setWorkspaceId(data[0].id);
        }
      }
    };

    fetchWorkspaces();
  }, []);

  // ---------------- FETCH GOALS ----------------
  useEffect(() => {
    if (!workspaceId) return;

    const fetchGoals = async () => {
      const res = await fetch("http://localhost:5000/api/goals", {
        credentials: "include",
      });

      const data = await res.json();
      setGoals(Array.isArray(data) ? data : []);
    };

    fetchGoals();
  }, [workspaceId]);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!workspaceId) return;

    socket.emit("join-workspace", workspaceId);

    socket.on("goal-created", (goal) => {
      setGoals((prev) => [goal, ...prev]);
    });

    socket.on("goal-updated", (updated) => {
      setGoals((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g))
      );
    });

    return () => {
      socket.off("goal-created");
      socket.off("goal-updated");
    };
  }, [workspaceId]);

  // ---------------- CREATE GOAL ----------------
  const createGoal = async () => {
    if (!title.trim() || loading) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setGoals((prev) => [data, ...prev]);

      setTitle("");
      setModalOpen(false);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-base-200 via-base-100 to-base-200 overflow-hidden">

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-base-100/60 backdrop-blur-xl border-r border-base-300 flex flex-col"
      >
        <div className="p-5 border-b border-base-300">
          <h1 className="text-xl font-bold">🚀 TeamHub</h1>
          <p className="text-xs opacity-60">SaaS Workspace</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {["Dashboard", "Goals", "Tasks", "Analytics"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.03, x: 5 }}
              className="px-3 py-2 rounded-xl hover:bg-base-200 cursor-pointer"
            >
              {item}
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 px-6 flex items-center justify-between bg-base-100/60 backdrop-blur-xl border-b border-base-300"
        >

          {/* workspace */}
          <select
            className="select select-sm select-bordered"
            value={workspaceId || ""}
            onChange={(e) => setWorkspaceId(e.target.value)}
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* search */}
          <input
            className="input input-sm input-bordered w-64"
            placeholder="Search..."
          />

          {/* button */}
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            + New Goal
          </button>
        </motion.header>

        {/* CONTENT */}
        <main className="p-6 overflow-auto space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total", value: goals.length },
              { label: "Done", value: goals.filter(g => g.status === "DONE").length },
              { label: "Pending", value: goals.filter(g => g.status !== "DONE").length },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-base-100/60 backdrop-blur-xl border border-base-300 rounded-2xl p-4"
              >
                <p className="text-sm opacity-60">{s.label}</p>
                <h2 className="text-2xl font-bold">{s.value}</h2>
              </motion.div>
            ))}
          </div>

          {/* KANBAN */}
          <div className="grid grid-cols-3 gap-5">

            {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
              <div
                key={status}
                className="bg-base-100/60 backdrop-blur-xl border border-base-300 rounded-2xl p-4 min-h-[500px]"
              >
                <h2 className="font-bold mb-4 opacity-70 text-sm">
                  {status}
                </h2>

                {goals
                  .filter(g => g.status === status)
                  .map(goal => (
                    <div
                      key={goal.id}
                      className="bg-base-200/60 p-3 rounded-xl mb-3 hover:scale-[1.02] transition"
                    >
                      <p className="font-semibold">{goal.title}</p>

                      <button
                        className="btn btn-xs mt-2"
                        onClick={async () => {
                          await fetch("http://localhost:5000/api/goals/status", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                              goalId: goal.id,
                              status:
                                status === "TODO"
                                  ? "IN_PROGRESS"
                                  : status === "IN_PROGRESS"
                                  ? "DONE"
                                  : "DONE",
                            }),
                          });
                        }}
                      >
                        Move →
                      </button>
                    </div>
                  ))}
              </div>
            ))}

          </div>
        </main>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100/80 backdrop-blur-xl">

            <h3 className="font-bold text-lg">Create Goal</h3>

            <input
              className="input input-bordered w-full mt-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title..."
            />

            <div className="modal-action">
              <button className="btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={createGoal}
            >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}