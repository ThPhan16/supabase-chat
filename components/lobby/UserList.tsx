// pages/lobby/[gameId].tsx
"use client";
import { FC, useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { usePlayerId } from "@/lib/store/user";
import { getFirstTwoLetters, stringToColor } from "@/lib/utils";

interface PageProps {
  gameId?: string;
}

const UserList: FC<PageProps> = ({ gameId }) => {
  const supabase = supabaseBrowserClient();
  const playerId =
    usePlayerId((s) => s.state.playerId) || localStorage.getItem("playerId");
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isHost = players.some(
    (player) => player.id === playerId && player.is_host
  );
  const router = useRouter();

  const startGame = async () => {
    try {
      const response = await fetch("/api/startGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error(data.error);
        // Handle error (e.g., show a notification)
      }
    } catch (err) {
      console.error("An error occurred while starting the game:", err);
    }
  };

  useEffect(() => {
    if (!gameId) return;

    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId);

      if (error) {
        setError(error.message);
      } else {
        setPlayers(data);
      }
    };

    fetchPlayers();

    // Optionally, set up real-time updates

    const channels = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          setPlayers((val) => [...val, payload.new]);
        }
      )
      .subscribe();

    const gameChannel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.new.state === "in_progress") {
            router.push(`/game/${gameId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
      supabase.removeChannel(gameChannel);
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="grow m-10 mt-2 w-1/2 p-10 bg-opacity-10 rounded-lg bg-black">
        <ul className="flex flex-wrap gap-3">
          {players.map((player) => (
            <li key={player.id} className="flex gap-3 items-center font-bold">
              <div
                className={`min-w-[2rem] min-h-[2rem] rounded-[50%] opacity-100 flex items-center justify-center`}
                style={{ backgroundColor: stringToColor(player.display_name) }}
              >
                <span className="font-bold uppercase text-sm">
                  {getFirstTwoLetters(player.display_name)}
                </span>
              </div>
              {player.display_name} {player.id === playerId ? "(You)" : ""}
            </li>
          ))}
        </ul>
      </div>
      {isHost ? (
        <button
          className="p-4 mb-8 bg-white rounded text-gray-800 font-bold"
          onClick={startGame}
        >
          Start Game
        </button>
      ) : null}
    </>
  );
};

export default UserList;
