import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createTimerState, startTimer, tickTimer } from "@/features/timer/timer";
import { VisualTimerProgress } from "./visual-timer-progress";

describe("VisualTimerProgress", () => {
  it("renders a full visual mask for a fresh study timer", () => {
    render(<VisualTimerProgress timer={createTimerState()} />);

    const progress = screen.getByRole("meter", { name: "남은 공부 시간 이미지" });
    const mask = screen.getByTestId("visual-progress-mask");

    expect(progress).toHaveAttribute("aria-valuenow", "1500");
    expect(progress).toHaveAttribute("data-progress-percent", "100");
    expect(mask).toHaveStyle({ height: "100%" });
    expect(screen.getByText("공부")).toBeInTheDocument();
  });

  it("renders a partial visual mask from remaining time", () => {
    const timer = tickTimer(startTimer(createTimerState({ studyMinutes: 10, restMinutes: 5 })), 300);

    render(<VisualTimerProgress timer={timer} />);

    const progress = screen.getByTestId("visual-progress");
    const mask = screen.getByTestId("visual-progress-mask");

    expect(progress).toHaveAttribute("data-progress-percent", "50");
    expect(mask).toHaveStyle({ height: "50%" });
  });

  it("uses rest mode labeling for rest timers", () => {
    render(<VisualTimerProgress timer={createTimerState(undefined, "rest")} />);

    expect(screen.getByRole("meter", { name: "남은 휴식 시간 이미지" })).toBeInTheDocument();
    expect(screen.getByText("휴식")).toBeInTheDocument();
  });
});
