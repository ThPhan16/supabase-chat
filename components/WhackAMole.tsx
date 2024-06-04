'use client';
import { usePlayerId } from '@/lib/store/user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import LeaderBoard from './LeaderBoard';

const MOLE_HAMMER_AREA = 'mole-hammer-area';
const UN_WHACKED_MOLE_POINT = 4;

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();
  const router = useRouter();

  const playerId =
    usePlayerId((s) => s.state.playerId) ||
    localStorage.getItem('playerId') ||
    '';
  const whackedPoint = useRef(0);
  const unWhackedPoint = useRef(0);
  const holesData = Array(42).fill(false);

  const holeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [moles, setMoles] = useState<boolean[]>(holesData);

  const param = useParams<{ gameId: string }>();

  const [countdown, setCountdown] = useState(3); // Initial countdown value

  useEffect(() => {
    const intervalId = setTimeout(() => {
      console.log(countdown);
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        setCountdown(0);
        clearInterval(intervalId);
      }
    }, 800);
    return () => clearTimeout(intervalId);
  }, [countdown]); // Empty dependency array,

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
      // clearInterval(countDownStart);
    };
  }, []);

  /// get score

  useEffect(() => {
    if (!playerId) {
      return;
    }

    const getScore = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('score')
        .eq('id', playerId)
        .single();

      if (error) {
        console.log('get score error', error);
        return;
      }

      if (data.score) {
        whackedPoint.current = data.score;
      }
    };

    getScore();
  }, [playerId]);

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

      const channel = supabase.channel(param.gameId);

      channel
        .on('broadcast', { event: 'mole-pos' }, (payload) => {
          if (payload.payload.newMoles) {
            setMoles(payload.payload.newMoles);
          }
        })
        .on('broadcast', { event: 'game-end' }, () => {
          router.push(`/game-result/${param.gameId}`);
          channel.unsubscribe();
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            if (hostGame?.id !== playerId) {
              return;
            }

            const intervalId = setInterval(() => {
              const newMoles = moles.map(() => Math.random() < 0.3);
              setMoles(newMoles);
              channel.send({
                type: 'broadcast',
                event: 'mole-pos',
                payload: { newMoles },
              });
            }, 2000);

            const gameTimeout = setTimeout(async () => {
              // Update game state to finished in the database
              await supabase
                .from('games')
                .update({ state: 'finished' })
                .eq('id', param.gameId);

              // Notify players that the game has ended
              await channel.send({
                type: 'broadcast',
                event: 'game-end',
                payload: {},
              });
              clearInterval(intervalId);
              channel.unsubscribe();

              router.push(`/game-result/${param.gameId}`);
            }, 63000);

            return () => {
              clearInterval(intervalId);
              clearTimeout(gameTimeout);
              channel.unsubscribe();
            };
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

  const handleWhackedAMole = async (index: number) => {
    if (!playerId) {
      return;
    }

    unWhackedPoint.current = 0;

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
        score: ++whackedPoint.current,
      })
      .eq('id', playerId);
  };

  const handleUnWhackedAMole = async (index: number) => {
    if (!playerId) {
      return;
    }

    ++unWhackedPoint.current;
    if (unWhackedPoint.current <= UN_WHACKED_MOLE_POINT) {
      return;
    }

    toast.warning(`You didn't strike the mole ${UN_WHACKED_MOLE_POINT} times.`);

    await supabase
      .from('players')
      .update({
        score: whackedPoint.current > 0 ? --whackedPoint.current : 0,
      })
      .eq('id', playerId);

    unWhackedPoint.current = 0;
  };

  return (
    <>
      <div className='flex items-center justify-between flex-col md:flex-row gap-2 md:gap-6 w-full h-full'>
        <div
          id={MOLE_HAMMER_AREA}
          style={{ backgroundColor: '#000' }}
          className='w-full h-full'
        >
          <div className='border-4 rounded-md h-full grow-1 p-4 whack-a-mole-board'>
            {holesData.map((hole, index) => {
              return (
                <div
                  key={index}
                  ref={(el) => {
                    holeRefs.current[index] = el;
                  }}
                  className={`whack-a-mole-hole`}
                  onClick={() => {
                    moles?.[index]
                      ? handleWhackedAMole(index)
                      : handleUnWhackedAMole(index);
                  }}
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
      {countdown > 0 ? (
        <div className='absolute top-0 left-0 h-screen w-screen bg-black  text-center z-[5000] bg-opacity-30 flex items-center justify-center text-7xl'>
          {countdown}
        </div>
      ) : null}
    </>
  );
}
