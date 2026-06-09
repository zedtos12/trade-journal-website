import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/page";

describe("landing page", () => {
  it("renders the PRD hero headline and primary CTA", () => {
    render(<LandingPage />);

    expect(screen.getByText(/premium forex trade journal/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start journaling/i })).toHaveAttribute("href", "/register");
    expect(screen.getByText(/track every trade, review your performance/i)).toBeInTheDocument();
  });
});
