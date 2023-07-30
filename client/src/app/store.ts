import { configureStore } from "@reduxjs/toolkit"
import appSlice from "./features/appSlice"
import alertSlice from "./features/alertSlice"

const store = configureStore({
	reducer: {
		app: appSlice,
		alert: alertSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
