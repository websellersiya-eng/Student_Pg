export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
