import { Theme } from "./theme"
import { User } from "./user"

export type AppState = {
	token: string
	theme: Theme
	themeType: "LIGHT" | "DARK"
	isAppLoading: boolean
	isLoggedIn: boolean
	user: User | null
}
