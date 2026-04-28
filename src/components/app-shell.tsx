import { Brain, CalendarDays, Coffee } from "lucide-react";
import {
  DEFAULT_REST_MINUTES,
  DEFAULT_STUDY_MINUTES,
  formatDurationLabel,
} from "@/features/settings/duration";
import { TimerWorkspace } from "./timer-workspace";

const todaySegments = [
  { label: "공부", value: formatDurationLabel(DEFAULT_STUDY_MINUTES), tone: "bg-moss text-white" },
  { label: "휴식", value: formatDurationLabel(DEFAULT_REST_MINUTES), tone: "bg-peach text-white" },
  { label: "기록", value: "0회", tone: "bg-wheat text-ink" },
];

export function AppShell() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-moss text-white shadow-soft">
              <Brain aria-hidden="true" size={24} strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">study-timer</h1>
              <p className="mt-1 text-sm font-medium text-[var(--muted)]">오늘의 루틴</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-80">
            {todaySegments.map((segment) => (
              <div key={segment.label} className="rounded-lg border border-[var(--line)] bg-white/70 p-3">
                <p className="text-xs font-semibold text-[var(--muted)]">{segment.label}</p>
                <p className={`mt-2 rounded-md px-2 py-1 text-center text-sm font-semibold ${segment.tone}`}>
                  {segment.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <TimerWorkspace />

          <aside className="grid content-start gap-4">
            <article className="rounded-lg border border-[var(--line)] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-moss/10 text-moss">
                  <Brain aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="text-base font-semibold">공부</h2>
                  <p className="text-sm text-[var(--muted)]">{formatDurationLabel(DEFAULT_STUDY_MINUTES)}</p>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-[var(--line)] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-peach/10 text-peach">
                  <Coffee aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="text-base font-semibold">휴식</h2>
                  <p className="text-sm text-[var(--muted)]">{formatDurationLabel(DEFAULT_REST_MINUTES)}</p>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-[var(--line)] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-wheat/50 text-ink">
                  <CalendarDays aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="text-base font-semibold">캘린더</h2>
                  <p className="text-sm text-[var(--muted)]">오늘 기록 0회</p>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
