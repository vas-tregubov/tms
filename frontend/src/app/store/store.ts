import { configureStore } from '@reduxjs/toolkit'

import { createRouteReducer } from '@/features/create-route'
import { baseApi } from '@/shared/api'

export const store = configureStore({
  reducer: {
    createRoute: createRouteReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
})
