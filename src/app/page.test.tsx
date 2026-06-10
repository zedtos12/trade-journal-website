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

  it("uses the premium animation foundation on the landing experience", () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector("main")?.className).toContain("bg-grid-luxury");
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("animate-fade-up");
    expect(screen.getByRole("link", { name: /start journaling/i }).className).toContain("premium-button");
    expect(container.querySelector('[data-testid="dashboard-preview"]')?.className).toContain("premium-card");
    expect(container.querySelector('[data-testid="feature-card-manual-trade-journal"]')?.className).toContain("interactive-card");
  });
});
