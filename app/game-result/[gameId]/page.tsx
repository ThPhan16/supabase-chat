import LeaderBoard from '@/components/LeaderBoard';
interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { gameId } = params;

  return (
    <div className='h-screen w-full p-10 flex flex-col items-center justify-center bg-blue-900'>
      <h1 className='text-white text-4xl mb-5'>Game Over!</h1>
      <LeaderBoard gameId={gameId} isOver />
    </div>
  );
};

export default page;
