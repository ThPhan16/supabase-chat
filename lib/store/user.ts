import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
export interface UserState {
  user: User | undefined | null;
  clearUser: () => void;
}

export const useUser = create<UserState>()((set) => ({
  user: null,
  clearUser: () => set(() => ({ user: null })),
}));

interface State {
  playerId: string | null;
}

interface Store {
  state: State;
  setState: (payload: string) => void;
  clearState: () => void;
}

const initState: State = {
  playerId: null,
};

export const usePlayerId = create(
  immer<Store>((set) => ({
    state: initState,
    setState: (payload) => {
      set((store) => {
        store.state.playerId = payload;
      });
    },
    clearState: () => {
      set((store) => {
        store.state = initState;
      });
    },
  }))
);
