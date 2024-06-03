import LeaderBoard from '@/components/LeaderBoard';

interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { gameId } = params;

  return (
    <div className='h-screen w-full p-10'>
      <LeaderBoard gameId={gameId} />
    </div>
  );
};

export default page;
