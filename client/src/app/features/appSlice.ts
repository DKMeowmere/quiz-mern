import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "@backend/types/client/appState"
import lightTheme from "../themes/lightTheme"
import darkTheme from "../themes/darkTheme"
import { UserClient } from "@backend/types/user"

const initialState: AppState = {
	token: "",
	themeType: "LIGHT",
	theme: lightTheme,
	isAppLoading: false,
	user: null,
	isLoggedIn: false,
}

const appSlice = createSlice({
	initialState,
	name: "app",
	reducers: {
		setTheme: (state, action: PayloadAction<string>) => {
			localStorage.setItem("theme", action.payload)
			if (action.payload === "LIGHT") {
				state.theme = lightTheme
				state.themeType = "LIGHT"
			} else {
				state.theme = darkTheme
				state.themeType = "DARK"
			}
		},
		startLoading: state => {
			state.isAppLoading = true
		},
		endLoading: state => {
			state.isAppLoading = false
		},
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload
		},
		login: (state, action: PayloadAction<UserClient>) => {
			state.user = action.payload
			state.isLoggedIn = true
		},
		logout: state => {
			state.user = null
			state.isLoggedIn = false
			state.token = ""
		},
	},
})

export default appSlice.reducer
export const { setTheme, startLoading, endLoading, setToken, login, logout } =
	appSlice.actions
