export interface PaginationQuery {
  page?: number | string;
  perPage?: number | string;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  perPage: number;
}

export function paginate(query: PaginationQuery): PaginationResult {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 15));
  const skip = (page - 1) * perPage;
  return { skip, take: perPage, page, perPage };
}

export function buildPaginationMeta(total: number, page: number, perPage: number) {
  return {
    total,
    page,
    perPage,
    lastPage: Math.ceil(total / perPage),
  };
}
