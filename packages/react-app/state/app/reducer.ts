import { createSlice } from '@reduxjs/toolkit'

export interface ApplicationState {
  readonly blockNumber: number
}

const initialState: ApplicationState = {
  blockNumber: 0,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateBlockNumber(state, action) {
      const { blockNumber } = action.payload
      state.blockNumber = blockNumber
    },
  },
})

export const { updateBlockNumber } = appSlice.actions
export default appSlice.reducer
