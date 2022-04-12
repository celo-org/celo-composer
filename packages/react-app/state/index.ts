import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/reducer"

const store = configureStore({
  reducer: {
    app: appSlice
  }
})

export default store

export type AppState = ReturnType<typeof store.getState>