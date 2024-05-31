import HostGameButton from '@/components/HostGameButton';
import JoinGameForm from '@/components/lobby/JoinGameForm';
import gardenBg from '@/assets/garden.png';

const Main = () => {
  console.log(gardenBg);
  return (
    <div
      className='h-screen w-full flex flex-col align-items-center justify-center gap-10'
      style={{
        backgroundImage: `url('${gardenBg.src}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <HostGameButton />
      <JoinGameForm />
    </div>
  );
};

export default Main;
