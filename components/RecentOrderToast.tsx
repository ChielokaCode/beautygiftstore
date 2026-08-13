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

    const showToast = () => {
      setVisible(true);
      window.setTimeout(() => {
        setVisible(false);
        setIndex((current) => (current + 1) % orders.length);
      }, 30_000);
    };

    showToast();
    const interval = window.setInterval(showToast, 120_000);

    return () => window.clearInterval(interval);
  }, [orders]);

  if (!orders.length || !visible) return null;

  const order = orders[index];

  return (
    <div
      className="pointer-events-none fixed left-3 top-24 z-[60] w-[min(330px,calc(100vw-1.5rem))] animate-[fadeIn_.35s_ease] rounded-2xl border border-rose-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur sm:left-5 sm:top-28"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg">
          ✓
        </div>
        <div>
          <div className="mb-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-amber-800"></div>
          <p className="text-sm font-extrabold text-rose-950">{order.name} just placed an order</p>
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
