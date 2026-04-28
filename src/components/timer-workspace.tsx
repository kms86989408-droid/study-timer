"use client";

import { Pause, Play, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_STUDY_MINUTES,
  durationMinutesToSeconds,
  formatTimerClock,
} from "@/features/settings/duration";

const totalSeconds = durationMinutesToSeconds(DEFAULT_STUDY_MINUTES);

type TimerState = {
  remainingSeconds: number;
  status: "idle" | "running" | "paused" | "complete";
};

export function TimerWorkspace() {
  const [timer, setTimer] = useState<TimerState>({
    remainingSeconds: totalSeconds,
    status: "idle",
  });

  const isRunning = timer.status === "running";

  useEffect(() => {
    if (timer.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimer((current) => {
        if (current.status !== "running") {
          return current;
        }

        const nextRemainingSeconds = Math.max(0, current.remainingSeconds - 1);

        return {
          remainingSeconds: nextRemainingSeconds,
          status: nextRemainingSeconds === 0 ? "complete" : "running",
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timer.status]);

  const progressWidth = useMemo(() => {
    return `${Math.max(0, (timer.remainingSeconds / totalSeconds) * 100)}%`;
  }, [timer.remainingSeconds]);

  const toggleTimer = () => {
    setTimer((current) => {
      if (current.status === "running") {
        return { ...current, status: "paused" };
      }

      if (current.remainingSeconds === 0) {
        return { remainingSeconds: totalSeconds, status: "running" };
      }

      return { ...current, status: "running" };
    });
  };

  const resetTimer = () => {
    setTimer({
      remainingSeconds: totalSeconds,
      status: "idle",
    });
  };

  return (
    <section className="flex min-h-[480px] flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-soft sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-moss">공부</p>
          <p className="mt-2 text-6xl font-semibold tabular-nums tracking-normal sm:text-7xl">
            {formatTimerClock(timer.remainingSeconds)}
          </p>
        </div>
        <div className="grid size-20 place-items-center rounded-lg bg-white text-moss ring-1 ring-[var(--line)] sm:size-24">
          {isRunning ? <Pause aria-hidden="true" size={34} /> : <Play aria-hidden="true" size={34} fill="currentColor" />}
        </div>
      </div>

      <div
        className="mt-10 overflow-hidden rounded-lg border border-[var(--line)] bg-white"
        aria-label="남은 공부 시간"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={totalSeconds}
        aria-valuenow={timer.remainingSeconds}
      >
        <div className="h-8 bg-moss transition-[width] duration-500" style={{ width: progressWidth }} />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={toggleTimer}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-moss px-4 text-sm font-semibold text-white transition hover:bg-leaf"
        >
          {isRunning ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} fill="currentColor" />}
          {isRunning ? "일시정지" : "시작"}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
        >
          <TimerReset aria-hidden="true" size={18} />
          초기화
        </button>
      </div>
    </section>
  );
}
