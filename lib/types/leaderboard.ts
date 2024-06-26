import { Database } from "./supabase";

export type TLeaderboardList =
  Database["public"]["Tables"]["leaderboards"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
  };
