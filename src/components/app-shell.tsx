import { Brain } from "lucide-react";
import { TimerWorkspace } from "./timer-workspace";

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
          <p className="rounded-lg border border-[var(--line)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--muted)]">
            5분 단위 공부와 휴식
          </p>
        </header>

        <TimerWorkspace />
      </section>
    </main>
  );
}
