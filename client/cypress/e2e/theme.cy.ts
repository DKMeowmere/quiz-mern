/// <reference types="cypress" />

it("switches themes correctly", () => {
	cy.visit("/").then(() => {
		cy.getBySel("theme-btn").click()

		cy.store().its("app").its("theme").its("type").should("equal", "DARK")

		cy.getBySel("theme-btn").click()

		cy.store().its("app").its("theme").its("type").should("equal", "LIGHT")
	})
})
