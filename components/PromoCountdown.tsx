"use client";

import { useEffect, useMemo, useState } from "react";

const PROMO_DURATION_SECONDS = 23 * 60 * 60;

const STORAGE_KEY = "beautygiftstore-promo-end-time";

function getRemainingSeconds(endTime: number) {
  const diff = endTime - Date.now();

  return Math.max(0, Math.floor(diff / 1000));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function PromoCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    /*
     * Check whether this browser session already
     * has a countdown running.
     */
    const storedEndTime = window.sessionStorage.getItem(STORAGE_KEY);

    let sessionEndTime: number;

    if (storedEndTime) {
      /*
       * Same session.
       * Continue from where the visitor left off.
       */
      sessionEndTime = Number(storedEndTime);
    } else {
      /*
       * New session.
       * Start a fresh 23-hour countdown.
       */
      sessionEndTime =
        Date.now() + PROMO_DURATION_SECONDS * 1000;

      window.sessionStorage.setItem(
        STORAGE_KEY,
        String(sessionEndTime)
      );
    }

    setEndTime(sessionEndTime);

    /*
     * Calculate immediately after hydration.
     */
    setRemaining(
      getRemainingSeconds(sessionEndTime)
    );
  }, []);

  useEffect(() => {
    if (endTime === null) return;

    const updateCountdown = () => {
      setRemaining(
        getRemainingSeconds(endTime)
      );
    };

    updateCountdown();

    const interval = window.setInterval(
      updateCountdown,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [endTime]);

  const parts = useMemo(() => {
    if (remaining === null) {
      return null;
    }

    const hours = Math.floor(
      remaining / 3600
    );

    const minutes = Math.floor(
      (remaining % 3600) / 60
    );

    const seconds =
      remaining % 60;

    return {
      hours,
      minutes,
      seconds,
    };
  }, [remaining]);

  return (
    <div className="sticky top-0 z-50 border-b border-rose-200/20 bg-rose-950 px-3 py-3 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">

        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-rose-100 sm:text-xs">
          First 100 orders get the special promo price • Offer ends in
        </p>

        <div
          className="flex items-center gap-1.5"
          aria-label="Promotion countdown timer"
        >
          <TimeUnit
            value={
              parts
                ? pad(parts.hours)
                : "--"
            }
            label="HRS"
          />

          <span className="pb-4 text-lg font-black text-rose-200">
            :
          </span>

          <TimeUnit
            value={
              parts
                ? pad(parts.minutes)
                : "--"
            }
            label="MIN"
          />

          <span className="pb-4 text-lg font-black text-rose-200">
            :
          </span>

          <TimeUnit
            value={
              parts
                ? pad(parts.seconds)
                : "--"
            }
            label="SEC"
          />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="min-w-[46px] rounded-lg bg-white/10 px-2 py-1 text-center ring-1 ring-white/15 backdrop-blur">

      <div className="font-mono text-lg font-black leading-none sm:text-xl">
        {value}
      </div>

      <div className="mt-1 text-[8px] font-bold tracking-[0.18em] text-rose-200">
        {label}
      </div>

    </div>
  );
}