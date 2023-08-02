import { dequeueAlert, enqueueAlert } from "../../src/app/features/alertSlice"

describe("alerts", () => {
	it("adds and removes alerts", () => {
		cy.visit("/")
		cy.window()
			.its("store")
			.invoke("dispatch", enqueueAlert({ body: "info alert", type: "INFO" }))
		cy.window()
			.its("store")
			.invoke("dispatch", enqueueAlert({ body: "error alert", type: "ERROR" }))
		cy.window()
			.its("store")
			.invoke(
				"dispatch",
				enqueueAlert({ body: "warning alert", type: "WARNING" })
			)
		cy.window()
			.its("store")
			.invoke(
				"dispatch",
				enqueueAlert({ body: "success alert", type: "SUCCESS" })
			)

		cy.window()
			.its("store")
			.invoke("getState")
			.its("alert")
			.its("alertsQueue")
			.should("have.length", 4)

		cy.getBySel("alert").contains("info alert")

		cy.window().its("store").invoke("dispatch", dequeueAlert())
		cy.window().its("store").invoke("dispatch", dequeueAlert())
		cy.window().its("store").invoke("dispatch", dequeueAlert())
		cy.window().its("store").invoke("dispatch", dequeueAlert())

		cy.window()
			.its("store")
			.invoke("getState")
			.its("alert")
			.its("alertsQueue")
			.should("have.length", 0)
	})
})
