"use client";
import { useUser } from "@/lib/store/user";
import { MousePos } from "@/lib/types/position";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LeaderBoard from "./LeaderBoard";

const MOLE_HAMMER_AREA = "mole-hammer-area";

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();

  const user = useUser((s) => s.user);
  const point = useRef(0);

  const [holes, setHoles] = useState<
    { id: number; top: number; left: number; show: boolean }[]
  >([]);
  const [moles, setMoles] = useState<
    { id: number; top: number; left: number }[]
  >([]);

  const [mousePos, setMousePos] = useState<MousePos | null>(null);
  const [isWhacked, setIsWhacked] = useState<boolean>(false);

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

    // Calculate the maximum random positions to avoid the element overflowing the window
    const maxTop = windowHeight - elementHeight;
    const maxLeft = windowWidth - elementWidth;

    const newMoles: { id: number; top: number; left: number }[] = [];

    // Generate random positions within the maximum limits
    const newHoles = holesData.map((hole, index) => {
      const top = Math.floor(Math.random() * maxTop);
      const left = Math.floor(Math.random() * maxLeft);
      const showHole =
        top < elementHeight &&
        left < elementWidth &&
        Math.floor(Math.random() * maxTop) *
          Math.floor(Math.random() * maxLeft) >
          Math.floor(Math.random() * 43543);

      if (showHole) {
        if (newMoles.length <= 10) {
          newMoles.push({ id: index, top, left });
        }
      }

      return {
        id: index,
        top: maxTop,
        left: maxLeft,
        show:
          showHole &&
          Math.floor(Math.random() * maxTop) *
            Math.floor(Math.random() * maxLeft) >
            Math.floor(Math.random() * 43543),
      };
    });

    /// show hole
    setHoles(newHoles);

    /// show mole
    setMoles(newMoles);
  }, []);

  const handleOnDownHammer = async (event: MouseEvent<HTMLDivElement>) => {
    setIsWhacked(true);

    const element = document.getElementById(MOLE_HAMMER_AREA);
    if (!element) {
      return;
    }

    console.log("handleOnDownHammer");

    const rect = element?.getBoundingClientRect();
    const top = event.clientY - (rect?.top ?? 0);
    const left = event.clientX - (rect?.left ?? 0);

    // Calculate the maximum random positions to avoid the element overflowing the window
    console.log({
      top,
      left,
    });

    console.log(moles);

    if (!user) {
      return;
    }

    await supabase.from("leaderboards").upsert(
      {
        user_id: user.id,
        point: ++point.current,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  };

  const handleOnUpHammer = async (event: MouseEvent<HTMLDivElement>) => {
    console.log("handleOnUpHammer");

    setTimeout(() => {
      setIsWhacked(false);
    }, 10);
  };

  const onMouseMove = (event: MouseEvent) => {
    const element = document.getElementById(MOLE_HAMMER_AREA);

    const rect = element?.getBoundingClientRect();
    const top = event.clientY - (rect?.top ?? 0);
    const left = event.clientX - (rect?.left ?? 0);

    setMousePos({ top, left });
  };

  return (
    <div className="flex items-center justify-between gap-6 w-full h-full">
      <div
        onMouseMove={onMouseMove}
        id={MOLE_HAMMER_AREA}
        style={{ backgroundColor: "#000" }}
        className="w-full h-full"
      >
        <div className="border-2 rounded-md h-full p-4 whack-a-mole-board">
          {holes.map((hole, index) => {
            if (!hole.show) {
              return <div key={index} style={{ height: 1 }}></div>;
            }

            return (
              <div key={index} className="whack-a-mole-hole">
                {moles.map((mole, moleIx) => {
                  return mole.id === hole.id ? (
                    <div key={moleIx} className="mole"></div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>

        <div
          className={`hammer ${isWhacked ? "active" : ""}`}
          onMouseDown={handleOnDownHammer}
          // onMouseUp={handleOnUpHammer}
          onMouseOut={handleOnUpHammer}
          // onClick={handleClick}
          style={{
            top: mousePos?.top,
            left: mousePos?.left,
            transition: "all 0.3s ease-in-out",
          }}
        />
      </div>

      <LeaderBoard />
    </div>
  );
}

const holesData: { id: string | number; top: number; left: number }[] = [
  { id: 1, top: 0, left: 0 },
  { id: 2, top: 0, left: 40 },
  { id: 3, top: 0, left: 0 },
  { id: 4, top: 0, left: 0 },
  { id: 5, top: 40, left: 10 },
  { id: 6, top: 0, left: 0 },
  { id: 7, top: 0, left: 0 },
  { id: 8, top: 30, left: 0 },
  { id: 9, top: 0, left: 0 },
  { id: 10, top: 10, left: 30 },

  { id: 11, top: 10, left: 0 },
  { id: 12, top: 20, left: 0 },
  { id: 13, top: 0, left: 0 },
  { id: 14, top: 0, left: 0 },
  { id: 15, top: 0, left: 0 },
  { id: 16, top: 0, left: 0 },
  { id: 17, top: 0, left: 0 },
  { id: 18, top: 0, left: 0 },
  { id: 19, top: 0, left: 0 },
  { id: 20, top: 0, left: 0 },
  { id: 21, top: 0, left: 0 },

  { id: 22, top: 10, left: 0 },
  { id: 23, top: 20, left: 0 },
  { id: 24, top: 80, left: 0 },
  { id: 25, top: 0, left: 0 },
  { id: 26, top: 40, left: 0 },
  { id: 27, top: 0, left: 0 },
  { id: 28, top: 0, left: 0 },
  { id: 29, top: 0, left: 0 },
  { id: 30, top: 40, left: 0 },
  { id: 31, top: 0, left: 0 },

  { id: 32, top: 10, left: 0 },
  { id: 33, top: 20, left: 50 },
  { id: 34, top: 0, left: 0 },
  { id: 35, top: 0, left: 0 },
  { id: 36, top: 0, left: 0 },
  { id: 37, top: 80, left: 0 },
  { id: 38, top: 0, left: 0 },
  { id: 39, top: 0, left: 70 },
  { id: 40, top: 0, left: 0 },

  { id: 41, top: 10, left: 0 },
  { id: 42, top: 20, left: 50 },
  { id: 43, top: 0, left: 0 },
  { id: 44, top: 0, left: 0 },
  { id: 45, top: 0, left: 0 },
  { id: 46, top: 80, left: 0 },
  { id: 47, top: 0, left: 0 },
  { id: 48, top: 0, left: 70 },
  { id: 49, top: 0, left: 0 },

  { id: 50, top: 10, left: 0 },
  { id: 51, top: 20, left: 50 },
  { id: 52, top: 0, left: 0 },
  { id: 53, top: 0, left: 0 },
  { id: 54, top: 0, left: 0 },
  { id: 55, top: 80, left: 0 },
  { id: 56, top: 0, left: 0 },
  { id: 57, top: 0, left: 70 },
  { id: 58, top: 0, left: 0 },
];

/* randon mole, hole position */
/* hammer hit mole when it on the same mole potision */
