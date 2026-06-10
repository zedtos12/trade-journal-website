export function buildPagination(input: { page?: string | number; pageSize?: string | number }) {
  const rawPage = Number(input.page ?? 1);
  const rawPageSize = Number(input.pageSize ?? 20);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? Math.min(Math.floor(rawPageSize), 100) : 20;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
