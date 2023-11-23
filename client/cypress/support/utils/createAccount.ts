/// <reference types="cypress" />

export function createAccount(user: Omit<any, "userQuizes" | "_id">) {
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
}
