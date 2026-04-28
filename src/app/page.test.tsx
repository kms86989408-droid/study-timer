import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the timer workspace", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "study-timer" })).toBeInTheDocument();
    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getAllByText("공부").length).toBeGreaterThan(0);
    expect(screen.getAllByText("휴식").length).toBeGreaterThan(0);
  });
});
