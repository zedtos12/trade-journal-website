import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PremiumDateInput } from "./premium-date-input";

const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const dateInputSource = readFileSync(join(process.cwd(), "src/components/ui/premium-date-input.tsx"), "utf8");

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

  it("raises the open date picker above following trade form sections", () => {
    expect(dateInputSource).toContain('data-premium-date-open={open ? "true" : undefined}');
    expect(dateInputSource).toContain("absolute left-0 top-full z-[9999]");
    expect(globals).toContain('.premium-card:has([data-premium-date-open="true"])');
    expect(globals).toContain('form:has([data-premium-date-open="true"])');
    expect(globals).toContain('section:has([data-premium-date-open="true"])');
    expect(globals).toContain('.dropdown-layer:has([data-premium-date-open="true"])');
  });
});
