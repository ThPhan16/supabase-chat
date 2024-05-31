'use client';
import { usePalyerId, useUser } from '@/lib/store/user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useEffect, useRef, useState } from 'react';
import LeaderBoard from './LeaderBoard';
import { EChannel } from '@/lib/types/event';
import { useParams } from 'next/navigation';
import { Database } from '@/lib/types/supabase';
import { channel } from 'diagnostics_channel';

const MOLE_HAMMER_AREA = 'mole-hammer-area';

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();

  const playerId = usePalyerId((s) => s.state.playerId);
  const point = useRef(0);
  const holesData = Array(42).fill(false);

  const holeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [moles, setMoles] = useState<boolean[]>(holesData);

  const param = useParams<{ gameId: string }>();

  const [host, setHost] =
    useState<Database['public']['Tables']['players']['Row']>();

  const getPlayers = async () => {
    if (!param?.gameId) {
      return;
    }

    return await supabase
      .from('players')
      .select('*')
      .eq('game_id', param.gameId);
  };

  // useEffect(() => {
  //   getPlayers().then((res) => {
  //     if (res?.data) {
  //       const hostGame = res.data.find((el) => el.is_host);

  //       console.log('hostGame', hostGame);

  //       if (hostGame) {
  //         setHost(host);
  //       }
  //     }
  //   });
  // }, [param]);
  // console.log(playerId);

  useEffect(() => {
    const element = document.getElementById(MOLE_HAMMER_AREA);
    if (!element) {
      return;
    }

    const onMouseDown = () => {
      element.classList.add('hammer-hit');
    };

    const onMouseUp = () => {
      element.classList.remove('hammer-hit');
    };

    element.addEventListener('mousedown', onMouseDown);

    element.addEventListener('mouseup', onMouseUp);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // useEffect(() => {
  //   if (!param?.gameId) return;

  //   const getHost = async () => {
  //     const { data, error } = await supabase
  //       .from('players')
  //       .select('*')
  //       .eq('game_id', param.gameId);

  //     if (error) {
  //       console.error(error);
  //       return;
  //     }

  //     const hostGame = data?.find((el) => el.is_host);

  //     const channel = supabase.channel('gameplay');

  //     channel
  //       .on('presence', { event: 'sync' }, () => {
  //         // console.log(payload.payload);
  //         // if (host?.id) {
  //         //   return;
  //         // }

  //         // console.log('player');

  //         const channelState = channel.presenceState<{ newMoles: boolean[] }>();

  //         const newMoles = Object.values(channelState)[0]?.[0]?.newMoles;

  //         if (newMoles?.length) {
  //           setMoles(newMoles);
  //         }
  //       })
  //       .subscribe(async (status) => {
  //         if (status === 'SUBSCRIBED') {
  //           console.log('host', hostGame);
  //           console.log('player', playerId);
  //           if (hostGame?.id !== playerId) {
  //             return;
  //           }

  //           console.log('Host is broadcasting mole positions.');

  //           const intervalId = setInterval(() => {
  //             const newMoles = moles.map(() => Math.random() < 0.3);

  //             channel.track({
  //               // type: 'broadcast',
  //               // event: 'mole-pos',
  //               // payload: newMoles,
  //               newMoles,
  //             });
  //           }, 2000);

  //           return () => clearInterval(intervalId);
  //         }
  //       });
  //   };

  //   getHost();
  // }, [playerId, param?.gameId]);

  useEffect(() => {
    if (!param?.gameId) return;

    const getHost = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', param.gameId);

      if (error) {
        console.error(error);
        return;
      }

      const hostGame = data?.find((el) => el.is_host);
      if (hostGame) setHost(hostGame);

      const channel = supabase.channel(param.gameId);

      channel
        .on('broadcast', { event: 'mole-pos' }, (payload) => {
          if (payload.payload) {
            setMoles(payload.payload);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('host', hostGame);
            console.log('player', playerId);
            if (hostGame?.id !== playerId) {
              return;
            }

            console.log('Host is broadcasting mole positions.');

            // const intervalId = setInterval(() => {
            const newMoles = moles.map(() => Math.random() < 0.3);
            setMoles(newMoles);

            channel.send({
              type: 'broadcast',
              event: 'mole-pos',
              payload: newMoles,
            });
            // }, 2000);

            // return () => clearInterval(intervalId);
          }
        });
    };

    getHost();
  }, [playerId, param?.gameId]);

  const setExplode = (indx: number) => {
    setMoles((prev) => prev.map((el, idx) => (idx == indx ? false : el)));

    const hole = holeRefs.current[indx];
    const explotion = document.createElement('div');
    explotion.classList.add('whacked');
    hole?.appendChild(explotion);

    setTimeout(() => {
      hole?.removeChild(explotion);
    }, 300);
  };

  const handleWhacedAMole = async (index: number) => {
    if (!playerId) {
      return;
    }

    const channel = supabase.channel(`whack-mole-${param?.gameId}`);

    channel
      .on('broadcast', { event: 'hit-mole' }, (payload) => {
        if (payload.payload) {
          setExplode(payload.payload);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setExplode(index);
          await channel.send({
            type: 'broadcast',
            event: 'hit-mole',
            payload: index,
          });
        }
      });

    await supabase
      .from('players')
      .update({
        score: ++point.current,
      })
      .eq('id', playerId || '')
      .select();
  };

  return (
    <div className='flex items-center justify-between gap-6 w-full h-full'>
      <div
        id={MOLE_HAMMER_AREA}
        style={{ backgroundColor: '#000' }}
        className='w-full h-full'
      >
        <div className='border-2 rounded-md h-full p-4 whack-a-mole-board'>
          {holesData.map((hole, index) => {
            return (
              <div
                key={index}
                ref={(el) => {
                  holeRefs.current[index] = el;
                }}
                className={`whack-a-mole-hole`}
                onClick={
                  moles?.[index]
                    ? () => {
                        handleWhacedAMole(index);
                      }
                    : undefined
                }
                style={{ overflow: 'hidden' }}
              >
                {moles?.[index] ? <div className='mole'></div> : null}
              </div>
            );
          })}
        </div>
      </div>

      <LeaderBoard gameId={param?.gameId} />
    </div>
  );
}
