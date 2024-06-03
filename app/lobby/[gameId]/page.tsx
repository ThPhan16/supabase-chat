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
  const { gameId } = params;

  return (
    <div
      className='min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-blue-900'
      style={
        {
          // backgroundColor: 'rgb(56, 18, 114)',
        }
      }
    >
      <div className='bg-shape-square'></div>
      <div className='bg-shape-circle'></div>
      <h1 className='text-4xl mt-8'>Lobby</h1>
      <h1 className='text-md font-bold'>
        GameId: <span className='font-normal'>{gameId}</span>
      </h1>
      <ul>
        <span className='font-bold'>Rules</span>
        <li>- Each game last 120 seconds</li>
        <li>- For every hit, you have 1 point</li>
        <li>- If you miss 4 times, 1 point will be taken</li>
      </ul>
      <UserList gameId={gameId} />
    </div>
  );
};

export default page;
