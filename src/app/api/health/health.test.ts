import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";
import { prisma } from "@/lib/db";

// Mock prisma database call
vi.mock("@/lib/db", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe("API Health Endpoint", () => {
  it("returns 200 OK when database is healthy", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([1]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.service).toBe("trade-journal-api");
    expect(data.timestamp).toBeDefined();
  });

  it("returns 503 Service Unavailable when database fails", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error("DB Connection Error"));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(503);
    expect(data.status).toBe("error");
    expect(data.message).toBe("Database connection failed");
  });
});
