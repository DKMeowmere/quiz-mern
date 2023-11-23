import { Theme } from "./theme"
import { UserClient } from "../user"

export type AppState = {
	token: string
	theme: Theme
	themeType: "LIGHT" | "DARK"
	isAppLoading: boolean
	documentYBeforeLoading: number
	isLoggedIn: boolean
	user: UserClient | null
}
