// Mirrors components/schemas/ApiError and ValidationDetail in OpenAPI.
export type ValidationDetail = {
  field: string;
  code: string;
  message: string;
};

export type ApiError = {
  code: string;
  message: string;
  requestId?: string;
  details?: ValidationDetail[];
};
