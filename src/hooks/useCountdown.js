import { useEffect, useState } from 'react';

export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => calc(targetDate));

  useEffect(() => {
    if (!targetDate) return undefined;
    const id = setInterval(() => setRemaining(calc(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return remaining;
}

function calc(targetDate) {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const diff = new Date(targetDate).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, done: false };
}
