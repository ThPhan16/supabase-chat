import { useState } from "react";
import { TLeaderboardList } from "../types/leaderboard";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/utils/supabase/client";

export const useLeaderboard = () => {
  const supabase = supabaseBrowserClient();

  const [data, setData] = useState<TLeaderboardList[]>([]);

  const fetchLeaderboardData = async () => {
    const { data, error } = await supabase
      .from("leaderboards")
      .select("*,profiles(id,display_name,avatar_url)")
      .order("point", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setData(data as TLeaderboardList[]);
  };

  return { data, setData, fetchLeaderboardData };
};
