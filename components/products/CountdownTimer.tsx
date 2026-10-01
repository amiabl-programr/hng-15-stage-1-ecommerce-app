"use client";

import { useState, useEffect } from "react";

export function CountdownTimer({ initialHours = 350 }: { initialHours?: number }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 18,
    minutes: 42,
    seconds: 35,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + initialHours);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [initialHours]);

  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold">
      <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded">
        {String(timeLeft.days).padStart(2, "0")}d
      </span>
      <span className="text-slate-400">:</span>
      <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span className="text-slate-400">:</span>
      <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
      <span className="text-slate-400">:</span>
      <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded">
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}
