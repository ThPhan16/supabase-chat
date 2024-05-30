"use client";
import { useUser } from "@/lib/store/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import LeaderBoard from "./LeaderBoard";
import { EChannel } from "@/lib/types/event";

const MOLE_HAMMER_AREA = "mole-hammer-area";

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();

  const user = useUser((s) => s.user);
  const point = useRef(0);
  const holesData = Array(42).fill(false);

  const holeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [moles, setMoles] = useState<boolean[]>(holesData);

  useEffect(() => {
    const element = document.getElementById(MOLE_HAMMER_AREA);
    if (!element) {
      return;
    }

    const onMouseDown = () => {
      element.classList.add("hammer-hit");
    };

    const onMouseUp = () => {
      element.classList.remove("hammer-hit");
    };

    element.addEventListener("mousedown", onMouseDown);

    element.addEventListener("mouseup", onMouseUp);

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      element.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const channel = supabase.channel(EChannel.LEADERBOARD);

      channel
        .on("presence", { event: "sync" }, () => {
          const channelState = channel.presenceState<{ newMoles: boolean[] }>();

          const newMoles = Object.values(channelState)[0]?.[0]?.newMoles;

          if (newMoles.length) {
            setMoles(newMoles);
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            const newMoles = moles.map(() => Math.random() < 0.3);

            await channel.track({
              newMoles,
            });
          }
        });
    }, 3000);

    return () => {
      clearInterval(interval);
      // channel.unsubscribe();
    };
  }, []);

  const handleWhacedAMole = async (index: number) => {
    if (!user) {
      return;
    }

    setMoles(moles.map((mole, i) => (i === index ? false : mole)));

    const hole = holeRefs.current[index];
    // hole?.classList.add('whacked');
    const explotion = document.createElement("div");
    explotion.classList.add("whacked");
    hole?.appendChild(explotion);

    setTimeout(() => {
      // hole?.classList.remove('whacked');
      hole?.removeChild(explotion);
    }, 300);

    await supabase.from("moles").upsert({
      state: "hide",
      position: 1,
    });

    await supabase.from("leaderboards").upsert(
      {
        user_id: user.id,
        point: ++point.current,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  };

  return (
    <div className="flex items-center justify-between gap-6 w-full h-full">
      <div
        id={MOLE_HAMMER_AREA}
        style={{ backgroundColor: "#000" }}
        className="w-full h-full"
      >
        <div className="border-2 rounded-md h-full p-4 whack-a-mole-board">
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
                style={{ overflow: "hidden" }}
              >
                {moles?.[index] ? <div className="mole"></div> : null}
              </div>
            );
          })}
        </div>
      </div>

      <LeaderBoard />
    </div>
  );
}
