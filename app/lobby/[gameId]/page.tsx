import { GameId } from '@/components/lobby/GameId';
import UserList from '@/components/lobby/UserList';

interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { gameId } = params;

  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-blue-900 pb-8'>
      <div className='bg-shape-square'></div>
      <div className='bg-shape-circle'></div>
      <GameId gameId={gameId} />

      <UserList gameId={gameId} />
    </div>
  );
};

export default page;
