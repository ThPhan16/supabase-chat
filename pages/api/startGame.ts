// pages/api/startGame.ts
import { supabaseBrowserClient } from '@/utils/supabase/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabase = supabaseBrowserClient();
  if (req.method === 'POST') {
    const { gameId } = req.body;

    const { error } = await supabase
      .from('games')
      .update({ state: 'in_progress' })
      .eq('id', gameId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
