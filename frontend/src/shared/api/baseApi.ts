import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export type ApiError = {
  status: number
  message: string
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<ApiError>(),
  endpoints: () => ({}),
})
