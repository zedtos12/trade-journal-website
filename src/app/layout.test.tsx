import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("root layout", () => {
  it("suppresses browser extension hydration noise on root nodes", () => {
    const layout = RootLayout({ children: <main>content</main> });
    const body = layout.props.children;

    expect(layout.props.suppressHydrationWarning).toBe(true);
    expect(body.props.suppressHydrationWarning).toBe(true);
  });
});
