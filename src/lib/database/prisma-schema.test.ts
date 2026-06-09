import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Prisma PostgreSQL database setup", () => {
  const root = process.cwd();

  it("uses PostgreSQL via Prisma instead of SQLite for SaaS-ready persistence", () => {
    const schema = fs.readFileSync(path.join(root, "prisma/schema.prisma"), "utf8");

    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('url      = env("DATABASE_URL")');
    expect(schema).toContain("model User");
    expect(schema).toContain("model Session");
    expect(schema).toContain("model Trade");
    expect(schema).toContain("@@index([userId, openDate])");
  });

  it("documents DATABASE_URL without committing real credentials", () => {
    const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");

    expect(envExample).toContain("DATABASE_URL=");
    expect(envExample).toContain("postgresql://");
    expect(envExample).not.toContain("password123");
  });
});
