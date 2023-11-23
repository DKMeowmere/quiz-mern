import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "@backend/types/client/appState"
import { UserClient } from "@backend/types/user"
import lightTheme from "../themes/lightTheme"
import darkTheme from "../themes/darkTheme"

const initialState: AppState = {
	token: "",
	themeType: "LIGHT",
	theme: lightTheme,
	isAppLoading: false,
	documentYBeforeLoading: 0,
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
			state.documentYBeforeLoading = document.documentElement.scrollTop || 0
		},
		endLoading: state => {
			state.isAppLoading = false
			window.scrollTo(0, state.documentYBeforeLoading)
		},
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload
		},
		setUser: (state, action: PayloadAction<UserClient>) => {
			state.user = action.payload
		},
		login: state => {
			state.isLoggedIn = true
		},
		logout: state => {
			state.user = null
			state.isLoggedIn = false
			state.token = ""
			localStorage.removeItem("user")
		},
	},
})

export default appSlice.reducer
export const { setTheme, startLoading, endLoading, setToken, login, logout, setUser } =
	appSlice.actions
