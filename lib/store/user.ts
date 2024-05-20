import { User } from "@supabase/supabase-js";
import { create } from "zustand";

export interface UserState {
  user: User | undefined | null;
}

export const useUser = create<UserState>()((set) => ({
  user: null,
}));
