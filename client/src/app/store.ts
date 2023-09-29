import { configureStore } from "@reduxjs/toolkit"
import appSlice from "./features/appSlice"
import alertSlice from "./features/alertSlice"
import quizGameSlice from "./features/quizSlice"

const store = configureStore({
	reducer: {
		app: appSlice,
		alert: alertSlice,
		quizGame: quizGameSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
