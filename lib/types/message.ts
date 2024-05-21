import { Database } from "./supabase";

export type TListMessage =
  | Database["public"]["Tables"]["messages"]["Row"] & {
      profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
    };
