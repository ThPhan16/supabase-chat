import HostGameButton from '@/components/HostGameButton';
import JoinGameForm from '@/components/lobby/JoinGameForm';
import gardenBg from '@/assets/garden.png';
import Image from 'next/image';
import BackgroundIcon from '@/assets/background.svg';

const Main = () => {
  return (
    <div
      className='min-h-screen w-full flex flex-col justify-center items-center gap-10 bg-blue-900 p-2'
      style={
        {
          // backgroundColor: '',
        }
      }
    >
      <h1 className='text-white text-4xl mb-5 '>ES-Whack!</h1>
      <div className='bg-shape-square'></div>
      <div className='bg-shape-circle'></div>
      <div className='w-full md:w-96 h-fit flex flex-col bg-white rounded shadow-lg gap-4 p-6'>
        <HostGameButton />
        <JoinGameForm />
      </div>
    </div>
  );
};

export default Main;
