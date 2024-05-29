// pages/lobby/[gameId].tsx
'use client';
import { FC, useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/utils/supabase/client';

interface PageProps {
  gameId?: string;
}

const UserList: FC<PageProps> = ({ gameId }) => {
  const supabase = supabaseBrowserClient();
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId);

      if (error) {
        setError(error.message);
      } else {
        setPlayers(data);
      }
    };

    fetchPlayers();

    // Optionally, set up real-time updates

    const channels = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'players' },
        (payload) => {
          console.log('Change received!', payload);
          setPlayers((val) => [...val, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>{player.display_name}</li>
      ))}
    </ul>
  );
};

export default UserList;
