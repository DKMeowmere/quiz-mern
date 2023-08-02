import user from "../fixtures/user"

context("user", () => {
	describe("given the user info", () => {
		it("creates user and logs in, and then deletes it", () => {
			cy.createAccount(user)
			cy.deleteAccount()
		})
		it("updates account", () => {
			cy.createAccount(user)

			cy.window().then(win => {
				cy.visit(`/user/${win.store.getState().app.user._id}/edit`)

				cy.getBySel("name-input").clear().type("updated name")
				cy.getBySel("biography-input").clear().type("updated biography")
				cy.getBySel("submit-btn").click()
				cy.wait(1000)
				cy.serverRequest(`/api/user/${win.store.getState().app.user._id}`).then(
					res => {
						expect(res.status).to.equal(200)
						expect(res.body.name).to.equal("updated name")
						expect(res.body.biography).to.equal("updated biography")
					}
				)
			})

			cy.deleteAccount()
		})
		it("renders user page correctly", () => {
			cy.createAccount(user)

			cy.window().then(win => {
				cy.visit(`/user/${win.store.getState().app.user._id}`)

				cy.getBySel("avatar")
				cy.getBySel("user-name")
				cy.getBySel("user-biography")
			})
		})
	})
})
