'use client';

import { useLeaderboard } from '@/lib/hook/leaderboard';
import { usePlayerId } from '@/lib/store/user';
import { EChannel } from '@/lib/types/event';
import { Database } from '@/lib/types/supabase';
import {
  getFirstTwoLetters,
  sortLeaderboardByPoint,
  stringToColor,
} from '@/lib/utils';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

interface Props {
  gameId?: string;
  isOver?: boolean;
  time?: number;
}

const LeaderBoard: FC<Props> = ({ gameId, isOver, time = 0 }) => {
  const supabase = supabaseBrowserClient();
  const router = useRouter();

  const playerId = usePlayerId((s) => s.state.playerId);
  const { data, setData, fetchLeaderboardData } = useLeaderboard(gameId);

  // const [time, setTime] = useState(0); // 90 seconds = 1 minute 30 seconds

  // useEffect(() => {
  //   if (time > 0 && !isOver) {
  //     const timerId = setTimeout(() => {
  //       setTime(time - 1);
  //     }, 1000);

  //     return () => clearTimeout(timerId);
  //   }
  // }, [time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const handleGetLeaderboards = (
    payload:
      | RealtimePostgresInsertPayload<
          Database['public']['Tables']['players']['Row']
        >
      | RealtimePostgresUpdatePayload<
          Database['public']['Tables']['players']['Row']
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
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
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
      <div className='w-full md:w-[20%]  rounded-md h-full p-4 flex flex-col gap-4'>
        <span className='font-normal text-lg'>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className='w-full md:w-[20%]  rounded-md h-full p-4 flex flex-col gap-4 bg-black bg-opacity-10'>
        {!isOver ? (
          <div className='text-2xl mb-4'>{formatTime(time)}</div>
        ) : null}
        {data.map((el, index) => {
          return (
            <div
              key={index}
              className='flex items-center justify-between gap-2 '
            >
              <div className='flex items-center gap-2 overflow-hidden'>
                <div
                  className={`min-w-[2rem] min-h-[2rem] rounded-[50%] opacity-100 flex items-center justify-center`}
                  style={{ backgroundColor: stringToColor(el.display_name) }}
                >
                  <span className='font-bold uppercase text-sm'>
                    {getFirstTwoLetters(el.display_name)}
                  </span>
                </div>
                <div className='flex flex-col gap-4'>
                  <span className='text-ellipsis whitespace-nowrap overflow-hidden'>
                    {el.display_name}
                  </span>
                </div>
              </div>
              <span className='font-semibold'>{el.score ?? 0}</span>
            </div>
          );
        })}
      </div>
      {isOver ? (
        <button
          className='p-4 mb-4 bg-white rounded text-gray-800 font-bold mt-8'
          onClick={() => {
            router.push('/');
            localStorage.clear();
          }}
        >
          Return home
        </button>
      ) : null}
    </>
  );
};

export default LeaderBoard;
