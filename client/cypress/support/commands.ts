/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

Cypress.Commands.add("getBySel", (selector, ...args) => {
	return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
	return cy.get(`[data-cy*=${selector}]`, ...args)
})

Cypress.Commands.add("serverRequest", url =>
	cy.request(Cypress.env("SERVER_URL") + url)
)

Cypress.Commands.add("createAccount", user => {
	cy.visit("/user/create")
	cy.getBySel("name-input").type(user.name)
	cy.getBySel("email-input").type(user.email)
	cy.getBySel("password-input").type(user.password, { force: true })
	cy.getBySel("biography-input").type(user.biography.slice(0, 10))
	cy.getBySel("avatar-input").selectFile(
		"cypress/fixtures/files/hercegBosna.png"
	)
	cy.getBySel("submit-btn").click()
	cy.wait(1000)
	//wait 1s, timeouts not working for getCookie
	cy.getCookie("token").should("exist")
	cy.window()
		.its("store")
		.invoke("getState")
		.its("app")
		.its("isLoggedIn")
		.should("exist")
})

Cypress.Commands.add("deleteAccount", () => {
	cy.getCookie("token").should("exist")
	cy.window()
		.its("store")
		.invoke("getState")
		.its("app")
		.its("isLoggedIn")
		.should("be.true")

	cy.window().then(win => {
		const url = `/user/${win.store.getState().app.user._id}/edit`

		cy.visit(url)
		cy.getBySel("open-delete-account-modal-btn").click()
		cy.getBySel("delete-account-btn").click()

		cy.wait(1000)
		cy.window()
			.its("store")
			.invoke("getState")
			.its("app")
			.its("isLoggedIn")
			.should("be.false")
	})
})
