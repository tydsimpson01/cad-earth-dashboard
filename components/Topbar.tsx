"use client";

import type { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DashboardMatchRange } from "@/types/dashboard";

type TopbarProps = {
  title: string;
  matchRange: DashboardMatchRange;
};

export function Topbar({ title, matchRange }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleRangeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextRange = event.target.value === "10" ? 10 : 20;
    const nextUrl = nextRange === 20 ? pathname : `${pathname}?range=10`;

    router.replace(nextUrl, { scroll: false });
  }

  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">CTRL // ALT // DEL</span>
        <h1 id="page-title">{title}</h1>
      </div>
      <div className="top-actions">
        <select
          id="range-select"
          aria-label="Match range"
          value={String(matchRange)}
          onChange={handleRangeChange}
        >
          <option value="20">Last 20 Games</option>
          <option value="10">Last 10 Games</option>
        </select>
        <div className="mode-pill">PUBLIC VIEW</div>
      </div>
    </header>
  );
}