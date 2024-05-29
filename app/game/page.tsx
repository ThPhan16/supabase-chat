import ChatHeader from '@/components/ChatHeader';
import Main from '@/components/Main';
import WhackAMole from '@/components/WhackAMole';
import InitUser from '@/lib/store/InitUser';
import { supabaseServerClient } from '@/utils/supabase/server';

const Page = async () => {
  return (
    <div className='h-screen'>
      <WhackAMole />
    </div>
  );
};

export default Page;
