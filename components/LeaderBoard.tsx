"use client";

import { useLeaderboard } from "@/lib/hook/leaderboard";
import { usePlayerId } from "@/lib/store/user";
import { EChannel } from "@/lib/types/event";
import { Database } from "@/lib/types/supabase";
import {
  getFirstTwoLetters,
  sortLeaderboardByPoint,
  stringToColor,
} from "@/lib/utils";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { FC, useEffect } from "react";

interface Props {
  gameId?: string;
}

const LeaderBoard: FC<Props> = ({ gameId }) => {
  const supabase = supabaseBrowserClient();

  const playerId = usePlayerId((s) => s.state.playerId);
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

  if (!data?.length) {
    return (
      <div className="w-full md:w-[20%] border-2 rounded-md h-full p-4 flex flex-col gap-4"></div>
    );
  }

  return (
    <div className="w-full md:w-[20%] border-2 rounded-md h-full p-4 flex flex-col gap-4">
      {data.map((el, index) => {
        return (
          <div key={index} className="flex items-center justify-between gap-2 ">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`min-w-[2rem] min-h-[2rem] rounded-[50%] opacity-100 flex items-center justify-center`}
                style={{ backgroundColor: stringToColor(el.display_name) }}
              >
                <span className="font-bold uppercase">
                  {getFirstTwoLetters(el.display_name)}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {el.display_name}
                </span>
              </div>
            </div>
            <span className="font-semibold">{el.score ?? 0}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderBoard;
