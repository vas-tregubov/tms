import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { afterEach, expect, it } from 'vitest'
import type { PropsWithChildren } from 'react'

import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'

import { useGetTripTimelineQuery } from './tripApi'

const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})
const wrapper = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
)
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
})
it('loads the temporary timeline projection and keeps unknown IDs not found', async () => {
  const { result } = renderHook(
    () => ({
      existing: useGetTripTimelineQuery('trip-002'),
      missing: useGetTripTimelineQuery('unknown-trip'),
    }),
    { wrapper },
  )
  await waitFor(() => {
    expect(result.current.existing.isSuccess).toBe(true)
    expect(result.current.missing.isError).toBe(true)
  })
  expect(result.current.existing.data?.map((item) => item.status)).toEqual([
    'created',
    'assigned',
    'intransit',
    'completed',
  ])
  expect(result.current.existing.data?.[3]).toMatchObject({
    dateTime: '01.11.2026 11:00',
    author: 'Алексей Петров',
    comment: 'Рейс выполнен',
  })
  expect(result.current.missing.error).toEqual({
    status: 404,
    message: 'Рейс не найден',
  })
})
