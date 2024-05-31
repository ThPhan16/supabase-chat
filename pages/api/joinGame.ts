// pages/api/createGame.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

type Data = {
  success?: boolean;
  playerId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabase = supabaseBrowserClient();
  if (req.method === 'POST') {
    const { roomId, displayName } = req.body;

    // Check if the game exists
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', roomId)
      .single();

    if (gameError || !game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    if (game.state !== 'waiting') {
      res.status(403).json({ error: 'Game started' });
      return;
    }

    // Add the player to the game
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert([{ game_id: game.id, display_name: displayName }])
      .select()
      .single();

    if (playerError) {
      res.status(500).json({ error: playerError.message });
      return;
    }

    res.status(200).json({ success: true, playerId: player.id });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
