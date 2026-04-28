import { describe, expect, it } from "vitest";
import {
  createSessionRecord,
  formatDateKey,
  formatMonthKey,
  formatSessionDuration,
  getMonthCalendarDays,
  getSessionsForDate,
  isStudySessionRecord,
  summarizeSessionsByDay,
} from "./session-records";

const sessions = [
  createSessionRecord({
    id: "study-1",
    mode: "study",
    startedAt: "2026-04-28T00:00:00.000Z",
    endedAt: "2026-04-28T00:25:00.000Z",
    durationSeconds: 1500,
    plannedSeconds: 1500,
    completed: true,
  }),
  createSessionRecord({
    id: "rest-1",
    mode: "rest",
    startedAt: "2026-04-28T01:00:00.000Z",
    endedAt: "2026-04-28T01:05:00.000Z",
    durationSeconds: 300,
    plannedSeconds: 300,
    completed: true,
  }),
  createSessionRecord({
    id: "study-2",
    mode: "study",
    startedAt: "2026-04-29T00:00:00.000Z",
    endedAt: "2026-04-29T00:10:00.000Z",
    durationSeconds: 600,
    plannedSeconds: 1500,
    completed: false,
  }),
];

describe("session records", () => {
  it("formats local date and month keys", () => {
    const date = new Date(2026, 3, 28);

    expect(formatDateKey(date)).toBe("2026-04-28");
    expect(formatMonthKey(date)).toBe("2026-04");
  });

  it("summarizes sessions by day and mode", () => {
    const summaries = summarizeSessionsByDay(sessions);

    expect(summaries["2026-04-28"]).toEqual({
      date: "2026-04-28",
      studySeconds: 1500,
      restSeconds: 300,
      sessionCount: 2,
    });
    expect(summaries["2026-04-29"].studySeconds).toBe(600);
  });

  it("returns sessions for a selected date sorted by most recent start", () => {
    const selectedSessions = getSessionsForDate(sessions, "2026-04-28");

    expect(selectedSessions.map((session) => session.id)).toEqual(["rest-1", "study-1"]);
  });

  it("builds a stable 6-week month calendar with summaries", () => {
    const summaries = summarizeSessionsByDay(sessions);
    const days = getMonthCalendarDays(new Date(2026, 3, 1), summaries);

    expect(days).toHaveLength(42);
    expect(days[0].date).toBe("2026-03-29");
    expect(days.find((day) => day.date === "2026-04-28")?.summary.sessionCount).toBe(2);
  });

  it("formats durations for calendar labels", () => {
    expect(formatSessionDuration(1)).toBe("1분 미만");
    expect(formatSessionDuration(300)).toBe("5분");
    expect(formatSessionDuration(3900)).toBe("1시간 5분");
  });

  it("guards stored session records", () => {
    expect(isStudySessionRecord(sessions[0])).toBe(true);
    expect(isStudySessionRecord({ id: "bad" })).toBe(false);
  });
});
