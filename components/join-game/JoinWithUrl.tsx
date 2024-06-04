// pages/lobby/[gameId].tsx
'use client';
import { usePlayerId } from '@/lib/store/user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  gameId?: string;
}

const JoinForm: FC<Props> = ({ gameId }) => {
  const supabase = supabaseBrowserClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [displayName, setDisplayName] = useState('');

  const joinGame = async () => {
    setIsLoading(true);
    const response = await fetch('/api/joinGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId: gameId, displayName }),
    });

    if (response.status === 403) {
      toast.error('Too late, game started');
      setIsLoading(false);

      return;
    }

    const data = await response.json();

    if (data.success && data.playerId) {
      router.push(`/lobby/${gameId}`);
      usePlayerId.getState().setState(data.playerId);
      localStorage.setItem('playerId', data.playerId);
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
    setIsLoading(false);
  };

  return (
    <div className='flex flex-col justify-center items-center bg-white rounded-lg p-6'>
      <input
        type='text'
        className='border border-gray-300 rounded bg-white p-2 w-full mb-4 text-gray-500 focus:border-gray-500'
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder='Enter your display name'
      />
      <button
        className='bg-blue-800 hover:bg-blue-700  text-white py-2 px-4 rounded w-full'
        onClick={joinGame}
        disabled={isLoading}
      >
        Join Game
      </button>
    </div>
  );
};

export default JoinForm;
