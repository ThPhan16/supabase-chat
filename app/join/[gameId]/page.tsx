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
    <div
      className='min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-blue-900'
      style={
        {
          // backgroundColor: 'rgb(56, 18, 114)',
        }
      }
    >
      <JoinForm gameId={gameId} />
    </div>
  );
};

export default page;
