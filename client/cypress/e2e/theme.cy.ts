/// <reference types="cypress" />

it("switches themes correctly", () => {
	cy.visit("/").then(() => {
		cy.getBySel("theme-btn").click()

		cy.window()
			.its("store")
			.invoke("getState")
			.its("app")
			.its("theme")
			.its("type")
			.should("equal", "DARK")

		cy.getBySel("theme-btn").click()

    cy.window()
    .its("store")
    .invoke("getState")
    .its("app")
    .its("theme")
    .its("type")
    .should("equal", "LIGHT")
	})
})
