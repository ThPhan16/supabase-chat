import ChatHeader from "@/components/ChatHeader";
import Main from "@/components/Main";
import InitUser from "@/lib/store/InitUser";
import { supabaseServerClient } from "@/utils/supabase/server";

const Page = async () => {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <div className="h-screen">
      <ChatHeader user={data?.user} />

      <Main user={data?.user} />

      <InitUser user={data?.user} />
    </div>
  );
};

export default Page;
