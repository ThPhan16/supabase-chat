// components/JoinGameForm.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const JoinGameForm: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [displayName, setDisplayName] = useState('');

  const joinGame = async () => {
    const response = await fetch('/api/joinGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId, displayName }),
    });

    const data = await response.json();

    if (data.success && data.playerId) {
      router.push(`/lobby/${roomId}`);
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div>
      <input
        type='text'
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder='Enter room ID'
      />
      <input
        type='text'
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder='Enter your display name'
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
};

export default JoinGameForm;
