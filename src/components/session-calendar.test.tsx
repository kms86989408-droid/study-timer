import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createSessionRecord } from "@/features/sessions/session-records";
import { SessionCalendar } from "./session-calendar";

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
    startedAt: "2026-04-28T00:30:00.000Z",
    endedAt: "2026-04-28T00:35:00.000Z",
    durationSeconds: 300,
    plannedSeconds: 300,
    completed: true,
  }),
];

describe("SessionCalendar", () => {
  it("renders monthly summaries and selected date sessions", () => {
    render(
      <SessionCalendar
        sessions={sessions}
        selectedDate="2026-04-28"
        visibleMonth={new Date(2026, 3, 1)}
        onSelectedDateChange={vi.fn()}
        onVisibleMonthChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "기록 캘린더" })).toBeInTheDocument();
    expect(screen.getByText("2026년 4월")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026-04-28 기록 2회" })).toBeInTheDocument();
    expect(screen.getAllByText("25분").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5분").length).toBeGreaterThan(0);
  });

  it("calls handlers when navigating or selecting days", async () => {
    const user = userEvent.setup();
    const onSelectedDateChange = vi.fn();
    const onVisibleMonthChange = vi.fn();

    render(
      <SessionCalendar
        sessions={sessions}
        selectedDate="2026-04-28"
        visibleMonth={new Date(2026, 3, 1)}
        onSelectedDateChange={onSelectedDateChange}
        onVisibleMonthChange={onVisibleMonthChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "다음 달" }));
    await user.click(screen.getByRole("button", { name: "2026-04-28 기록 2회" }));

    expect(onVisibleMonthChange).toHaveBeenCalledWith(new Date(2026, 4, 1));
    expect(onSelectedDateChange).toHaveBeenCalledWith("2026-04-28");
  });
});
