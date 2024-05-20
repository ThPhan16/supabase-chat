"use client";
import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { UserState } from "@/lib/store/user";

export default function ChatHeader({ user }: { user: UserState["user"] }) {
  const router = useRouter();

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
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
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
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
    </div>
  );
}
