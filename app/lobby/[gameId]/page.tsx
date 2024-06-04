import { GameId } from "@/components/lobby/GameId";
import UserList from "@/components/lobby/UserList";

interface PageProps {
  params: {
    gameId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { gameId } = params;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-blue-900">
      <div className="bg-shape-square"></div>
      <div className="bg-shape-circle"></div>
      <GameId gameId={gameId} />
      <ul>
        <span className="font-bold">Rules</span>
        <li>- Each game last 120 seconds</li>
        <li>- For every hit, you have 1 point</li>
        <li>- If you miss 4 times, 1 point will be taken</li>
      </ul>
      <UserList gameId={gameId} />
    </div>
  );
};

export default page;
