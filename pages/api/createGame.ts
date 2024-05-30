// pages/api/createGame.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseBrowserClient } from "@/utils/supabase/client";

type Data = {
  gameId?: string;
  hostId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const supabase = supabaseBrowserClient();
    const { displayName } = req.body;

    // Create a new game
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert([{ state: "waiting" }])
      .select()
      .single();

    if (gameError) {
      res.status(500).json({ error: gameError.message });
      return;
    }

    // Add the host player to the game
    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert([{ game_id: game.id, display_name: displayName, is_host: true }])
      .select()
      .single();

    if (playerError) {
      res.status(500).json({ error: playerError.message });
      return;
    }

    res.status(200).json({ gameId: game.id, hostId: player.id });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
