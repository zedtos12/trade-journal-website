import { describe, expect, it } from "vitest";
import { buildPagination } from "@/lib/trades/pagination";

describe("trade history pagination", () => {
  it("defaults to first page with PRD-friendly page size", () => {
    expect(buildPagination({})).toEqual({ page: 1, pageSize: 20, skip: 0, take: 20 });
  });

  it("calculates skip/take and clamps unsafe values", () => {
    expect(buildPagination({ page: "3", pageSize: "10" })).toEqual({ page: 3, pageSize: 10, skip: 20, take: 10 });
    expect(buildPagination({ page: "-1", pageSize: "500" })).toEqual({ page: 1, pageSize: 100, skip: 0, take: 100 });
  });
});
