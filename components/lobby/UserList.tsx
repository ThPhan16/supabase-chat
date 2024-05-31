// pages/lobby/[gameId].tsx
'use client';
import { FC, useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { usePlayerId } from '@/lib/store/user';

interface PageProps {
  gameId?: string;
}

const UserList: FC<PageProps> = ({ gameId }) => {
  const supabase = supabaseBrowserClient();
  const playerId =
    usePlayerId((s) => s.state.playerId) || localStorage.getItem('playerId');
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isHost = players.some(
    (player) => player.id === playerId && player.is_host
  );
  const router = useRouter();

  const startGame = async () => {
    try {
      const response = await fetch('/api/startGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error(data.error);
        // Handle error (e.g., show a notification)
      }
    } catch (err) {
      console.error('An error occurred while starting the game:', err);
    }
  };

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
          setPlayers((val) => [...val, payload.new]);
        }
      )
      .subscribe();

    const gameChannel = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.new.state === 'in_progress') {
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
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.display_name} {player.id === playerId ? '(You)' : ''}
          </li>
        ))}
      </ul>

      {isHost ? <button onClick={startGame}>Start Game</button> : null}
    </>
  );
};

export default UserList;
