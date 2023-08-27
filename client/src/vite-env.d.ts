/// <reference types="vite/client" />

import { Store } from "../../server/types/client/types/state"

declare global {
	interface Window {
		Cypress?: Cypress.Cypress
		store: Store
	}
}
