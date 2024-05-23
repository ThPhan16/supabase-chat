"use client";
import { useUser } from "@/lib/store/user";
import { EChannel } from "@/lib/types/event";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type MousePos = {
  x: number;
  y: number;
};

export type Clients = Record<
  /* id */ string,
  MousePos & { user_name: string; user_id: string }
>;

export default function ChatPresence() {
  const user = useUser((state) => state.user);

  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    const channel = supabase.channel(EChannel.ROOM_PRESENCE);
    channel
      .on("presence", { event: "sync" }, () => {
        let userIds: string[] = [];

        const channelState = channel.presenceState();
        for (const id in channelState) {
          // @ts-ignore
          if (!channelState[id]?.[0]?.user_id) {
            return;
          }

          const currentUser: any = channelState[id][0];

          if (currentUser.user_id === user?.id) {
            return;
          }

          userIds.push(currentUser.user_id);
        }

        setOnlineUsers(userIds.length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
            user_name: user?.user_metadata.user_name,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (!user) {
    return <div className=" h-3 w-1"></div>;
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
        <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
      </div>
    </>
  );
}
