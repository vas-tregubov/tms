import { baseApi } from '@/shared/api'

import type { Trip } from '../model/types'
import type { TripStatusRecord } from './types'
import { mockTripTimeline } from './mockTripTimeline'
import { getMockTrips, getMockTripReferences } from './mockTripSource'

const waitForMockResponse = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 150))

const tripApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Trip'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getTripReferences: build.query<
        ReturnType<typeof getMockTripReferences>,
        void
      >({
        queryFn: async () => {
          await waitForMockResponse()
          return { data: getMockTripReferences() }
        },
      }),
      getTrips: build.query<Trip[], void>({
        providesTags: ['Trip'],
        queryFn: async () => {
          await waitForMockResponse()
          return { data: getMockTrips() }
        },
      }),
      getTripTimeline: build.query<TripStatusRecord[], string>({
        queryFn: async (id) => {
          await waitForMockResponse()
          if (!getMockTrips().some((trip) => trip.id === id))
            return { error: { status: 404, message: 'Рейс не найден' } }
          return {
            data: Object.hasOwn(mockTripTimeline, id)
              ? mockTripTimeline[id]
              : [],
          }
        },
      }),
      getTripById: build.query<Trip, string>({
        providesTags: ['Trip'],
        queryFn: async (id) => {
          await waitForMockResponse()
          const trip = getMockTrips().find((item) => item.id === id)
          return trip
            ? { data: trip }
            : { error: { status: 404, message: 'Рейс не найден' } }
        },
      }),
    }),
  })

export const {
  useGetTripsQuery,
  useGetTripReferencesQuery,
  useGetTripByIdQuery,
  useGetTripTimelineQuery,
} = tripApi
