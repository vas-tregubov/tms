import { prepareMockRouteAssignment } from '@/entities/route'
import {
  getMockTripReferences,
  saveMockTrip,
  type CreateTripInput,
  type Trip,
} from '@/entities/trip'
import { baseApi, type ApiError } from '@/shared/api'

import { validateTripDraft } from '../lib/validation'

// Temporary use-case orchestration; replace queryFn with one backend request later.
export const saveTripWithRoutes = (input: CreateTripInput): Trip => {
  const { drivers, vehicles } = getMockTripReferences()
  const driver = drivers.find((item) => item.id === input.driverId)
  const vehicle = vehicles.find((item) => item.id === input.vehicleId)
  const errors = validateTripDraft({ ...input, comment: input.comment ?? '' })
  if (!driver || !vehicle || Object.keys(errors).length)
    throw { status: 400, message: 'Проверьте обязательные данные рейса.' }
  const assignment = prepareMockRouteAssignment(input.routeIds)
  // All validation is complete. No asynchronous gap or fallible operation after persistence.
  const trip = saveMockTrip({
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    driver,
    vehicle,
    routes: assignment.routes,
    comment: input.comment,
  })
  assignment.commit()
  return trip
}

const createTripApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Trip', 'Route'] })
  .injectEndpoints({
    endpoints: (build) => ({
      createTrip: build.mutation<Trip, CreateTripInput>({
        queryFn: async (input) => {
          await new Promise<void>((resolve) => setTimeout(resolve, 150))
          try {
            return { data: saveTripWithRoutes(input) }
          } catch (error) {
            if (
              error &&
              typeof error === 'object' &&
              'status' in error &&
              'message' in error
            )
              return { error: error as ApiError }
            return {
              error: {
                status: 500,
                message: 'Не удалось сохранить рейс. Попробуйте ещё раз.',
              },
            }
          }
        },
        invalidatesTags: (result) => (result ? ['Trip', 'Route'] : []),
      }),
    }),
  })
export const { useCreateTripMutation } = createTripApi
