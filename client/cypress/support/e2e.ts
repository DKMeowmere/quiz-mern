import "./commands"

beforeEach(() => {
	cy.serverRequest("/reset")
})
