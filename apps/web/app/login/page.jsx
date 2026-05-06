"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">

      {/* Card (FIXED WIDTH FEEL) */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl text-white p-7">

        {/* Header */}
        <div className="text-center mb-7">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-white/60 mt-2">
            Login to continue to your dashboard
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-white/70 block mb-2">
            Email
          </label>
          <input
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="text-sm text-white/70 block mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={login}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition font-medium shadow-lg"
        >
          Sign in
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-5">
          Don’t have an account?{" "}
          <span className="text-blue-400 cursor-pointer">Sign up</span>
        </p>

      </div>
    </div>
  );
}