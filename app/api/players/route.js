type Player = {
  id: string;
  username: string;
  uuid: string;
  x: number | null;
  y: number | null;
  z: number | null;
  health: number | null;
  level: number | null;
  createdAt: string;
  updatedAt: string;
};

async function getPlayers(): Promise<Player[]> {
  const res = await fetch("http://localhost:3000/api/player", {
    cache: "no-store", // realtime
  });

  if (!res.ok) {
    throw new Error("Failed to fetch players");
  }

  return res.json();
}

export default async function PlayerPage() {
  const players = await getPlayers();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Minecraft Players</h1>

      <ul className="space-y-3">
        {players.map((p) => (
          <li
            key={p.uuid}
            className="border rounded-xl p-4 shadow-sm space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-semibold">{p.username}</span>
              <span className="text-sm text-muted-foreground">
                Level: {p.level ?? 0}
              </span>
            </div>

            <div className="text-sm">
              ❤️ Health: {p.health ?? 0}
            </div>

            <div className="text-sm">
              📍 Position:{" "}
              {p.x !== null
                ? `${p.x?.toFixed(1)}, ${p.y?.toFixed(1)}, ${p.z?.toFixed(1)}`
                : "Unknown"}
            </div>

            <div className="text-xs text-muted-foreground">
              Last Update: {new Date(p.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
