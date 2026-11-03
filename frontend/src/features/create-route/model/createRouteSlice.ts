import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type RouteDraft = {
  date: string
  status: string
  startPointId: string
  endPointId: string
  startTime: string
  endTime: string
  comment: string
}

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
      state.currentStep = Math.min(4, Math.max(1, action.payload))
    },
    resetCreateRoute: () => initialState,
  },
})
export const { updateDraft, setStep, resetCreateRoute } =
  createRouteSlice.actions
export default createRouteSlice.reducer
