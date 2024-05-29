'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import UserList from '@/components/lobby/UserList';
import JoinGameForm from '@/components/lobby/JoinGameForm';

interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const router = useRouter();
  const { gameId } = params;

  return (
    <div>
      <h1>Lobby</h1>
      <UserList gameId={gameId} />
      <button onClick={() => router.push(`/game/${gameId}`)}>Start Game</button>
    </div>
  );
};

export default page;
