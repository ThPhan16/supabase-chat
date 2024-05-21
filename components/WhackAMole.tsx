"use client";
import { useUser } from "@/lib/store/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import LeaderBoard from "./LeaderBoard";

export default function WhackAMole() {
  const supabase = supabaseBrowserClient();

  const user = useUser((s) => s.user);
  const point = useRef(0);

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

  return (
    <div className="flex items-center justify-between gap-6 w-full h-full">
      <div className="w-[70%] border-2 rounded-md h-full"></div>
      <LeaderBoard />
    </div>
  );
}
