"use client";

import { useMessage } from "@/lib/store/messages";
import { useUser } from "@/lib/store/user";
import { EChannel } from "@/lib/types/event";
import { MousePos } from "@/lib/types/position";
import { stringToColor } from "@/lib/utils";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export type Clients = Record<
  /* id */ string,
  MousePos & { user_name: string; user_id: string }
>;

const cursorId = `cursor`;

const Cursor = () => {
  const user = useUser((state) => state.user);
  const userColor = useMessage((state) => state.color);
  const setColor = useMessage((state) => state.setColor);

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
    return <></>;
  }

  return (
    <div id={cursorId}>
      {Object.values(newClients).map((el, index) => {
        return (
          <div
            key={index}
            style={{
              color: userColor[user.id],
              top: mousePos?.y,
              left: mousePos?.x,
              zIndex: 10,
              width: 20,
              height: 20,
              display: "inline-block",
              position: "absolute",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <svg viewBox="0 0 50 50">
              <polyline
                points="10,50 0,0 50,25 20,25"
                fill={userColor[user.id]}
              />
            </svg>
            <span
              id="cursor-text"
              style={{
                display: " inline-block",
                borderRadius: 16,
                backgroundColor: userColor[user.id],
                fontSize: 14,
                color: "white",
                fontWeight: "bold",
                padding: "4px 8px",
              }}
            >
              {user.user_metadata.user_name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Cursor;
