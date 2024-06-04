import JoinForm from '@/components/join-game/JoinWithUrl';
import UserList from '@/components/lobby/UserList';

interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { gameId } = params;

  return (
    <div className='min-h-[100dvh] w-full flex flex-col justify-center items-center gap-6 bg-blue-900'>
      <div className='bg-shape-square'></div>
      <div className='bg-shape-circle'></div>
      <h1 className='text-4xl font-medium'>Join game</h1>
      <JoinForm gameId={gameId} />
    </div>
  );
};

export default page;
