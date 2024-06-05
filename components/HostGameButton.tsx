// components/HostGameButton.tsx
'use client';
import { usePlayerId } from '@/lib/store/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const HostGameButton: React.FC = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');

  const hostGame = async () => {
    if (!displayName) {
      toast.error('Please enter name');
      return;
    }

    const response = await fetch('/api/createGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName }),
    });

    const data = await response.json();

    if (data.gameId) {
      router.push(`/lobby/${data.gameId}`);
      if (data.hostId) {
        usePlayerId.getState().setState(data.hostId);
        localStorage.setItem('playerId', data.hostId);
      }
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    // <div className='flex items-center justify-center min-h-[100dvh] bg-purple-800'>
    //   <input
    //     type='text'
    //     className='border border-gray-300 rounded p-2 w-full mb-4'
    //     value={displayName}
    //     onChange={(e) => setDisplayName(e.target.value)}
    //     placeholder='Enter your display name'
    //   />
    //   <button
    //     className='bg-black text-white py-2 px-4 rounded w-full'
    //     onClick={hostGame}
    //   >
    //     Host Game
    //   </button>
    // </div>

    <div className='flex items-center justify-center w-full'>
      <div className='bg-white rounded w-full '>
        <h2 className='text-blue-800 font-medium text-lg text-center pb-2'>
          Host game
        </h2>
        <input
          type='text'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder='Enter your display name'
          className='border border-gray-300 rounded bg-white p-2 w-full mb-4 text-gray-500 focus:border-gray-500 '
        />
        <button
          type='submit'
          className='bg-blue-800 hover:bg-blue-700  text-white py-2 px-4 rounded w-full'
          onClick={hostGame}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default HostGameButton;
