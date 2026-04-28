import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatMonthLabel,
  formatSessionDuration,
  getMonthCalendarDays,
  getSessionsForDate,
  shiftMonth,
  summarizeSessionsByDay,
  type StudySessionRecord,
} from "@/features/sessions/session-records";
import { timerModeLabels } from "@/features/timer/timer";

type SessionCalendarProps = {
  sessions: StudySessionRecord[];
  selectedDate: string;
  visibleMonth: Date;
  onSelectedDateChange: (date: string) => void;
  onVisibleMonthChange: (date: Date) => void;
};

const weekDayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export function SessionCalendar({
  sessions,
  selectedDate,
  visibleMonth,
  onSelectedDateChange,
  onVisibleMonthChange,
}: SessionCalendarProps) {
  const summaries = summarizeSessionsByDay(sessions);
  const calendarDays = getMonthCalendarDays(visibleMonth, summaries);
  const selectedSummary = summaries[selectedDate];
  const selectedSessions = getSessionsForDate(sessions, selectedDate);

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-wheat/50 text-ink">
            <CalendarDays aria-hidden="true" size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold">기록 캘린더</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{formatMonthLabel(visibleMonth)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => onVisibleMonthChange(shiftMonth(visibleMonth, -1))}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--line)] px-4 transition hover:border-moss hover:text-moss"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => onVisibleMonthChange(shiftMonth(visibleMonth, 1))}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--line)] px-4 transition hover:border-moss hover:text-moss"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
        <div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[var(--muted)]">
            {weekDayLabels.map((label) => (
              <span key={label} className="py-2">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const hasSessions = day.summary.sessionCount > 0;
              const isSelected = day.date === selectedDate;

              return (
                <button
                  key={day.date}
                  type="button"
                  aria-label={`${day.date} 기록 ${day.summary.sessionCount}회`}
                  aria-pressed={isSelected}
                  onClick={() => onSelectedDateChange(day.date)}
                  className={`min-h-20 rounded-lg border p-2 text-left transition ${
                    isSelected
                      ? "border-moss bg-moss text-white"
                      : "border-[var(--line)] bg-white hover:border-moss hover:bg-paper"
                  } ${day.isInMonth ? "" : "opacity-45"}`}
                >
                  <span className="text-sm font-semibold">{day.dayOfMonth}</span>
                  {hasSessions ? (
                    <span className="mt-2 grid gap-1 text-[11px] font-semibold">
                      <span>{formatSessionDuration(day.summary.studySeconds)}</span>
                      {day.summary.restSeconds > 0 ? <span>{formatSessionDuration(day.summary.restSeconds)}</span> : null}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-lg border border-[var(--line)] bg-paper p-4">
          <p className="text-sm font-semibold text-[var(--muted)]">선택한 날짜</p>
          <h3 className="mt-2 text-2xl font-semibold">{selectedDate}</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <SummaryPill label="공부" value={formatSessionDuration(selectedSummary?.studySeconds ?? 0)} />
            <SummaryPill label="휴식" value={formatSessionDuration(selectedSummary?.restSeconds ?? 0)} />
            <SummaryPill label="기록" value={`${selectedSummary?.sessionCount ?? 0}회`} />
          </div>

          <div className="mt-5 grid gap-3">
            {selectedSessions.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--line)] bg-white p-4 text-sm font-semibold text-[var(--muted)]">
                기록 없음
              </p>
            ) : (
              selectedSessions.map((session) => (
                <article key={session.id} className="rounded-lg border border-[var(--line)] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{timerModeLabels[session.mode]}</p>
                    <p className="text-sm font-semibold text-moss">{formatSessionDuration(session.durationSeconds)}</p>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
                    {new Date(session.startedAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {session.completed ? "완료" : "종료"}
                  </p>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-white p-3">
      <p className="text-xs font-semibold text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}
