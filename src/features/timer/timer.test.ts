import { describe, expect, it } from "vitest";
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
} from "./timer";

describe("timer core", () => {
  it("creates a study timer from 5-minute settings", () => {
    const timer = createTimerState({ studyMinutes: 25, restMinutes: 5 });

    expect(timer.mode).toBe("study");
    expect(timer.status).toBe("idle");
    expect(timer.totalSeconds).toBe(1500);
    expect(timer.remainingSeconds).toBe(1500);
  });

  it("rejects non 5-minute duration settings", () => {
    expect(() => createTimerState({ studyMinutes: 24, restMinutes: 5 })).toThrow(RangeError);
    expect(() => setTimerDuration(createTimerState(), "rest", 7)).toThrow(RangeError);
  });

  it("decreases remaining time while running", () => {
    const timer = tickTimer(startTimer(createTimerState()), 90);

    expect(timer.status).toBe("running");
    expect(timer.remainingSeconds).toBe(1410);
    expect(timer.elapsedSeconds).toBe(90);
  });

  it("pauses and resumes without losing remaining time", () => {
    const running = tickTimer(startTimer(createTimerState()), 30);
    const paused = pauseTimer(running);
    const ignoredTick = tickTimer(paused, 30);
    const resumed = resumeTimer(ignoredTick);

    expect(paused.status).toBe("paused");
    expect(ignoredTick.remainingSeconds).toBe(running.remainingSeconds);
    expect(resumed.status).toBe("running");
  });

  it("completes when the remaining time reaches zero", () => {
    const timer = tickTimer(startTimer(createTimerState({ studyMinutes: 5, restMinutes: 5 })), 300);

    expect(timer.status).toBe("completed");
    expect(timer.remainingSeconds).toBe(0);
    expect(timer.elapsedSeconds).toBe(300);
  });

  it("supports ending and resetting a session", () => {
    const ended = endTimer(tickTimer(startTimer(createTimerState()), 120));
    const reset = resetTimer(ended);

    expect(ended.status).toBe("ended");
    expect(ended.remainingSeconds).toBe(0);
    expect(ended.elapsedSeconds).toBe(120);
    expect(reset.status).toBe("idle");
    expect(reset.remainingSeconds).toBe(reset.totalSeconds);
  });

  it("switches between study and rest timers", () => {
    const restTimer = switchTimerMode(createTimerState({ studyMinutes: 25, restMinutes: 10 }), "rest");

    expect(restTimer.mode).toBe("rest");
    expect(restTimer.totalSeconds).toBe(600);
    expect(restTimer.remainingSeconds).toBe(600);
  });
});
