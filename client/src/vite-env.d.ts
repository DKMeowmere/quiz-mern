/// <reference types="vite/client" />

import { Store } from "./types/state"

declare global {
	interface Window {
		Cypress?: Cypress.Cypress
		store: Store
	}
}
