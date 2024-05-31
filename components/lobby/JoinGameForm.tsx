// components/JoinGameForm.tsx
"use client";
import { usePalyerId } from "@/lib/store/user";
import { resolveObjectURL } from "buffer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const JoinGameForm: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [displayName, setDisplayName] = useState("");

  const joinGame = async () => {
    if (!roomId) {
      toast.error("Please enter room ID");
      return;
    }

    if (!displayName) {
      toast.error("Please enter name");
      return;
    }

    const response = await fetch("/api/joinGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, displayName }),
    });

    if (response.status === 403) {
      toast.error("Too late, game started");
      return;
    }

    const data = await response.json();

    if (data.success && data.playerId) {
      router.push(`/lobby/${roomId}`);
      usePalyerId.getState().setState(data.playerId);
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room ID"
      />
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter your display name"
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
};

export default JoinGameForm;
