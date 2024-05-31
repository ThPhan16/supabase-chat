import HostGameButton from "@/components/HostGameButton";
import JoinGameForm from "@/components/lobby/JoinGameForm";

const Main = () => {
  return (
    <div className="h-screen">
      <HostGameButton />
      <JoinGameForm />
    </div>
  );
};

export default Main;
