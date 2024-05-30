import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TLeaderboardList } from './types/leaderboard';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage;
  let to = from + itemPerPage;

  if (page > 0) {
    from += 1;
  }
  return { from, to };
}

export function stringToColor(str: string) {
  if (!str) {
    return '#000000';
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); // Hashing with bitwise operations
    hash = hash & hash; // Ensure 32-bit number
  }

  // Convert hash to RGB values (0-255)
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  // Return the color as a hex string
  return (
    '#' +
    ('000000' + r.toString(16) + g.toString(16) + b.toString(16)).slice(-6)
  );
}

export const sortLeaderboardByPoint = (
  a: TLeaderboardList,
  b: TLeaderboardList
) => {
  if (a.score === b.score) {
    return 0;
  }

  return (a.score || 0) > (b.score || 0) ? -1 : 1;
};
