"use client";
import { useUser } from "@/lib/store/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LeaderBoard from "./LeaderBoard";
import { MousePos } from "@/lib/types/position";

const MOLE_HAMMER_AREA = "mole-hammer-area";

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();

  const user = useUser((s) => s.user);
  const point = useRef(0);

  const [mousePos, setMousePos] = useState<MousePos | null>(null);
  const [isWhacked, setIsWhacked] = useState<boolean>(false);

  const handleClick = async (event: Event) => {
    if (!user) {
      return;
    }

    const { error } = await supabase.from("leaderboards").upsert(
      {
        user_id: user.id,
        point: ++point.current,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      toast.error(error.message);
      return;
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      point.current = 0;
    };
  }, []);

  const handleOnDownHammer = (event: MouseEvent<HTMLDivElement>) => {
    setIsWhacked(true);
  };
  const handleOnUpHammer = (event: MouseEvent<HTMLDivElement>) => {
    setTimeout(() => {
      setIsWhacked(false);
    }, 10);
  };

  const onMouseMove = (event: MouseEvent) => {
    const cursorDiv = document.getElementById(MOLE_HAMMER_AREA);
    const rect = cursorDiv?.getBoundingClientRect();
    const x = event.pageX - (rect?.left ?? 0) - 25;
    const y = event.pageY - (rect?.top ?? 0) - 30;

    setMousePos({ x, y });
  };

  return (
    <div
      className="flex items-center justify-between gap-6 w-full h-full"
      onMouseMove={onMouseMove}
      id={MOLE_HAMMER_AREA}
    >
      <div className="w-[70%] border-2 rounded-md h-full p-4 whack-a-mole-board">
        {holes.map((el) => {
          return typeof el.id === "string" ? (
            <div key={el.id}></div>
          ) : (
            <div key={el.id} style={{ width: "100%" }}>
              <div
                className="whack-a-mole-hole"
                style={{
                  marginBottom: el.mb,
                  marginTop: el.mt,
                }}
              >
                {moles[el.id] ? (
                  <div className="mole"></div>
                ) : (
                  <div className="h-[100px] w-full"></div>
                )}
              </div>
            </div>
          );
        })}

        <div
          className={`hammer ${isWhacked ? "active" : ""}`}
          onMouseDown={handleOnDownHammer}
          onMouseUp={handleOnUpHammer}
          style={{
            top: mousePos?.y,
            left: mousePos?.x,
            transition: "all 0.3s ease-in-out",
          }}
        />
      </div>

      <LeaderBoard />

      {/* <Cursor /> */}
    </div>
  );
}

const holes: { id: string | number; mb: number; mt: number }[] = [
  { id: "1", mb: 0, mt: 0 },
  { id: 2, mb: 0, mt: 40 },
  { id: "3", mb: 0, mt: 0 },
  { id: "4", mb: 0, mt: 0 },
  { id: 5, mb: 40, mt: 10 },
  { id: "6", mb: 0, mt: 0 },
  { id: "7", mb: 0, mt: 0 },
  { id: 8, mb: 30, mt: 0 },
  { id: "9", mb: 0, mt: 0 },
  { id: 10, mb: 10, mt: 30 },

  { id: 11, mb: 10, mt: 0 },
  { id: "12", mb: 20, mt: 0 },
  { id: "13", mb: 0, mt: 0 },
  { id: "14", mb: 0, mt: 0 },
  { id: "15", mb: 0, mt: 0 },
  { id: 16, mb: 0, mt: 0 },
  { id: "17", mb: 0, mt: 0 },
  { id: "18", mb: 0, mt: 0 },
  { id: "19", mb: 0, mt: 0 },
  { id: "20", mb: 0, mt: 0 },
  { id: "21", mb: 0, mt: 0 },

  { id: "22", mb: 10, mt: 0 },
  { id: "23", mb: 20, mt: 0 },
  { id: 24, mb: 80, mt: 0 },
  { id: "25", mb: 0, mt: 0 },
  { id: "26", mb: 40, mt: 0 },
  { id: "27", mb: 0, mt: 0 },
  { id: "28", mb: 0, mt: 0 },
  { id: "29", mb: 0, mt: 0 },
  { id: 30, mb: 40, mt: 0 },
  { id: "31", mb: 0, mt: 0 },

  { id: "32", mb: 10, mt: 0 },
  { id: 33, mb: 20, mt: 50 },
  { id: "34", mb: 0, mt: 0 },
  { id: "35", mb: 0, mt: 0 },
  { id: "36", mb: 0, mt: 0 },
  { id: 37, mb: 80, mt: 0 },
  { id: "38", mb: 0, mt: 0 },
  { id: 39, mb: 0, mt: 70 },
  { id: "40", mb: 0, mt: 0 },

  { id: "41", mb: 10, mt: 0 },
  { id: 42, mb: 20, mt: 50 },
  { id: "43", mb: 0, mt: 0 },
  { id: "44", mb: 0, mt: 0 },
  { id: "45", mb: 0, mt: 0 },
  { id: 46, mb: 80, mt: 0 },
  { id: "47", mb: 0, mt: 0 },
  { id: 48, mb: 0, mt: 70 },
  { id: "49", mb: 0, mt: 0 },

  { id: "50", mb: 10, mt: 0 },
  { id: 51, mb: 20, mt: 50 },
  { id: "52", mb: 0, mt: 0 },
  { id: "53", mb: 0, mt: 0 },
  { id: "54", mb: 0, mt: 0 },
  { id: 55, mb: 80, mt: 0 },
  { id: "56", mb: 0, mt: 0 },
  { id: 57, mb: 0, mt: 70 },
  { id: "58", mb: 0, mt: 0 },
];

const moles = {
  "1": false,
  2: true,
  "3": false,
  "4": false,
  5: true,
  "6": false,
  "7": false,
  8: false,
  "9": false,
  10: true,

  11: false,
  "12": false,
  "13": false,
  "14": false,
  "15": false,
  16: true,
  "17": false,
  "18": false,
  "19": false,
  "20": false,
  "21": false,

  "22": false,
  "23": false,
  24: false,
  "25": false,
  "26": false,
  "27": false,
  "28": false,
  "29": false,
  30: false,
  "31": false,

  "32": false,
  33: false,
  "34": false,
  "35": false,
  "36": false,
  37: false,
  "38": false,
  39: true,
  "40": false,

  "41": false,
  42: false,
  "43": false,
  "44": false,
  "45": false,
  46: false,
  "47": false,
  48: true,
  "49": false,

  "50": true,
  51: true,
  "52": true,
  "53": true,
  "54": true,
  55: true,
  "56": true,
  57: true,
  "58": true,
};
