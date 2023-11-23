import { user } from "../fixtures/user"

context("user", () => {
	describe("given the user info", () => {
		it("should create user, log in, and then delete it", () => {
			cy.createAccount(user)

			cy.wait(1000)
			//wait 1s, timeouts not working for getCookie
			cy.getCookie("token").should("exist")
			cy.store().its("app").its("isLoggedIn").should("be.true")

			cy.getUser()
				.its("_id")
				.then(id => {
					cy.visit(`/user/${id}/edit`)
					cy.getBySel("open-delete-account-modal-btn").click()
					cy.getBySel("delete-account-btn").click()
				})

			cy.wait(1000)
			cy.store().its("app").its("isLoggedIn").should("be.false")
		})
		it("should update account", () => {
			cy.createAccount(user)

			cy.getUser()
				.its("_id")
				.then(id => {
					cy.visit(`/user/${id}/edit`)

					cy.getBySel("name-input").clear().type("updated name")
					cy.getBySel("biography-input").clear().type("updated biography")
					cy.getBySel("submit-btn").click()

					cy.wait(1000)
					cy.serverRequest(`/api/user/${id}`).then(res => {
						console.log(res)
						expect(res.status).to.equal(200)
						expect(res.body.name).to.equal("updated name")
						expect(res.body.biography).to.equal("updated biography")
					})
				})
		})
		it("should render user page correctly", () => {
			cy.createAccount(user)

			cy.getUser()
				.its("_id")
				.then(id => {
					cy.visit(`/user/${id}`)

					cy.getBySel("avatar")
					cy.getBySel("user-name")
					cy.getBySel("user-biography")
				})
		})
	})
})
