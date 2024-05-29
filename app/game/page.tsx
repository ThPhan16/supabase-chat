import ChatHeader from '@/components/ChatHeader';
import HostGameButton from '@/components/HostGameButton';
import Main from '@/components/Main';
import WhackAMole from '@/components/WhackAMole';
import JoinGameForm from '@/components/lobby/JoinGameForm';
import InitUser from '@/lib/store/InitUser';
import { supabaseServerClient } from '@/utils/supabase/server';

const Page = () => {
  return (
    <div className='h-screen'>
      <HostGameButton />
      <JoinGameForm />
    </div>
  );
};

export default Page;
