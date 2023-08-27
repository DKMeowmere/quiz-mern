import { Alert, AlertState } from "@backend/types/client/alert"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: AlertState = { alertsQueue: [], alertLifeTime: 5000 }

const alertSlice = createSlice({
	initialState,
	name: "alert",
	reducers: {
		enqueueAlert: (state, action: PayloadAction<Omit<Alert, "id">>) => {
			state.alertsQueue.push({ id: crypto.randomUUID(), ...action.payload })
		},
		dequeueAlert: state => {
			state.alertsQueue.shift()
		},
	},
})

export default alertSlice.reducer
export const { enqueueAlert, dequeueAlert } = alertSlice.actions
