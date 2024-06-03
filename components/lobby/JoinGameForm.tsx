// components/JoinGameForm.tsx
'use client';
import { usePlayerId } from '@/lib/store/user';
import { resolveObjectURL } from 'buffer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const JoinGameForm: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [displayName, setDisplayName] = useState('');

  const joinGame = async () => {
    if (!roomId) {
      toast.error('Please enter room ID');
      return;
    }

    if (!displayName) {
      toast.error('Please enter name');
      return;
    }

    const response = await fetch('/api/joinGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId, displayName }),
    });

    if (response.status === 403) {
      toast.error('Too late, game started');
      return;
    }

    const data = await response.json();

    if (data.success && data.playerId) {
      router.push(`/lobby/${roomId}`);
      usePlayerId.getState().setState(data.playerId);
      localStorage.setItem('playerId', data.playerId);
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className='flex flex-col justify-center items-center '>
      <h2 className='text-blue-800 font-medium text-lg p-2'>Join game</h2>
      <input
        type='text'
        className='border border-gray-300 rounded bg-white p-2 w-full mb-4 text-gray-500 focus:border-gray-500'
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder='Enter room ID'
      />

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
      >
        Join Game
      </button>
    </div>
  );
};

export default JoinGameForm;
