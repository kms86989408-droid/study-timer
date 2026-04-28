import type { TimerMode } from "@/features/timer/timer";

export type StudySessionRecord = {
  id: string;
  mode: TimerMode;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  plannedSeconds: number;
  completed: boolean;
};

export type DailySessionSummary = {
  date: string;
  studySeconds: number;
  restSeconds: number;
  sessionCount: number;
};

export type CalendarDay = {
  date: string;
  dayOfMonth: number;
  isInMonth: boolean;
  summary: DailySessionSummary;
};

export type CreateSessionRecordInput = {
  id: string;
  mode: TimerMode;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  plannedSeconds: number;
  completed: boolean;
};

const emptySummary = (date: string): DailySessionSummary => ({
  date,
  studySeconds: 0,
  restSeconds: 0,
  sessionCount: 0,
});

const padTwo = (value: number): string => String(value).padStart(2, "0");

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatMonthKey(date: Date): string {
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}`;
}

export function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function shiftMonth(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function createSessionRecord(input: CreateSessionRecordInput): StudySessionRecord {
  return {
    ...input,
    durationSeconds: Math.max(0, Math.floor(input.durationSeconds)),
    plannedSeconds: Math.max(0, Math.floor(input.plannedSeconds)),
  };
}

export function summarizeSessionsByDay(sessions: StudySessionRecord[]): Record<string, DailySessionSummary> {
  return sessions.reduce<Record<string, DailySessionSummary>>((summaries, session) => {
    const date = formatDateKey(new Date(session.endedAt));
    const summary = summaries[date] ?? emptySummary(date);

    summaries[date] = {
      date,
      studySeconds: summary.studySeconds + (session.mode === "study" ? session.durationSeconds : 0),
      restSeconds: summary.restSeconds + (session.mode === "rest" ? session.durationSeconds : 0),
      sessionCount: summary.sessionCount + 1,
    };

    return summaries;
  }, {});
}

export function getSessionsForDate(sessions: StudySessionRecord[], date: string): StudySessionRecord[] {
  return sessions
    .filter((session) => formatDateKey(new Date(session.endedAt)) === date)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export function getMonthCalendarDays(
  monthDate: Date,
  summaries: Record<string, DailySessionSummary> = {},
): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstCalendarDay = new Date(year, month, 1 - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }, (_, offset) => {
    const day = new Date(firstCalendarDay);
    day.setDate(firstCalendarDay.getDate() + offset);

    const date = formatDateKey(day);

    return {
      date,
      dayOfMonth: day.getDate(),
      isInMonth: day.getMonth() === month,
      summary: summaries[date] ?? emptySummary(date),
    };
  });
}

export function formatSessionDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (safeSeconds > 0 && safeSeconds < 60) {
    return "1분 미만";
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }

  return `${minutes}분`;
}

export function isStudySessionRecord(value: unknown): value is StudySessionRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<StudySessionRecord>;

  return (
    typeof session.id === "string" &&
    (session.mode === "study" || session.mode === "rest") &&
    typeof session.startedAt === "string" &&
    typeof session.endedAt === "string" &&
    typeof session.durationSeconds === "number" &&
    typeof session.plannedSeconds === "number" &&
    typeof session.completed === "boolean"
  );
}
