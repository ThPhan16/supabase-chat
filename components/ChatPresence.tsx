"use client";
import { useUser } from "@/lib/store/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import Cursor from "./Cursor";
import { useMessage } from "@/lib/store/messages";
import { stringToColor } from "@/lib/utils";
import { EChannel } from "@/lib/types/event";

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
  const setColor = useMessage((state) => state.setColor);

  const cursorId = `cursor`;

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [newClients, setNewClients] = useState<Clients>({});

  const [mousePos, setMousePos] = useState<MousePos | null>(null);

  const onMouseMove = (event: MouseEvent) => {
    const cursorDiv = document.getElementById(cursorId!);
    const rect = cursorDiv?.getBoundingClientRect();
    const x = event.clientX - (rect?.left ?? 0) + 10;
    const y = event.clientY - (rect?.top ?? 0) + 60;

    setMousePos({ x, y });
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    const channel = supabase.channel(EChannel.ROOM_PRESENCE);
    channel
      .on("presence", { event: "sync" }, () => {
        let userIds: string[] = [];
        const userOnline: Clients = {};
        const userColor: Record<string, string> = {};

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

          userIds.forEach(() => {
            userOnline[currentUser.user_id] = {
              x: currentUser.x,
              y: currentUser.y,
              user_name: currentUser.user_name,
              user_id: currentUser.user_id,
            };

            userColor[currentUser.user_id] = stringToColor(
              currentUser.user_name
            );
          });
        }

        setNewClients(userOnline);
        setColor(userColor);

        /// remove duplicate
        setOnlineUsers(userIds.length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
            user_name: user?.user_metadata.user_name,
            x: mousePos?.x,
            y: mousePos?.y,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, JSON.stringify(mousePos)]);

  if (!user) {
    return <div className=" h-3 w-1"></div>;
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
        <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
      </div>

      <div id={cursorId}>
        {Object.values(newClients).map((el, index) => {
          return (
            <Cursor
              key={index}
              x={el.x}
              y={el.y}
              name={el.user_name}
              id={el.user_id}
            />
          );
        })}
      </div>
    </>
  );
}
