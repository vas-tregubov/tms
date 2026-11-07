import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { ROUTE_FORM_STEPS, type RouteFormValues } from '@/entities/route'

export type RouteDraft = RouteFormValues & { status: string }

export const emptyDraft: RouteDraft = {
  date: '',
  status: '',
  startPointId: '',
  endPointId: '',
  startTime: '',
  endTime: '',
  comment: '',
}
export type CreateRouteState = { draft: RouteDraft; currentStep: number }
const initialState: CreateRouteState = { draft: emptyDraft, currentStep: 1 }

const createRouteSlice = createSlice({
  name: 'createRoute',
  initialState,
  reducers: {
    updateDraft: (state, action: PayloadAction<Partial<RouteDraft>>) => {
      Object.assign(state.draft, action.payload)
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = Math.min(
        ROUTE_FORM_STEPS.length,
        Math.max(1, action.payload),
      )
    },
    resetCreateRoute: () => initialState,
  },
})
export const { updateDraft, setStep, resetCreateRoute } =
  createRouteSlice.actions
export default createRouteSlice.reducer
