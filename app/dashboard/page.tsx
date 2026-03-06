'use client';
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/players");
      const data = await res.json();
      setPlayers(data);
    };

    load();
    const i = setInterval(load, 10000);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-bold mb-2">Server Status</h3>
          <p>
            Status: <span className="text-green-500">Online</span>
          </p>
          <div className="mt-2 space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Start
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded">
              Restart
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Stop
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-2">Players Online</h3>
          <ul className="space-y-1">
            <li>Player1</li>
            <li>Player2</li>
            <li>Player3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}