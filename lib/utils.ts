import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRoundName(roundNumber: number): string {
  const rounds: Record<number, string> = {
    1: 'Round 1',
    2: 'Round 2',
    3: 'Round 3',
    4: 'Round 4',
    5: 'Round 5',
    6: 'Round 6',
    7: 'Round 7',
    8: 'Round 8',
    9: 'Semi-finals',
    10: 'Final',
  };

  return rounds[roundNumber] || `Round ${roundNumber}`;
}

export function calculateRounds(totalPlayers: number): number {
  return Math.ceil(Math.log2(totalPlayers));
}

