import { create } from "zustand";

export enum ETab {
  CHAT = "chat",
  GAME = "game",
}

export interface TabState {
  tab: ETab;
  setTab: (tab: ETab) => void;
}

export const useTab = create<TabState>()((set) => ({
  tab: ETab.CHAT,
  setTab: (tab) => set(() => ({ tab })),
}));
