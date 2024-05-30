// components/HostGameButton.tsx
"use client";
import { usePalyerId } from "@/lib/store/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const HostGameButton: React.FC = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("host");

  const hostGame = async () => {
    if (!displayName) {
      toast("Please enter name");
      return;
    }

    const response = await fetch("/api/createGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName }),
    });

    const data = await response.json();

    if (data.gameId) {
      router.push(`/lobby/${data.gameId}`);
      if (data.hostId) {
        usePalyerId.getState().setState(data.hostId);
      }
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter your display name"
      />
      <button onClick={hostGame}>Host Game</button>
    </div>
  );
};

export default HostGameButton;
