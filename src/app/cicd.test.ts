import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("CI/CD infrastructure", () => {
  it("GitHub Actions CI workflow file exists", () => {
    const ciPath = join(root, ".github/workflows/ci.yml");
    expect(existsSync(ciPath)).toBe(true);
  });

  it("CI workflow covers lint, test, and build", () => {
    const ciPath = join(root, ".github/workflows/ci.yml");
    const content = readFileSync(ciPath, "utf8");
    expect(content).toContain("npm run lint");
    expect(content).toContain("npm test");
    expect(content).toContain("npm run build");
  });

  it("deploy script exists and is executable-ready", () => {
    const deployPath = join(root, "scripts/deploy.sh");
    expect(existsSync(deployPath)).toBe(true);
    const content = readFileSync(deployPath, "utf8");
    expect(content).toContain("git pull");
    expect(content).toContain("api/health");
    expect(content).toContain("docker compose");
  });

  it("docker-compose production file has log rotation configured", () => {
    const composePath = join(root, "docker-compose.prod.example.yml");
    const content = readFileSync(composePath, "utf8");
    expect(content).toContain("max-size");
    expect(content).toContain("max-file");
    expect(content).toContain("json-file");
  });
});
