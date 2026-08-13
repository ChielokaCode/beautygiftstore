"use client";

import { useEffect, useState } from "react";

export type RecentOrder = {
  name: string;
  location: string;
  stack: string;
  time: string;
};

export function RecentOrderToast({ orders }: { orders: RecentOrder[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!orders.length) return;

    let hideTimeout: number | undefined;
    let interval: number | undefined;

    const showToast = () => {
      setVisible(true);

      hideTimeout = window.setTimeout(() => {
        setVisible(false);

        setIndex((current) => {
          return (current + 1) % orders.length;
        });
      }, 30_000);
    };

    // Wait 2 minutes before showing the first toast
    const firstToastTimeout = window.setTimeout(() => {
      showToast();

      // After the first toast, show another every 2 minutes
      interval = window.setInterval(() => {
        showToast();
      }, 120_000);
    }, 120_000);

    return () => {
      window.clearTimeout(firstToastTimeout);

      if (hideTimeout) {
        window.clearTimeout(hideTimeout);
      }

      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [orders]);

  if (!orders.length || !visible) return null;

  const order = orders[index];

  return (
    <div
      className="
        pointer-events-auto
        fixed left-3 top-24 z-[60]
        w-[min(330px,calc(100vw-1.5rem))]
        animate-[fadeIn_.35s_ease]
        rounded-2xl
        border border-rose-200/80
        bg-white/95
        p-4
        pr-10
        shadow-2xl
        backdrop-blur
        sm:left-5 sm:top-28
      "
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Close notification"
        className="
          absolute right-3 top-3
          flex h-7 w-7
          items-center justify-center
          rounded-full
          text-lg font-bold
          text-rose-950/50
          transition
          hover:bg-rose-100
          hover:text-rose-950
        "
      >
        ×
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg">
          ✓
        </div>

        <div>
          <p className="text-sm font-extrabold text-rose-950">
            {order.name} just placed an order
          </p>

          <p className="mt-1 text-xs leading-5 text-rose-950/70">
            {order.stack} • {order.location}
          </p>

          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-rose-700/70">
            {order.time}
          </p>
        </div>
      </div>
    </div>
  );
}