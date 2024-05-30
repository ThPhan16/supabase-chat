'use client';
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
  const router = useRouter();
  const { gameId } = params;

  return (
    <div>
      <WhackAMole />
    </div>
  );
};

export default page;
