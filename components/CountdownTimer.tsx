'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO date string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-red-400 mb-2">
          Registration Closed
        </div>
        <div className="text-gray-400">The registration deadline has passed</div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-sm md:text-base text-gray-400 mb-4">
        Registration Closes In
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
        <div className="card">
          <div className="text-3xl md:text-5xl font-bold text-neon-green mb-1">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-gray-400">Days</div>
        </div>
        <div className="card">
          <div className="text-3xl md:text-5xl font-bold text-neon-green mb-1">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-gray-400">Hours</div>
        </div>
        <div className="card">
          <div className="text-3xl md:text-5xl font-bold text-neon-green mb-1">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-gray-400">Minutes</div>
        </div>
        <div className="card">
          <div className="text-3xl md:text-5xl font-bold text-neon-green mb-1">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-gray-400">Seconds</div>
        </div>
      </div>
    </div>
  );
}

