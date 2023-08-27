import { AlertState } from "./alert"
import { AppState } from "./appState"

export type State = {
	app: AppState
	alert: AlertState
}
