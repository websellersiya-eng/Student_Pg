import type { Response } from "express";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  pagination?: Pagination
) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(pagination ? { pagination } : {})
  });
};
