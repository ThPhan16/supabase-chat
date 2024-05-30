"use client";

import { useLeaderboard } from "@/lib/hook/leaderboard";
import { EChannel } from "@/lib/types/event";
import { Database } from "@/lib/types/supabase";
import { sortLeaderboardByPoint } from "@/lib/utils";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import Image from "next/image";
import { FC, useEffect } from "react";

interface Props {
  gameId?: string;
}

const LeaderBoard: FC<Props> = ({ gameId }) => {
  const supabase = supabaseBrowserClient();

  const { data, setData, fetchLeaderboardData } = useLeaderboard(gameId);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const handleGetLeaderboards = (
    payload:
      | RealtimePostgresInsertPayload<
          Database["public"]["Tables"]["players"]["Row"]
        >
      | RealtimePostgresUpdatePayload<
          Database["public"]["Tables"]["players"]["Row"]
        >
  ) => {
    const newData = [...data]
      .map((el) => {
        if (el.id !== payload.new.id) {
          return el;
        }

        return { ...el, score: payload.new.score };
      })
      .sort(sortLeaderboardByPoint);

    setData(newData);
  };

  useEffect(() => {
    const channel = supabase.channel(EChannel.LEADERBOARD);

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        (payload: any) => {
          handleGetLeaderboards(payload);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [JSON.stringify(data)]);

  return (
    <div className="w-[30%] border-2 rounded-md h-full p-4 flex flex-col gap-4">
      {data.map((el, index) => {
        return (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* <Image
                src={el.profiles.avatar_url ?? ""}
                alt={""}
                width={40}
                height={40}
                className="rounded-full ring-2"
              /> */}
              <span>{el.display_name}</span>
            </div>
            <span>{el.score}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderBoard;
