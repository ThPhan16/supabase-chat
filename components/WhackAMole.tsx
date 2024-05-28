'use client';
import { useUser } from '@/lib/store/user';
import { MousePos } from '@/lib/types/position';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import LeaderBoard from './LeaderBoard';
import { url } from 'inspector';

const MOLE_HAMMER_AREA = 'mole-hammer-area';

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();

  const user = useUser((s) => s.user);
  const point = useRef(0);
  const holesData = Array(42).fill(false);

  const [holes, setHoles] = useState<
    { id: number; top: number; left: number; show: boolean }[]
  >([]);
  const [moles, setMoles] = useState<boolean[]>(holesData);

  useEffect(() => {
    // Get the window width and height
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const element = document.getElementById(MOLE_HAMMER_AREA);
    if (!element) {
      return;
    }

    // Get the element's width and height (assuming it's already loaded)
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const onMouseDown = () => {
      element.classList.add('hammer-hit');
    };
    const onMouseUp = () => {
      element.classList.remove('hammer-hit');
    };

    element.addEventListener('mousedown', onMouseDown);

    element.addEventListener('mouseup', onMouseUp);

    // Calculate the maximum random positions to avoid the element overflowing the window
    const maxTop = windowHeight - elementHeight;
    const maxLeft = windowWidth - elementWidth;

    // const newMoles: boolean[] = [];

    // Generate random positions within the maximum limits
    // const newHoles = holesData.map((hole, index) => {
    //   const top = Math.floor(Math.random() * maxTop);
    //   const left = Math.floor(Math.random() * maxLeft);
    // const showHole =
    //   top < elementHeight &&
    //   left < elementWidth &&
    //   Math.floor(Math.random() * maxTop) *
    //     Math.floor(Math.random() * maxLeft) >
    //     Math.floor(Math.random() * 43543);

    // if (showHole) {
    // if (newMoles.length <= 10) {
    //   newMoles.push({ id: index, top, left });
    //   // }
    // }

    // return {
    //   id: index,
    //   top: maxTop,
    //   left: maxLeft,
    //   show: true,
    // showHole &&
    // Math.floor(Math.random() * maxTop) *
    //   Math.floor(Math.random() * maxLeft) >
    //   Math.floor(Math.random() * 43543),
    //   };
    // });

    /// show hole
    // setHoles(newHoles);

    /// show mole

    const interval = setInterval(() => {
      const newMoles = moles.map(() => Math.random() < 0.3);
      console.log(newMoles);
      setMoles(newMoles);
    }, 2000);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mouseup', onMouseUp);
      clearInterval(interval);
    };
  }, []);

  const handleWhacedAMole = async (index: number) => {
    if (!user) {
      return;
    }

    setMoles(moles.map((mole, i) => (i === index ? false : mole)));

    await supabase.from('leaderboards').upsert(
      {
        user_id: user.id,
        point: ++point.current,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  };

  return (
    <div className='flex items-center justify-between gap-6 w-full h-full'>
      <div
        // onMouseMove={onMouseMove}
        id={MOLE_HAMMER_AREA}
        style={{ backgroundColor: '#000' }}
        className='w-full h-full'
      >
        <div className='border-2 rounded-md h-full p-4 whack-a-mole-board'>
          {holesData.map((hole, index) => {
            return (
              <div
                key={index}
                className={`whack-a-mole-hole `}
                onClick={
                  moles[index]
                    ? () => {
                        handleWhacedAMole(index);
                      }
                    : undefined
                }
                style={{ overflow: 'hidden' }}
              >
                {moles[index] ? <div className='mole'></div> : null}
                <div className='half-hole'></div>
              </div>
            );
          })}
        </div>
      </div>

      <LeaderBoard />
    </div>
  );
}

// const holesData = Array(42).fill(false)
// { id: string | number; top: number; left: number }[] = [
//   { id: 1, top: 0, left: 0 },
//   { id: 2, top: 0, left: 40 },
//   { id: 3, top: 0, left: 0 },
//   { id: 4, top: 0, left: 0 },
//   { id: 5, top: 40, left: 10 },
//   { id: 6, top: 0, left: 0 },
//   { id: 7, top: 0, left: 0 },
//   { id: 8, top: 30, left: 0 },
//   { id: 9, top: 0, left: 0 },
//   { id: 10, top: 10, left: 30 },

//   { id: 11, top: 10, left: 0 },
//   { id: 12, top: 20, left: 0 },
//   { id: 13, top: 0, left: 0 },
//   { id: 14, top: 0, left: 0 },
//   { id: 15, top: 0, left: 0 },
//   { id: 16, top: 0, left: 0 },
//   { id: 17, top: 0, left: 0 },
//   { id: 18, top: 0, left: 0 },
//   { id: 19, top: 0, left: 0 },
//   { id: 20, top: 0, left: 0 },
//   { id: 21, top: 0, left: 0 },

//   { id: 22, top: 10, left: 0 },
//   { id: 23, top: 20, left: 0 },
//   { id: 24, top: 80, left: 0 },
//   { id: 25, top: 0, left: 0 },
//   { id: 26, top: 40, left: 0 },
//   { id: 27, top: 0, left: 0 },
//   { id: 28, top: 0, left: 0 },
//   { id: 29, top: 0, left: 0 },
//   { id: 30, top: 40, left: 0 },
//   { id: 31, top: 0, left: 0 },

//   { id: 32, top: 10, left: 0 },
//   { id: 33, top: 20, left: 50 },
//   { id: 34, top: 0, left: 0 },
//   { id: 35, top: 0, left: 0 },
//   { id: 36, top: 0, left: 0 },
//   { id: 37, top: 80, left: 0 },
//   { id: 38, top: 0, left: 0 },
//   { id: 39, top: 0, left: 70 },
//   { id: 40, top: 0, left: 0 },

//   { id: 41, top: 10, left: 0 },
//   { id: 42, top: 20, left: 50 },
// { id: 43, top: 0, left: 0 },
// { id: 44, top: 0, left: 0 },
// { id: 45, top: 0, left: 0 },
// { id: 46, top: 80, left: 0 },
// { id: 47, top: 0, left: 0 },
// { id: 48, top: 0, left: 70 },
// { id: 49, top: 0, left: 0 },

// { id: 50, top: 10, left: 0 },
// { id: 51, top: 20, left: 50 },
// { id: 52, top: 0, left: 0 },
// { id: 53, top: 0, left: 0 },
// { id: 54, top: 0, left: 0 },
// { id: 55, top: 80, left: 0 },
// { id: 56, top: 0, left: 0 },
// { id: 57, top: 0, left: 70 },
// { id: 58, top: 0, left: 0 },
// ];

/* randon mole, hole position */
/* hammer hit mole when it on the same mole potision */
