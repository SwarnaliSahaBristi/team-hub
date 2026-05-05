"use client";

import { useEffect } from "react";
import socket from "../src/lib/socket";

export default function Home() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Frontend connected:", socket.id);
    });

    socket.emit("join-workspace", "test-workspace-id");

    socket.on("goal-created", (data) => {
      console.log("🔥 New goal:", data);
    });

    socket.on("goal-updated", (data) => {
      console.log("🔄 Goal updated:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Team Hub Running 🚀</div>;
}