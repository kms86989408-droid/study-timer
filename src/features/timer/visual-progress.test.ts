import { describe, expect, it } from "vitest";
import { getVisualMaskHeight, getVisualProgressPercent, getVisualProgressTone } from "./visual-progress";

describe("visual timer progress", () => {
  it("returns a full mask for a fresh timer", () => {
    expect(getVisualProgressPercent({ remainingSeconds: 1500, totalSeconds: 1500 })).toBe(100);
    expect(getVisualMaskHeight({ remainingSeconds: 1500, totalSeconds: 1500 })).toBe("100%");
  });

  it("returns a partial mask for elapsed time", () => {
    expect(getVisualProgressPercent({ remainingSeconds: 750, totalSeconds: 1500 })).toBe(50);
    expect(getVisualMaskHeight({ remainingSeconds: 375, totalSeconds: 1500 })).toBe("25%");
  });

  it("clamps visual progress into a valid percentage", () => {
    expect(getVisualProgressPercent({ remainingSeconds: 1800, totalSeconds: 1500 })).toBe(100);
    expect(getVisualProgressPercent({ remainingSeconds: -1, totalSeconds: 1500 })).toBe(0);
    expect(getVisualProgressPercent({ remainingSeconds: 10, totalSeconds: 0 })).toBe(0);
  });

  it("provides mode-specific tones", () => {
    expect(getVisualProgressTone("study")).toContain("moss");
    expect(getVisualProgressTone("rest")).toContain("peach");
  });
});
