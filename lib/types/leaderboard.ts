import { Database } from './supabase';

export type TLeaderboardList = Database['public']['Tables']['players']['Row'];
