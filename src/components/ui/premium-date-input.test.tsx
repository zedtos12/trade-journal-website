import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PremiumDateInput } from "./premium-date-input";

describe("PremiumDateInput", () => {
  it("renders a themed text date field instead of a native browser picker", () => {
    render(<PremiumDateInput name="openDate" defaultValue="2026-06-13" ariaLabel="Open date" required />);

    const input = screen.getByLabelText("Open date");
    expect(input).toHaveAttribute("name", "openDate");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("pattern", "\\d{4}-\\d{2}-\\d{2}");
    expect(input).not.toHaveAttribute("type", "date");
  });

  it("opens a custom calendar dialog and writes the chosen value back to the form input", () => {
    render(<PremiumDateInput name="dateFrom" defaultValue="2026-06-13" ariaLabel="Filter date from" />);

    fireEvent.click(screen.getByLabelText("Open Filter date from calendar"));

    expect(screen.getByRole("dialog", { name: "Filter date from calendar" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "15" }));

    expect(screen.getByLabelText("Filter date from")).toHaveValue("2026-06-15");
  });
});
