// components/HostGameButton.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HostGameButton: React.FC = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');

  const hostGame = async () => {
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
    } else {
      console.error(data.error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div>
      <input
        type='text'
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder='Enter your display name'
      />
      <button onClick={hostGame}>Host Game</button>
    </div>
  );
};

export default HostGameButton;
