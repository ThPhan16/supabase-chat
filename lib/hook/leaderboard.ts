import { useState } from 'react';
import { TLeaderboardList } from '../types/leaderboard';
import { toast } from 'sonner';
import { supabaseBrowserClient } from '@/utils/supabase/client';

export const useLeaderboard = (gameId?: string) => {
  const supabase = supabaseBrowserClient();

  const [data, setData] = useState<TLeaderboardList[]>([]);

  const fetchLeaderboardData = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId || '')
      .order('score', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setData(data as TLeaderboardList[]);
  };

  return { data, setData, fetchLeaderboardData };
};
