"use client";

import { Minus, Pause, Play, Plus, Square, TimerReset } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DURATION_STEP_MINUTES,
  formatTimerClock,
  MAX_DURATION_MINUTES,
  MIN_DURATION_MINUTES,
} from "@/features/settings/duration";
import {
  createSessionRecord,
  formatDateKey,
  isStudySessionRecord,
  parseDateKey,
  type StudySessionRecord,
} from "@/features/sessions/session-records";
import {
  createTimerState,
  endTimer,
  pauseTimer,
  resetTimer,
  resumeTimer,
  setTimerDuration,
  startTimer,
  switchTimerMode,
  tickTimer,
  timerModeLabels,
  timerStatusLabels,
  type TimerMode,
  type TimerState,
} from "@/features/timer/timer";
import { SessionCalendar } from "./session-calendar";
import { VisualTimerProgress } from "./visual-timer-progress";

const LOCAL_SESSIONS_STORAGE_KEY = "study-timer.local-sessions.v1";

export function TimerWorkspace() {
  const [timer, setTimer] = useState(() => createTimerState());
  const [sessions, setSessions] = useState<StudySessionRecord[]>(() => readStoredSessions());
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateKey(formatDateKey(new Date())));
  const sessionStartedAtRef = useRef<string | null>(null);

  const isRunning = timer.status === "running";
  const canEnd = timer.status === "running" || timer.status === "paused";
  const modeLabel = timerModeLabels[timer.mode];

  useEffect(() => {
    writeStoredSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    if (timer.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimer((current) => {
        const nextTimer = tickTimer(current);

        if (current.status === "running" && nextTimer.status === "completed") {
          recordTimerSession(nextTimer, true);
        }

        return nextTimer;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timer.status]);

  const recordTimerSession = (nextTimer: TimerState, completed: boolean) => {
    const startedAt = sessionStartedAtRef.current;

    if (!startedAt) {
      return;
    }

    const endedAt = new Date().toISOString();
    const endedDate = new Date(endedAt);
    const durationSeconds = completed ? nextTimer.totalSeconds : nextTimer.elapsedSeconds;

    sessionStartedAtRef.current = null;

    if (durationSeconds <= 0) {
      return;
    }

    const session = createSessionRecord({
      id: createLocalSessionId(startedAt, endedAt),
      mode: nextTimer.mode,
      startedAt,
      endedAt,
      durationSeconds,
      plannedSeconds: nextTimer.totalSeconds,
      completed,
    });

    setSessions((current) => [session, ...current.filter((item) => item.id !== session.id)]);
    setSelectedDate(formatDateKey(endedDate));
    setVisibleMonth(new Date(endedDate.getFullYear(), endedDate.getMonth(), 1));
  };

  const toggleTimer = () => {
    if (timer.status !== "running" && timer.status !== "paused") {
      sessionStartedAtRef.current = new Date().toISOString();
    }

    setTimer((current) => {
      if (current.status === "running") {
        return pauseTimer(current);
      }

      if (current.status === "paused") {
        return resumeTimer(current);
      }

      return startTimer(current);
    });
  };

  const handleResetTimer = () => {
    sessionStartedAtRef.current = null;
    setTimer((current) => resetTimer(current));
  };

  const handleEndTimer = () => {
    const endedTimer = endTimer(timer);

    setTimer(endedTimer);
    recordTimerSession(endedTimer, false);
  };

  const changeMode = (mode: TimerMode) => {
    sessionStartedAtRef.current = null;
    setTimer((current) => switchTimerMode(current, mode));
  };

  const changeDuration = (mode: TimerMode, deltaMinutes: number) => {
    sessionStartedAtRef.current = null;
    setTimer((current) => {
      const currentMinutes = mode === "study" ? current.settings.studyMinutes : current.settings.restMinutes;
      const nextMinutes = Math.min(
        MAX_DURATION_MINUTES,
        Math.max(MIN_DURATION_MINUTES, currentMinutes + deltaMinutes),
      );

      return setTimerDuration(current, mode, nextMinutes);
    });
  };

  return (
    <div className="grid flex-1 gap-6">
      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <section className="flex min-h-[520px] flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex rounded-lg border border-[var(--line)] bg-white p-1">
                {(["study", "rest"] as TimerMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={timer.mode === mode}
                    disabled={isRunning}
                    onClick={() => changeMode(mode)}
                    className={`min-h-10 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      timer.mode === mode ? "bg-moss text-white" : "text-[var(--muted)] hover:bg-paper hover:text-ink"
                    }`}
                  >
                    {timerModeLabels[mode]}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold text-moss">{modeLabel}</p>
              <p className="mt-2 text-6xl font-semibold tabular-nums tracking-normal sm:text-7xl">
                {formatTimerClock(timer.remainingSeconds)}
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--muted)]">{timerStatusLabels[timer.status]}</p>
            </div>
            <div className="grid size-20 place-items-center rounded-lg bg-white text-moss ring-1 ring-[var(--line)] sm:size-24">
              {isRunning ? <Pause aria-hidden="true" size={34} /> : <Play aria-hidden="true" size={34} fill="currentColor" />}
            </div>
          </div>

          <VisualTimerProgress timer={timer} />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={toggleTimer}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-moss px-4 text-sm font-semibold text-white transition hover:bg-leaf"
            >
              {isRunning ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} fill="currentColor" />}
              {timer.status === "running" ? "일시정지" : timer.status === "paused" ? "재개" : "시작"}
            </button>
            <button
              type="button"
              disabled={!canEnd}
              onClick={handleEndTimer}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-semibold text-ink transition hover:border-peach hover:text-peach disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Square aria-hidden="true" size={17} fill="currentColor" />
              종료
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
            >
              <TimerReset aria-hidden="true" size={18} />
              초기화
            </button>
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <DurationControl
            label="공부 시간"
            value={timer.settings.studyMinutes}
            disabled={isRunning}
            onDecrease={() => changeDuration("study", -DURATION_STEP_MINUTES)}
            onIncrease={() => changeDuration("study", DURATION_STEP_MINUTES)}
          />
          <DurationControl
            label="휴식 시간"
            value={timer.settings.restMinutes}
            disabled={isRunning}
            onDecrease={() => changeDuration("rest", -DURATION_STEP_MINUTES)}
            onIncrease={() => changeDuration("rest", DURATION_STEP_MINUTES)}
          />
          <article className="rounded-lg border border-[var(--line)] bg-white p-5">
            <p className="text-sm font-semibold text-[var(--muted)]">현재 상태</p>
            <p className="mt-3 text-2xl font-semibold">{timerStatusLabels[timer.status]}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {modeLabel} {formatTimerClock(timer.remainingSeconds)}
            </p>
          </article>
        </aside>
      </div>

      <SessionCalendar
        sessions={sessions}
        selectedDate={selectedDate}
        visibleMonth={visibleMonth}
        onSelectedDateChange={setSelectedDate}
        onVisibleMonthChange={setVisibleMonth}
      />
    </div>
  );
}

function DurationControl({
  label,
  value,
  disabled,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <article className="rounded-lg border border-[var(--line)] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{label}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">5분 단위</p>
        </div>
        <p className="rounded-md bg-paper px-3 py-2 text-lg font-semibold tabular-nums">{value}분</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-label={`${label} 5분 줄이기`}
          disabled={disabled || value <= MIN_DURATION_MINUTES}
          onClick={onDecrease}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--line)] text-ink transition hover:border-moss hover:text-moss disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus aria-hidden="true" size={18} />
        </button>
        <button
          type="button"
          aria-label={`${label} 5분 늘리기`}
          disabled={disabled || value >= MAX_DURATION_MINUTES}
          onClick={onIncrease}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--line)] text-ink transition hover:border-moss hover:text-moss disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>
    </article>
  );
}

function createLocalSessionId(startedAt: string, endedAt: string): string {
  return `local-${startedAt}-${endedAt}`.replace(/[^a-zA-Z0-9-]/g, "-");
}

function readStoredSessions(): StudySessionRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawSessions = window.localStorage.getItem(LOCAL_SESSIONS_STORAGE_KEY);

  if (!rawSessions) {
    return [];
  }

  try {
    const parsedSessions: unknown = JSON.parse(rawSessions);

    return Array.isArray(parsedSessions) ? parsedSessions.filter(isStudySessionRecord) : [];
  } catch {
    return [];
  }
}

function writeStoredSessions(sessions: StudySessionRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}
