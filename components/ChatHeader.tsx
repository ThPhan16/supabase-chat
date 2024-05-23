"use client";
import { UserState, useUser } from "@/lib/store/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { Button } from "./ui/button";
import { ETab, useTab } from "@/lib/store/tab";
import { useEffect } from "react";

export default function ChatHeader({ user }: { user: UserState["user"] }) {
  const clearUser = useUser((state) => state.clearUser);
  const { tab, setTab } = useTab((state) => state);
  const router = useRouter();

  useEffect(() => {
    const [_, currentTab] = window.location.hash.split("#");

    if (!currentTab) {
      window.location.replace(`${window.location.origin}#${ETab.CHAT}`);
    }

    if (currentTab && currentTab !== ETab.CHAT) {
      setTab(currentTab as ETab);
    }
  }, []);

  const handleLoginWithGithub = () => {
    const supabase = supabaseBrowserClient();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = supabaseBrowserClient();
    await supabase.auth.signOut();
    clearUser();
    router.refresh();
  };

  const handleSelectTab = (tab: ETab) => () => {
    setTab(tab);

    window.location.replace(`${window.location.origin}#${tab}`);
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div className="flex items-center justify-between gap-20">
          <div>
            <div className="flex gap-3 items-center">
              <span className="text-xl font-bold">Daily Chat</span>
              <span className="text-xs font-medium pt-1">
                {user?.user_metadata.user_name}
              </span>
            </div>
            <ChatPresence />
          </div>

          {user ? (
            <div className="flex items-center justify-between gap-8">
              <span
                className={`text-xl font-semibold cursor-pointer ${
                  tab === ETab.CHAT ? "border-b-4 border-b-violet-700" : ""
                }`}
                onClick={handleSelectTab(ETab.CHAT)}
              >
                Chat
              </span>
              <span
                className={`text-xl font-semibold cursor-pointer ${
                  tab === ETab.GAME ? "border-b-4 border-b-violet-700" : ""
                }`}
                onClick={handleSelectTab(ETab.GAME)}
              >
                Game
              </span>
            </div>
          ) : null}
        </div>

        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
    </div>
  );
}
