import ChatAbout from "@/components/ChatAbout";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import InitUser from "@/lib/store/InitUser";
import { supabaseServerClient } from "@/utils/supabase/server";
import React from "react";

const Page = async () => {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col relative">
          <ChatHeader user={data?.user} />

          {data?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>

      <InitUser user={data?.user} />
    </>
  );
};

export default Page;
