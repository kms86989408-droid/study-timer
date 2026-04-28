import { describe, expect, it } from "vitest";
import {
  DEFAULT_STUDY_MINUTES,
  durationMinutesToSeconds,
  formatDurationLabel,
  formatTimerClock,
  isFiveMinuteStep,
  normalizeDurationMinutes,
} from "./duration";

describe("duration settings", () => {
  it("accepts positive 5-minute steps", () => {
    expect(isFiveMinuteStep(5)).toBe(true);
    expect(isFiveMinuteStep(25)).toBe(true);
    expect(isFiveMinuteStep(180)).toBe(true);
  });

  it("rejects values outside the 5-minute setting rule", () => {
    expect(isFiveMinuteStep(0)).toBe(false);
    expect(isFiveMinuteStep(7)).toBe(false);
    expect(isFiveMinuteStep(12.5)).toBe(false);
  });

  it("normalizes arbitrary numbers into the supported duration range", () => {
    expect(normalizeDurationMinutes(2)).toBe(5);
    expect(normalizeDurationMinutes(27)).toBe(25);
    expect(normalizeDurationMinutes(999)).toBe(180);
    expect(normalizeDurationMinutes(Number.NaN)).toBe(DEFAULT_STUDY_MINUTES);
  });

  it("converts valid duration minutes to seconds", () => {
    expect(durationMinutesToSeconds(25)).toBe(1500);
    expect(() => durationMinutesToSeconds(7)).toThrow(RangeError);
  });

  it("formats duration labels for Korean UI", () => {
    expect(formatDurationLabel(5)).toBe("5분");
    expect(formatDurationLabel(60)).toBe("1시간");
    expect(formatDurationLabel(85)).toBe("1시간 25분");
  });

  it("formats timer clock values", () => {
    expect(formatTimerClock(1500)).toBe("25:00");
    expect(formatTimerClock(65)).toBe("01:05");
    expect(formatTimerClock(-5)).toBe("00:00");
  });
});
