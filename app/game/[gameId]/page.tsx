import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import UserList from '@/components/lobby/UserList';
import JoinGameForm from '@/components/lobby/JoinGameForm';
import WhackAMole from '@/components/WhackAMole';

interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { gameId } = params;

  return (
    <div className='h-[100dvh] w-full p-1 md:p-10'>
      <WhackAMole />
    </div>
  );
};

export default page;
