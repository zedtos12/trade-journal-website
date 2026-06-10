import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
const seedScript = readFileSync(join(process.cwd(), "prisma/seed.mjs"), "utf8");

describe("dummy seed script", () => {
  it("exposes a database seed command", () => {
    expect(packageJson.scripts["db:seed"]).toBe("node prisma/seed.mjs");
  });

  it("creates the requested admin dummy user and realistic trades", () => {
    expect(seedScript).toContain("admin@tradejournal.local");
    expect(seedScript).toContain("@silver0");
    expect(seedScript).toContain("createMany");
    expect(seedScript).toContain("London breakout");
    expect(seedScript).toContain("New York continuation");
  });
});
