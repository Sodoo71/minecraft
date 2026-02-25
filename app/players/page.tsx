"use client";

import { useEffect, useState } from "react";

interface Player {
  id: number;
  username: string;
  health: number;
  level: number;
  lastUpdate: string;
}

export default function Dashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Өгөгдлийг DB-ээс татах функц
  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players");
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Дата татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3 секунд тутамд өгөгдлийг автоматаар шинэчлэх (Polling)
  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Minecraft Player Stats</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-left bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Тоглогч</th>
                <th className="p-4">HP (Health)</th>
                <th className="p-4">Level</th>
                <th className="p-4">Сүүлийн шинэчлэл</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{player.username}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-red-500 h-3 rounded-full"
                          style={{ width: `${(player.health / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span>{player.health}/20</span>
                    </div>
                  </td>
                  <td className="p-4">{player.level}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(player.lastUpdate).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Тоглогч одоогоор алга.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
