"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/player/list")
      .then((r) => r.json())
      .then(setPlayers);
  }, []);

  async function ban(name: string) {
    await fetch("/api/player/ban", {
      method: "POST",
      body: JSON.stringify({ target: name, reason: "Admin ban" }),
    });
    alert("Banned: " + name);
  }

  async function kick(name: string) {
    await fetch("/api/player/kick", {
      method: "POST",
      body: JSON.stringify({ target: name, reason: "Admin kick" }),
    });
    alert("Kicked: " + name);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>HP</th>
            <th>Lvl</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p: any) => (
            <tr key={p.uuid}>
              <td>{p.name}</td>
              <td>{p.health}</td>
              <td>{p.level}</td>
              <td className="flex gap-2">
                <Button variant="destructive" onClick={() => ban(p.name)}>
                  Ban
                </Button>
                <Button variant="outline" onClick={() => kick(p.name)}>
                  Kick
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
