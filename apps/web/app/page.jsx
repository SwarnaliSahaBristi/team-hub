"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  CheckSquare,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import socket from "../src/lib/socket";

export default function Dashboard() {
  const [workspaceId] = useState("cmos5l6ee0001lmalnu9x5kb3");
  const [goals, setGoals] = useState([]);

  // FETCH GOALS
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/goals", {
          credentials: "include",
        });

        const data = await res.json();
        if (Array.isArray(data)) setGoals(data);
        else setGoals([]);
      } catch (err) {
        setGoals([]);
      }
    };

    fetchGoals();
  }, []);

  // SOCKET
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

  // Derived Stats
  const totalGoals = goals.length;
  const inProgressGoals = goals.filter(
    (g) => g.status === "IN_PROGRESS" || g.status === "in_progress"
  ).length;
  const todoGoals = goals.filter(
    (g) => g.status === "TODO" || g.status === "todo"
  ).length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6">
        <div>
          {/* Logo / Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
              T
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 leading-none">
                Team Hub
              </h1>
              <span className="text-xl text-slate-400 font-medium">
                Workspace V2
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50/70 text-indigo-600 rounded-lg cursor-pointer transition">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xl">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition">
              <FolderKanban className="h-4 w-4" />
              <span className="text-xl">Workspaces</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xl">Goals</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition">
              <Bell className="h-4 w-4" />
              <span className="text-xl">Announcements</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition">
              <Settings className="h-4 w-4" />
              <span className="text-xl">Settings</span>
            </div>
          </nav>
        </div>

        {/* Bottom Profile/Logout Area */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-xs text-slate-700">
              SS
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-none text-slate-800">
                Swarnali
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Developer</p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-white/90">
          <div>
            <h2 className="font-semibold text-slate-900 tracking-tight">
              Workspace Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor team alignment and updates in real-time.
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-slate-800 transition active:scale-95 shadow-slate-900/10">
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </button>
        </header>

        {/* CONTENT */}
        <main className="p-8">
          {/* STATS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {/* Stat 1: Total Goals */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Total Goals
                </span>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {totalGoals}
                </h3>
                <span className="text-xs text-slate-500 mt-1 block">
                  All active milestones
                </span>
              </div>
              <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600">
                <BarChart2 className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 2: In Progress */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  In Progress
                </span>
                <h3 className="text-3xl font-bold text-amber-600 mt-2">
                  {inProgressGoals}
                </h3>
                <span className="text-xs text-slate-500 mt-1 block">
                  Tasks being worked on
                </span>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 3: Backlog / To Do */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  To Do
                </span>
                <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                  {todoGoals}
                </h3>
                <span className="text-xs text-slate-500 mt-1 block">
                  In the queue
                </span>
              </div>
              <div className="p-3.5 bg-indigo-50/50 rounded-xl text-indigo-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* GOALS FEED */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              Goals Section
              <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Live updates
              </span>
            </h3>
          </div>

          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 rounded-3xl bg-white/30 text-center">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No goals found</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Once a new milestone is pushed or fetched, it will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                // Status tag colors to match sleek design
                const isCompleted =
                  goal.status?.toLowerCase() === "completed" ||
                  goal.status === "COMPLETED";
                const isInProgress =
                  goal.status?.toLowerCase() === "in_progress" ||
                  goal.status === "IN_PROGRESS";

                return (
                  <div
                    key={goal.id}
                    className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge / Indicator bar on card */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] tracking-wider uppercase font-extrabold text-slate-300">
                          Goal #{goal.id?.substring(0, 6) || "..."}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : isInProgress
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                          }`}
                        >
                          {goal.status || "TODO"}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition">
                        {goal.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 mt-5 pt-4 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Due: {goal.dueDate || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}