import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app"

const store = configureStore({
  reducer: {
    app: appSlice
  }
})

export default store

export type AppState = ReturnType<typeof store.getState>