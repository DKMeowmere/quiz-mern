/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Chainable<Subject = any> {
		getBySel(
			dataTestAttribute: string,
			args?: any
		): Chainable<JQuery<HTMLElement>>
		getBySelLike(
			dataTestPrefixAttribute: string,
			args?: any
		): Chainable<JQuery<HTMLElement>>
		serverRequest(url: string): Cypress.Chainable<any>
	}
}


Cypress.Commands.add("getBySel", (selector, ...args) => {
	return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
	return cy.get(`[data-cy*=${selector}]`, ...args)
})

Cypress.Commands.add("serverRequest", url =>
	cy.request(Cypress.env("SERVER_URL") + url)
)
